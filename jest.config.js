module.exports = {
    testMatch: [
        '<rootDir>/src/**/*.test.js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/testSetup.js']
};
