module.exports = {
    roots: ["<rootDir>"],
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        },
    },
    collectCoverage: true,
    collectCoverageFrom: ["**/*.{ts,tsx}"],
    coverageDirectory: "coverage",
    globals: {
        "ts-jest": {
            diagnostics: false,
        }
    },
    moduleNameMapper: {
        "\\.(css|scss|png|jpg|svg)$": "<rootDir>/src/utils/test/__mocks__/image-mock.tsx"
    }
};
