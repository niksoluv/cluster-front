
export default class MiniBatchKMeans {
  dataset
  k
  MAX_ITERATIONS = 40;
  coefficients = {}
  selectedProps = []
  batches = []
  batchSize = 0
  numOfBatches = 0
  constructor(dataset) {
    this.dataset = dataset
  }

  getCoefficients = (dataset) => {
    let maxValue = 0
    let result = {}
    this.selectedProps.forEach(prop => {
      dataset.forEach(element => {
        if (element[prop] > maxValue) {
          maxValue = element[prop]
        }
      });
      result[`${prop}`] = 1 / maxValue
      maxValue = 0
    })
    return result
  }

  randomBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  getRandomCentroids() {
    // selects random points as centroids from the dataset
    const numSamples = this.dataset.length;
    const centroidsIndex = [];
    let index;
    while (centroidsIndex.length < this.k) {
      index = this.randomBetween(0, numSamples);
      if (centroidsIndex.indexOf(index) === -1) {
        centroidsIndex.push(index);
      }
    }
    const centroids = [];
    for (let i = 0; i < centroidsIndex.length; i++) {
      const centroid = this.dataset[centroidsIndex[i]];
      centroids.push(centroid);
    }
    return centroids;
  }

  // Calculate Squared Euclidean Distance
  getDistanceSQ(a, b) {
    if (this.selectedProps.length === 2) {
      return Math.sqrt(
        Math.pow(b[this.selectedProps[0]] * this.coefficients[this.selectedProps[0]] - a[this.selectedProps[0]] * this.coefficients[this.selectedProps[0]], 2) +
        Math.pow(b[this.selectedProps[1]] * this.coefficients[this.selectedProps[1]] - a[this.selectedProps[1]] * this.coefficients[this.selectedProps[1]],
          2))
    }
  }

  getPointsMean(pointList) {
    const totalPoints = pointList.length;
    const result = { Age: 0, Salary: 0 };
    this.selectedProps.forEach(prop => {
      for (let i = 0; i < pointList.length; i++) {
        const point = pointList[i];
        result[prop] += point[prop];
      }
      result[prop] = result[prop] / totalPoints;
    })
    // for (let i = 0; i < pointList.length; i++) {
    //   const point = pointList[i];
    //   result['Age'] += point['Age'];
    //   result['Salary'] += point['Salary'];
    // }
    // result['Age'] = result['Age'] / totalPoints;
    // result['Salary'] = result['Salary'] / totalPoints;
    return result;
  }

  recalculateCentroids(dataSet, labels, k) {
    // Each centroid is the geometric mean of the points that
    // have that centroid's label. Important: If a centroid is empty (no points have
    // that centroid's label) you should randomly re-initialize it.
    let newCentroid;
    const newCentroidList = [];
    for (const k in labels) {
      const centroidGroup = labels[k];
      if (centroidGroup.points.length > 0) {
        // find mean:
        newCentroid = this.getPointsMean(centroidGroup.points);
      } else {
        // get new random centroid
        newCentroid = this.getRandomCentroids(dataSet, 1)[0];
      }
      newCentroidList.push(newCentroid);
    }
    return newCentroidList;
  }

  compareCentroids(a, b) {
    this.selectedProps.forEach(prop => {
      if (a[prop] !== b[prop])
        return false;
    })

    // if (a['Age'] === b['Age'] && a['Salary'] === b['Salary'])
    //   return true

    return true;
  }

  shouldStop(oldCentroids, centroids, iterations) {
    if (iterations > this.MAX_ITERATIONS) {
      return true;
    }
    // if (!oldCentroids || !oldCentroids.length) {
    //   return false;
    // }
    // let sameCount = true;
    // for (let i = 0; i < centroids.length; i++) {
    //   if (!this.compareCentroids(centroids[i], oldCentroids[i])) {
    //     sameCount = false;
    //   }
    // }
    // return sameCount;
  }

