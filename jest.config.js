/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: './FixJSDOMEnvironment.ts',
	testPathIgnorePatterns: [
		'/node_modules/',
		'/lib/',
		'/dist/',
		'/test/',
		'/.+\\.d\\.ts$',
	],
	transform: {
		'^.+\\.css$': 'jest-transform-css',
	},
	transformIgnorePatterns: [],
	verbose: true,
};
