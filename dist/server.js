import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import 'chartjs-adapter-date-fns';
// Load the data from the JSON file
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
const app = express();
const PORT = 5000;
app.use(bodyParser.json());
app.use(cors());
app.post('/getData', (req, res) => {
    const { symbol, startDate, endDate } = req.body;
    const marketData = data[symbol].filter((entry) => new Date(entry.date) >= new Date(startDate) && new Date(entry.date) <= new Date(endDate));
    res.json(marketData);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
