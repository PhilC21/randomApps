// functionality to switch between different views on stock page
document.getElementById('show-detailed').addEventListener('click', function() {
    document.getElementById('detailed-view').style.display = 'block';
    document.getElementById('strategy-sma5-view').style.display = 'none';
    document.getElementById('strategy-sma10-view').style.display = 'none';
});

document.getElementById('show-sma5').addEventListener('click', function() {
    document.getElementById('detailed-view').style.display = 'none';
    document.getElementById('strategy-sma5-view').style.display = 'block';
    document.getElementById('strategy-sma10-view').style.display = 'none';
});

document.getElementById('show-sma10').addEventListener('click', function() {
    document.getElementById('detailed-view').style.display = 'none';
    document.getElementById('strategy-sma5-view').style.display = 'none';
    document.getElementById('strategy-sma10-view').style.display = 'block';
});