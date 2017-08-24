module.exports = {
    testMatch: [
        'test/*.test.js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    verbose: true
};
