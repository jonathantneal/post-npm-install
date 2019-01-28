import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const isBin = String(process.env.NODE_ENV).includes('bin');
const input = `src/${isBin ? 'bin' : 'index'}.js`;
const output = isBin
	? { file: 'bin.js', format: 'cjs' }
: [
	{ file: 'index.js', format: 'cjs' },
	{ file: 'index.mjs', format: 'esm' }
];

export default {
	input,
	output,
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 6 } }]
			]
		}),
		terser(),
		trimUseStrict(),
		addHashBang()
	]
};

function addHashBang() {
	return {
		name: 'add-hash-bang',
		renderChunk(code) {
			return `#!/usr/bin/env node\n${code}`;
		}
	};
}

function trimUseStrict() {
	return {
		name: 'trim-use-strict',
		renderChunk(code) {
			return code.replace(/\s*('|")?use strict\1;\s*/, '');
		}
	};
}
