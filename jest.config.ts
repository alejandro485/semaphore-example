import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    rootDir: 'src',
    testRegex: '.*\\.test\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    setupFiles: ['../jest.setup.ts'],
    testEnvironment: 'node',
};
export default config;