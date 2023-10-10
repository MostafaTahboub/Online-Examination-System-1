import express from 'express';
import './config.js'
import dataSource from './DB/dataSource.js';
import { User } from './DB/Entities/User.js';
import { Profile } from './DB/Entities/Profile.js';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.status(200).send("app is running succefully");
});


app.listen(PORT, () => {
    console.log(`App is lestining to PORT  : ` + PORT);
    console.log(process.env.DB_USER);
    dataSource.initialize();
});





