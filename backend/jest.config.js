module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    verbose: true,
    forceExit: true,
    // setupFiles: ['dotenv/config'], // Uncomment if we need .env in tests, but server.js loads it
};
