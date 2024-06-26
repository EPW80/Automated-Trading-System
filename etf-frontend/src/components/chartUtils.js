export function calculateSMA(data, windowSize) {
  if (!data || data.length < windowSize) return [];

  let sum = 0;
  const sma = new Array(windowSize - 1).fill(null); // Fill the initial array with nulls

  // Calculate the sum for the first window
  for (let i = 0; i < windowSize; i++) {
    if (data[i] && data[i].close !== undefined) {
      sum += parseFloat(data[i].close);
    } else {
      return [];
    }
  }
  sma.push(sum / windowSize);

  // Calculate the rest using a rolling sum
  for (let i = windowSize; i < data.length; i++) {
    if (
      data[i] &&
      data[i].close !== undefined &&
      data[i - windowSize] &&
      data[i - windowSize].close !== undefined
    ) {
      sum -= parseFloat(data[i - windowSize].close);
      sum += parseFloat(data[i].close);
      sma.push(sum / windowSize);
    } else {
      return [];
    }
  }

  return sma;
}

// Function to calculate Flexible Moving Average (FMA)
export function calculateFMA(data, windowSize) {
  if (!data || data.length === 0) return [];

  const alpha = 2 / (windowSize + 1);
  let fma = [parseFloat(data[0].close)]; // Initialize with the first close value

  for (let i = 1; i < data.length; i++) {
    if (data[i] && data[i].close !== undefined) {
      fma.push(alpha * parseFloat(data[i].close) + (1 - alpha) * fma[i - 1]);
    } else {
      return [];
    }
  }

  return fma;
}
