import postNpmInstall from './index.js';

const setToCi = process.argv.length > 2 && process.argv[2] === 'ci';

postNpmInstall(setToCi);
