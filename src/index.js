import { exec as callbackExec, execSync } from 'child_process';
import { access, constants as fsconstants } from "fs";
var finder = require('find-package-json');
var path = require('path');

export default function postNpmInstall(useCi = false) {
	getPackageJsonFilename().then(packageJsonFilename => 
		checkChanges(packageJsonFilename)
	)
	.then(haveDepsChanged => {
		if (haveDepsChanged) {
			// figure out if we should use ci command
			return canUseCi(useCi);
		} else {
			// exit early if no changes
			process.exit(0);
		}
	}) 
	.then(useCi => {
		execSync(useCi ? 'npm ci' : 'npm install', { stdio: ['pipe', 'pipe', process.stderr] })
		
		console.log('Please restart the server.')
	})
	.then(
		() => process.exit(0),
		error => {
			console.error(error);
			
			process.exit(1);
		});
	}
	
const getPackageJsonFilename = () => exec('git rev-parse --show-toplevel')
	.then(gitRoot => {
		let f = finder();
		const nextPackageJson = f.next();
		if (nextPackageJson.done) {
			throw new Error('No package.json found');
		}
		// ensure path is posix-formatted for git-show
		// git rev-parse --show-toplevel returns a \n, which we need to trim
		return path.posix.format(path.parse(path.relative(gitRoot.trim(), nextPackageJson.filename)));
	})
	
	// read the current and last package.json files
const checkChanges = (packageJsonFilename = "package.json") => Promise.all(
	[
		exec(`git show ORIG_HEAD:${packageJsonFilename}`),
		exec(`git show HEAD:${packageJsonFilename}`)
	]).then(pkgs => {
		// read the current and last package.json files as objects
		const pkg1 = JSON.parse(pkgs[0])
		const pkg2 = JSON.parse(pkgs[1])

		// conditionally run install if package dependencies have changed
		return haveObjectValuesChanged(pkg1.dependencies, pkg2.dependencies) ||
		haveObjectValuesChanged(pkg1.devDependencies, pkg2.devDependencies)
	}, error => {
		const catchableError = /^fatal: Invalid object name/;
		if (!catchableError.test(error)) {
			throw new Error(catchableError);
		}
	});

const canUseCi = (optForCi) => Promise.all([
		checkNpmCiExist(),
		doesPackageLockJsonExist()
	])
	.then(([hasCiCmd, hasLock]) => {
		if (!hasLock && optForCi) { 
			console.warn(`
Please ensure you have a lockfile before attempting to use npm ci. 
Falling back to npm install.`);
		}
		
		return hasCiCmd && hasLock && optForCi;
	});

// promise-ified exec
const exec = (cwd, opts) => new Promise((resolve, reject) => {
	callbackExec(cwd, Object(opts), (error, stdout, stderr) => {
		if (error) {
			reject(stderr)
		} else {
			resolve(stdout)
		}
	})
});

const checkNpmCiExist = () => exec('npm ci --help')
.then(output => output.toString() === 'npm ci');

const doesPackageLockJsonExist = () => new Promise((resolve) => {
	access('package-lock.json', fsconstants.R_OK, (err) => {
		resolve(!err);
	});
});

// return whether the values of two objects differ
const haveObjectValuesChanged = (dep1, dep2) => Object.keys(Object(dep1))
.concat(Object.keys(Object(dep2)))
.some(key => dep1[key] !== dep2[key]);
