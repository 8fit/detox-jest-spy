module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/dist/"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  reporters: ["default", "jest-junit"]
};
