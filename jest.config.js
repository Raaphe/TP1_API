/** @type {import('ts-jest').JestConfigWithTsJest} **/
export const preset = 'ts-jest';
export const testEnvironment = "node";
export const transform = {
  "^.+.tsx?$": ["ts-jest", {}],
};