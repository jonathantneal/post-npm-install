import { exec as callbackExec, execSync } from 'child_process';

export default function postNpmInstall() {
	// read the current and last package.json files
	Promise.all([
		exec('git show ORIG_HEAD:package.json'),
		exec('git show HEAD:package.json')
	]).then(pkgs => {
		// read the current and last package.json files as objects
		const pkg1 = JSON.parse(pkgs[0])
		const pkg2 = JSON.parse(pkgs[1])

		// conditionally run `npm install` if package dependencies have changed
		const haveDepsChanged =
			haveObjectValuesChanged(pkg1.dependencies, pkg2.dependencies) ||
			haveObjectValuesChanged(pkg1.devDependencies, pkg2.devDependencies)

		if (haveDepsChanged) {
			execSync('npm install', { stdio: ['pipe', 'pipe', process.stderr] })

			console.log('Please restart the server.')
		}
	}, error => {
		const catchableError = /^fatal: Invalid object name/;

		if (!catchableError.test(error)) {
			throw new Error(catchableError);
		}
	}).then(
		() => process.exit(0),
		error => {
			console.error(error);

			process.exit(1);
		}
	);
}

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

// return whether the values of two objects differ
const haveObjectValuesChanged = (dep1, dep2) => Object.keys(Object(dep1))
.concat(Object.keys(Object(dep2)))
.some(key => dep1[key] !== dep2[key]);
