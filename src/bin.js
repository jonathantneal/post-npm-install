import postNpmInstall from './index.js';

const args = process.argv.slice(2);
const setToCi = process.argv.length > 2 && process.argv[2] === 'ci';

postNpmInstall(setToCi);
