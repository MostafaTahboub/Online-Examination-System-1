import "../dist/config.js";
import express from "express";
import userRouter from "../dist/routes/home.js";
import dataSource from "../dist/DB/dataSource.js";
import dotenv from "dotenv";
import request from "supertest";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(userRouter);
app.use(express.urlencoded({ extended: false }));

beforeAll(async () => {
  await dataSource
    .initialize()
    .then(() => {
      console.log("DB connected");
    })
    .catch((err) => {
      console.log("DB connection failed", err);
    });
}, 30000);

afterAll(async () => {
  await dataSource.destroy();
});

const roleName = "instructor";

const userData = {
  userName: "hnosh",
  name: "hain",
  email: "hani@22gmail.com",
  password: "4545sfdafds",
  type: roleName,
};

const loginData = {
  email: "hani@22gmail.com",
  password: "4545sfdafds",
};

describe("POST /signup", () => {
  it("should create a new user", async () => {
    const response = await request(app).post("/signup").send(userData);

    expect(response.status).toBe(201);
    expect(response.text).toBe("user has been added successfully");
  });
});

describe("POST /signin", () => {
  it("should login", async () => {
    const response = await request(app).post("/signin").send(loginData);

    expect(response.status).toBe(200);
    expect(response.text).toBe("ok");
  });
});

const generateToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.SECRET_KEY || "", {
    expiresIn: "1h", // Token expiration time (adjust as needed)
  });
};

describe("POST /signout", () => {
  it("should sign out a user with a valid token", async () => {
    const testUser = {
      email: "majed@22gmail.com",
    };

    const token = generateToken(testUser);

    const response = await request(app)
      .post("/signout")
      .set("Cookie", `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe("See You Soon My User");
  });

  it("should return 401 when no valid token is provided", async () => {
    const response = await request(app).post("/signout");

    expect(response.status).toBe(401);
    expect(response.text).toBe("May I Help You To Signin");
  });
});
