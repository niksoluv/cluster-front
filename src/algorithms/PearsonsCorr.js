export default class PearsonsCorr {
  data = []
  numericProperties = []

  constructor(data) {
    this.data = data
  }
  calculateMean = (array) => {
    return array.reduce((sum, value) => sum + value, 0) / array.length;
  }

  calculateCorrelationCoefficient = (xArr, yArr) => {
    const n = xArr.length;

    const meanX = this.calculateMean(xArr);
    const meanY = this.calculateMean(yArr);

    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;

    for (let i = 0; i < n; i++) {
      numerator += (xArr[i] - meanX) * (yArr[i] - meanY);
      denominatorX += Math.pow(xArr[i] - meanX, 2);
      denominatorY += Math.pow(yArr[i] - meanY, 2);
    }

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
          let corr = this.calculateCorrelationCoefficient(
            propObject[this.numericProperties[i]],
            propObject[this.numericProperties[j]])
          if (isNaN(corr)) {
            corr = 0
          }
          matrixRow.push(corr.toFixed(2));
        }
      }
      matrix.push({ data: matrixRow, name: this.numericProperties[i] })
    }
    return matrix
  }

  calculate = (selectedProps, numericProperties) => {
    this.numericProperties = numericProperties;

    const correlationMatrix = this.calculateCorrelationMatrix()
    return { correlation: correlationMatrix };
  }
}