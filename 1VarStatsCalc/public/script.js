document.getElementById("statsForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const input = document.getElementById("dataInput").value;

    // make an AJAX request to the server to process the data
    fetch('/stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: input })
    })
        .then(response => response.json())
        .then(stats => {
            // display the ordered list
            document.getElementById("orderedList").innerText = stats.orderedList.join(", ");

            // display the stats (without rounding)
            const statsOutput = document.getElementById("statsOutput");
            statsOutput.innerHTML = `
            <li>Number of data points (n): ${stats.n}</li>
            <li>Mean: ${stats.mean}</li>
            <li>Sum: ${stats.sum}</li>
            <li>Sum of squares: ${stats.sumSquares}</li>
            <li>Population Std Dev: ${stats.popStdDev}</li>
            <li>Sample Std Dev: ${stats.sampleStdDev}</li>
            <li>Min: ${stats.min}</li>
            <li>Max: ${stats.max}</li>
            <li>Median: ${stats.median}</li>
            <li>Q1 (First Quartile): ${stats.q1}</li>
            <li>Q3 (Third Quartile): ${stats.q3}</li>
        `;
        })
        .catch(error => console.error('Error:', error));
});
