import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    rootDir: '.',
    testRegex: '.http.test.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    setupFiles: ['../jest.setup.ts'],
    testEnvironment: 'node',
};
export default config;