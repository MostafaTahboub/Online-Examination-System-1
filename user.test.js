import "./dist/config.js";
import express from "express";
import request from "supertest";
import userRouter from './dist/routes/home.js';
import dataSource from './dist/DB/dataSource.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use("/home", userRouter);
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

describe("signup process", () => {
    it(" is should return status 200 ", async () => {
        const user = {
            email: "user2@gmail.com",
            passwrod: "123456"
        }
        const response = await request(app).post("/home/signin").send(200);
        expect(response.status).toBe(200);
    });
});


