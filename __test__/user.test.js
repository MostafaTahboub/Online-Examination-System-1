import "../dist/config.js";
import express from "express";
import request from "supertest";
import userRouter from '../dist/routes/home.js';
import dataSource from '../dist/DB/dataSource.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use(express.urlencoded({ extended: false }));


beforeAll(async () => {
  await dataSource.initialize().then(() => {
        console.log('DB connected');
    }).catch(err => {
        console.log("DB connection failed", err);
    });
}, 30000);

afterAll(async () => {
  await dataSource.destroy();
});

describe("Login process", () => {
    it("should sign up with valid credentials", async () => {
        const newUser = {
            "name": "mohammad",
    "userName": "moha",
    "password": "123456",
    "email": "mohammad@gmil.com",
    "type": "student"
        };

        const x = await request(app).post("/home/signup").send(newUser);

        expect(x.status).toMatch(201);
    });
  it("should login with valid credentials", async () => {
    const user = {
      email: "mohammad@gmail.com",
      password: "123456"
    };

    const response = await  request(app).post("/home/signin").send(user);

    expect(response.status).toBe(200);
  });
});

