import dotenv from "dotenv";
import request from "supertest";
import "../dist/config.js";
dotenv.config();
import ableToReset from "../dist/middleware/validation/resetPwd.js";

describe("ableToReset function", () => {
  // Test case 1: When lengths are not equal, it should return false
  it("returns false when lengths are not equal", () => {
    const one = "abcde";
    const two = "abc";
    const result = ableToReset(one, two);
    expect(result).toBe(false);
  });

  // Test case 2: When lengths are less than 6, it should return false
  it("returns false when lengths are less than 6", () => {
    const one = "abc";
    const two = "abcde";
    const result = ableToReset(one, two);
    expect(result).toBe(false);
  });

  // Test case 3: When all characters are the same, it should return true
  it("returns true when all characters are the same", () => {
    const one = "abcdef";
    const two = "abcdef";
    const result = ableToReset(one, two);
    expect(result).toBe(true);
  });

  // Test case 4: When there is a character difference, it should return false
  it("returns false when there is a character difference", () => {
    const one = "abcde";
    const two = "abXde";
    const result = ableToReset(one, two);
    expect(result).toBe(false);
  });
});
