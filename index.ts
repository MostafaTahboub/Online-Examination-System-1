import express from 'express';
import dataSource from './DB/dataSource.js';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send("app is running succefully");
});


app.listen(PORT, () => {
    console.log(`App is lestining to PORT  : ` + PORT);
    // dataSource.initialize();
});





