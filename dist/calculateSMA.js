export function calculateSMA(data, windowSize) {
    let sum = 0;
    const sma = new Array(windowSize - 1).fill(null);
    for (let i = 0; i < windowSize; i++) {
        sum += parseFloat(data[i].close);
    }
    sma.push(sum / windowSize);
    for (let i = windowSize; i < data.length; i++) {
        sum -= parseFloat(data[i - windowSize].close);
        sum += parseFloat(data[i].close);
        sma.push(sum / windowSize);
    }
    return sma;
}
