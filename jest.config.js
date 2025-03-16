// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Try multiple patterns to see which one works
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/*.test.ts",
    "**/src/**/__tests__/**/*.test.ts",
    "**/src/**/*.test.ts",
  ],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        // ts-jest config goes here
        tsconfig: "tsconfig.json",
      },
    ],
  },
  // Remove the globals section since it's deprecated
};
