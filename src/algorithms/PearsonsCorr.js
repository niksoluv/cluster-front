export default class PearsonsCorr {
  data = []
  selectedProperties = []
  numericProperties = []

  constructor(data) {
    this.data = data
  }
  // Function to calculate the mean of an array
  calculateMean = (array) => {
    return array.reduce((sum, value) => sum + value, 0) / array.length;
  }

  // Function to calculate the correlation coefficient
  calculateCorrelationCoefficient = (xArray, yArray) => {
    if (xArray.length !== yArray.length) {
      throw new Error("Arrays must have the same length");
    }

    const n = xArray.length;

    // Calculate the means
    const meanX = this.calculateMean(xArray);
    const meanY = this.calculateMean(yArray);

    // Calculate the numerator and denominators for the correlation coefficient formula
    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;

    for (let i = 0; i < n; i++) {
      numerator += (xArray[i] - meanX) * (yArray[i] - meanY);
      denominatorX += Math.pow(xArray[i] - meanX, 2);
      denominatorY += Math.pow(yArray[i] - meanY, 2);
    }

    // Calculate the correlation coefficient
    const correlationCoefficient = numerator / Math.sqrt(denominatorX * denominatorY);

    return correlationCoefficient;
  }

  getPropArrayByName = (propName) => {
    return this.data.map(point => point[propName])
  }

  calculateCorrelationMatrix = () => {
    const propObject = {}
    this.numericProperties.forEach(prop => {
      propObject[prop] = this.getPropArrayByName(prop)
    })

    let matrix = []
    for (let i = 0; i < this.numericProperties.length; i++) {
      let matrixRow = []
      for (let j = 0; j < this.numericProperties.length; j++) {
        if (i === j) {
          matrixRow.push(1)
        }
        else {
          matrixRow.push(this.calculateCorrelationCoefficient(propObject[this.numericProperties[i]], propObject[this.numericProperties[j]]));
        }
      }
      matrix.push(matrixRow)
    }
    console.log(matrix)
  }

  calculate = (selectedProps, numericProperties) => {
    this.selectedProperties = selectedProps;
    this.numericProperties = numericProperties;
    const xData = this.getPropArrayByName(selectedProps[0]);
    const yData = this.getPropArrayByName(selectedProps[1]);

    const correlation = this.calculateCorrelationCoefficient(xData, yData);

    const correlationMatrix = this.calculateCorrelationMatrix()
    return { correlation: correlation };
  }
}