  // Returns a label for each piece of data in the dataset. 
  getLabels(dataSet, centroids) {
    // prep data structure:
    const labels = {};
    for (let c = 0; c < centroids.length; c++) {
      labels[c] = {
        points: [],
        centroid: centroids[c],
      };
    }
    // For each element in the dataset, choose the closest centroid. 
    // Make that centroid the element's label.
    for (let i = 0; i < dataSet.length; i++) {
      const a = dataSet[i];
      let closestCentroid, closestCentroidIndex, prevDistance;
      for (let j = 0; j < centroids.length; j++) {
        let centroid = centroids[j];
        if (j === 0) {
          closestCentroid = centroid;
          closestCentroidIndex = j;
          prevDistance = this.getDistanceSQ(a, closestCentroid);
        } else {
          // get distance:
          const distance = this.getDistanceSQ(a, centroid);
          if (distance < prevDistance) {
            prevDistance = distance;
            closestCentroid = centroid;
            closestCentroidIndex = j;
          }
        }
      }
      // add point to centroid labels:
      labels[closestCentroidIndex].points.push(a);
    }
    return labels;
  }

  calcMeanCentroid(dataSet, start, end) {
    const n = end - start;
    let mean = {
      'Age': 0,
      'Salary': 0,
    };
    for (let i = start; i < end; i++) {
      mean['Age'] += mean['Age'] + dataSet[i]['Age'] / n;
      mean['Salary'] += mean['Salary'] + dataSet[i]['Salary'] / n;
    }
    return mean;
  }

  getRandomCentroidsNaiveSharding(dataset, k) {
    // implementation of a variation of naive sharding centroid initialization method
    // (not using sums or sorting, just dividing into k shards and calc mean)
    // https://www.kdnuggets.com/2017/03/naive-sharding-centroid-initialization-method.html
    const numSamples = dataset.length;
    // Divide dataset into k shards:
    const step = Math.floor(numSamples / k);
    const centroids = [];
    for (let i = 0; i < k; i++) {
      const start = step * i;
      let end = step * (i + 1);
      if (i + 1 === k) {
        end = numSamples;
      }
      centroids.push(this.calcMeanCentroid(dataset, start, end));
    }
    return centroids;
  }

  appendToLabels(labels, labelsToAppend) {
    for (let i = 0; i < this.k; ++i) {
      labels[i].points = labels[i].points.concat(labelsToAppend[i].points)
    }
    return labels
  }

  calculate(k, selectedProps, useNaiveSharding = true) {
    this.k = k
    this.numOfBatches = k
    if(this.dataset.length>1000){
      this.numOfBatches=this.dataset.length/100
    }
    this.batches = []
    this.batchSize = (this.dataset.length / this.numOfBatches).toFixed(0)
    this.selectedProps = selectedProps
    this.coefficients = this.getCoefficients(this.dataset)

    for (let i = 0; i < this.numOfBatches; ++i) {
      if (i !== this.numOfBatches - 1) {
        this.batches.push(this.dataset.slice(i * this.batchSize, (i + 1) * this.batchSize))
      }
      else {
        this.batches.push(this.dataset.slice(i * this.batchSize, (i + 1) * this.batchSize - ((i + 1) * this.batchSize - this.dataset.length)))
      }
    }
    const start = performance.now();

    if (this.dataset.length && this.dataset[0] && this.dataset.length > k) {
      // Initialize book keeping variables
      let iterations = 0;
      let oldCentroids, labels, centroids;

      // Initialize centroids randomly
      if (useNaiveSharding) {
        centroids = this.getRandomCentroidsNaiveSharding(this.dataset, k);
      } else {
        centroids = this.getRandomCentroids(this.dataset, k);
      }

      // Run the main k-means algorithm
      while (!this.shouldStop(oldCentroids, centroids, iterations)) {
        oldCentroids = centroids;
        iterations++;
        let tempLabels = []
        // eslint-disable-next-line no-loop-func
        this.batches.forEach((batch) => {
          let batchLabels = this.getLabels(batch, centroids);
          if (tempLabels.length === 0) {
            tempLabels = batchLabels
          }
          else {
            tempLabels = this.appendToLabels(tempLabels, batchLabels)
          }
          // Assign labels to each datapoint based on centroids
        })
        labels = tempLabels
        // if (iterations === 1) {
        //   labels = tempLabels
        // }
        // else {
        //   labels = this.appendToLabels(labels, tempLabels)
        // }
        centroids = this.recalculateCentroids(this.dataset, labels, k);
        // Save old centroids for convergence test.

      }

      const clusters = [];
      for (let i = 0; i < k; i++) {
        clusters.push(labels[i]);
      }
      const results = {
        clusters: clusters,
        centroids: centroids,
        iterations: iterations,
        converged: iterations <= this.MAX_ITERATIONS,
      };
      const end = performance.now();
      console.log(`Mini batch K-Means: ${end - start} ms`);
      return results
    } else {
      throw new Error('Invalid dataset');
    }
  }
}
