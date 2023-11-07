import dotenv from "dotenv";
import request from "supertest";
import "../dist/config.js";
dotenv.config();
import { generateExamCode } from "../dist/controllers/exam.js";

describe("generateExamCode", () => {
  it("should generate a valid exam code", () => {
    const title = "simple";

    const examCode = generateExamCode(title);

    const expectedPattern = new RegExp(
      `^${title.replace(/\s+/g, "-").toLowerCase()}-[0-9A-Fa-f]{6}$`
    );

    expect(expectedPattern.test(examCode)).toBe(true);
  });
});
