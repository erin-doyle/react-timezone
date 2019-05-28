module.exports = {
    testMatch: [
        '<rootDir>/test/**/*.test.js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    verbose: true,
    setupTestFrameworkScriptFile: '<rootDir>/test/testSetup.js'
};
