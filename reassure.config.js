module.exports = {
  setupFilesAfterEnv: ['./src/__tests__/setup.js'],
  testMatch: ['**/__performance__/**/*.perf.[jt]s?(x)'],
  outputFile: './performance-results.json',
  updateSnapshot: process.env.UPDATE_SNAPSHOTS === 'true',
  iterationCount: 10,
};
