function oneVarStats(data) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Data should be a non-empty array.");
    }

    // sort the data
    const sortedData = [...data].sort((a, b) => a - b);
    const n = data.length;
    
    // calculate mean
    const mean = data.reduce((sum, value) => sum + value, 0) / n;
    
    // calculate sum
    const sum = data.reduce((sum, value) => sum + value, 0);
    
    // calculate sum of squares
    const sumSquares = data.reduce((sum, value) => sum + value ** 2, 0);

    // population standard deviation
    const popVariance = data.reduce((sum, value) => sum + (value - mean) ** 2, 0) / n;
    const popStdDev = Math.sqrt(popVariance);

    // sample standard deviation
    const sampleVariance = data.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (n - 1);
    const sampleStdDev = Math.sqrt(sampleVariance);

    // minimum and Maximum
    const min = sortedData[0];
    const max = sortedData[sortedData.length - 1];

    // median calculation
    const median = (n % 2 === 0)
        ? (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2
        : sortedData[Math.floor(n / 2)];

    // calculate Q1 and Q3 (quartiles)
    let lowerHalf, upperHalf;
    
    if (n % 2 === 0) {
        // even number of data points: split in half evenly
        lowerHalf = sortedData.slice(0, n / 2);
        upperHalf = sortedData.slice(n / 2);
    } else {
        // odd number of data points: exclude the median for the two halves
        lowerHalf = sortedData.slice(0, Math.floor(n / 2));
        upperHalf = sortedData.slice(Math.floor(n / 2) + 1);
    }

    // Q1: median of the lower half
    const q1 = (lowerHalf.length % 2 === 0)
        ? (lowerHalf[lowerHalf.length / 2 - 1] + lowerHalf[lowerHalf.length / 2]) / 2
        : lowerHalf[Math.floor(lowerHalf.length / 2)];

    // Q3: median of the upper half
    const q3 = (upperHalf.length % 2 === 0)
        ? (upperHalf[upperHalf.length / 2 - 1] + upperHalf[upperHalf.length / 2]) / 2
        : upperHalf[Math.floor(upperHalf.length / 2)];

    return {
        n,
        mean,
        sum,
        sumSquares,
        popStdDev,
        sampleStdDev,
        min,
        max,
        median,
        q1,
        q3,
        orderedList: sortedData
    };
}

// express route handler for the stats calculation
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { data } = req.body;

    try {
        // convert the comma-separated string to an array of numbers
        const dataArray = data.split(',').map(Number);

        // validate input
        if (dataArray.some(isNaN)) {
            return res.status(400).json({ error: "Invalid input. Please provide a comma-separated list of numbers." });
        }

        // calculate statistics
        const stats = oneVarStats(dataArray);

        // send the results back to the client
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
