// calculate simple moving average (SMA)
function calculateSMA(data, period) {
    const smaData = [];
    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const average = slice.reduce((acc, val) => acc + val, 0) / period;
        smaData.push(average);
    }
    return smaData;
}

// calculate exponential moving average (EMA)
function calculateEMA(data, period) {
    const emaData = [];
    const multiplier = 2 / (period + 1);
    
    // first EMA value is the SMA of the first period
    let ema = data.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
    emaData.push(ema);
    
    // calculate EMA for the rest of the data
    for (let i = period; i < data.length; i++) {
        ema = (data[i] - ema) * multiplier + ema;
        emaData.push(ema);
    }

    return emaData;
}

function suggestStrategy(prices, sma) {
    if (prices[prices.length - 1] > sma[sma.length - 1]) {
        return "Buy (Current price is above the moving average)";
    } else if (prices[prices.length - 1] < sma[sma.length - 1]) {
        return "Sell (Current price is below the moving average)";
    }
    return "Hold (Price is near the moving average)";
}


// strategy suggestion based on SMA and EMA
/*
function suggestStrategy(prices, sma, ema) {
    const latestPrice = prices[prices.length - 1];
    const latestSMA = sma[sma.length - 1];
    const latestEMA = ema[ema.length - 1];

    if (latestPrice > latestSMA && latestPrice > latestEMA) {
        return "Strong Buy (Price is above both SMA and EMA)";
    } else if (latestPrice < latestSMA && latestPrice < latestEMA) {
        return "Strong Sell (Price is below both SMA and EMA)";
    } else if (latestPrice > latestSMA || latestPrice > latestEMA) {
        return "Weak Buy (Price is above one of SMA or EMA)";
    } else if (latestPrice < latestSMA || latestPrice < latestEMA) {
        return "Weak Sell (Price is below one of SMA or EMA)";
    }
    return "Hold (No strong consensus)";
}
*/


// export the functions to be used in other files
module.exports = {
    calculateSMA,
    calculateEMA,
    suggestStrategy
};
