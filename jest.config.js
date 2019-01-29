module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/dist/"],
  collectCoverage: true,
  coverageDirectory: "test-results",
  collectCoverageFrom: ["src/**/*.ts"]
};
