const express = require('express');
const axios = require('axios');
const { calculateSMA, suggestStrategy, calculateEMA } = require('./utils/strategyUtils');
const app = express();
const expressLayouts = require('express-ejs-layouts');

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout/main');

// Serve static files from the public directory
app.use(express.static('public'));

// route to render index page
app.get('/', (req, res) => {
    res.render('index', { title: 'Stock Data Viewer' });
});

// Stock route with SMA, strategy suggestion, and detailed stock data
app.get('/stock', async (req, res) => {
    const symbol = req.query.symbol.toUpperCase();
    try {
        // first API call for minute-by-minute data (1-day intraday data)
        const minuteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
        const minuteResponse = await axios.get(minuteUrl);
        const minuteData = minuteResponse.data.chart.result[0].indicators.quote[0];
        const minuteTimestamps = minuteResponse.data.chart.result[0].timestamp;

        // second API call for daily data (needed for 5-day and 10-day SMA)
        const dailyUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
        const dailyResponse = await axios.get(dailyUrl);
        const dailyData = dailyResponse.data.chart.result[0].indicators.quote[0];
        const dailyTimestamps = dailyResponse.data.chart.result[0].timestamp;

        // structure minute-by-minute data for detailed stock view
        const detailedStockData = minuteTimestamps.map((timestamp, index) => ({
            time: new Date(timestamp * 1000).toLocaleTimeString(),
            open: minuteData.open[index],
            high: minuteData.high[index],
            low: minuteData.low[index],
            close: minuteData.close[index],
            volume: minuteData.volume[index]
        }));

        // calculate both 5-day and 10-day SMAs
        const closePrices = dailyData.close;
        const sma5 = calculateSMA(closePrices, 5);
        const sma10 = calculateSMA(closePrices, 10);
        const suggestion5 = suggestStrategy(closePrices, sma5);
        const suggestion10 = suggestStrategy(closePrices, sma10);

        // structure the data for both SMAs
        const structuredSMAData = dailyTimestamps.map((timestamp, index) => ({
            time: new Date(timestamp * 1000).toLocaleDateString(),
            close: closePrices[index],
            sma5: index >= 4 ? sma5[index - 4] : null,  // 5-day SMA after 5 days
            sma10: index >= 9 ? sma10[index - 9] : null  // 10-day SMA after 10 days
        }));

        // render stock.ejs with minute-by-minute data and both SMAs
        res.render('stock', { 
            title: `Stock Data for ${symbol}`, 
            symbol, 
            detailedStockData,  // Minute-by-minute data
            structuredSMAData,  // Data for both 5-day and 10-day SMAs
            suggestion5,         // Strategy suggestion for 5-day SMA
            suggestion10         // Strategy suggestion for 10-day SMA
        });
    } catch (error) {
        console.error(error);
        res.send('Error fetching stock data');
    }
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (error) {
        console.log(`Something went wrong. ${error}`);
    } else {
        console.log(`Server running at http://localhost:${PORT}/`);
    }
});