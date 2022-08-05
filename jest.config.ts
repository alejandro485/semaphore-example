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
    collectCoverageFrom: [
        '**/*.(t|j)s'
    ],
    coverageDirectory: '../test-result',
    setupFiles: ['../jest.setup.ts'],
};
export default config;