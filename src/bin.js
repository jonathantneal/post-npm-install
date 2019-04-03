import postNpmInstall from './index.js';

const args = process.argv.slice(2);
setToCi = args.length > 0 && args[0] === 'ci';

postNpmInstall(setToCi);
