import dotenv from "dotenv";
import request from "supertest";
import "../dist/config.js";
dotenv.config();
import { shuffleArray } from "../dist/controllers/exam.js";

describe("shuffleArray", () => {
  it("should shuffle an array", () => {
    const testArray = [1, 2, 3, 4, 5];

    const originalArray = [...testArray];

    shuffleArray(testArray);

    expect(testArray).not.toEqual(originalArray);

    expect(testArray).toEqual(expect.arrayContaining(originalArray));
  });
});
