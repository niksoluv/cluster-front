import silhouetteScore from "@robzzson/silhouette";

export default class KMeans {
  dataset
  k
  MAX_ITERATIONS = 40;
  coefficients = {}
  selectedProps = []
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
    const result = {};
    result[this.selectedProps[0]] = 0
    result[this.selectedProps[1]] = 0
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
    // this.selectedProps.forEach(prop => {
    //   if (a[prop] !== b[prop])
    //     return false;
    // })

    if (a[this.selectedProps[0]] === b[this.selectedProps[0]] && a[this.selectedProps[1]] === b[this.selectedProps[1]])
      return true
    return false
    //return true;
  }

  shouldStop(oldCentroids, centroids, iterations) {
    if (iterations > this.MAX_ITERATIONS) {
      return true;
    }
    if (!oldCentroids || !oldCentroids.length) {
      return false;
    }
    let sameCount = true;
    for (let i = 0; i < centroids.length; i++) {
      if (!this.compareCentroids(centroids[i], oldCentroids[i])) {
        sameCount = false;
      }
    }
    return sameCount;
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
    let mean = {};
    mean[this.selectedProps[0]] = 0
    mean[this.selectedProps[1]] = 0
    for (let i = start; i < end; i++) {
      mean[this.selectedProps[0]] += (mean[this.selectedProps[0]] + dataSet[i][this.selectedProps[0]]) / n;
      mean[this.selectedProps[1]] += (mean[this.selectedProps[1]] + dataSet[i][this.selectedProps[1]]) / n;
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

  calculate(k, selectedProps, useNaiveSharding = true) {
    this.k = k
    this.selectedProps = selectedProps
    this.coefficients = this.getCoefficients(this.dataset)
    // const centroids = this.getRandomCentroids()
    // console.log(centroids)
    // let labels = this.getLabels(this.dataset, centroids);
    // console.log(labels)
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
        // Save old centroids for convergence test.
        oldCentroids = centroids;
        iterations++;

        // Assign labels to each datapoint based on centroids
        labels = this.getLabels(this.dataset, centroids);
        centroids = this.recalculateCentroids(this.dataset, labels, k);
      }

      const clusters = [];
      for (let i = 0; i < k; i++) {
        clusters.push(labels[i]);
      }
      const results = {
        clusters: clusters,
        centroids: centroids,
        numOfRecords: this.dataset.length,
        iterations: iterations,
        converged: iterations <= this.MAX_ITERATIONS,
      };
      const end = performance.now();
      console.log(`K-Means: ${end - start} ms`);
      // const data = [
      //   [-9.67867, -4.20271],
      //   [0.08525, 3.64528],
      //   [-7.38729, -8.53728],
      //   [-5.93111, -9.25311],
      //   [-8.5356, -6.01348],
      //   [-2.18773, 3.33352],
      //   [-0.79415, 2.10495],
      // ];
      // const l = [1, 0, 2, 2, 1, 0, 0];

      // let score = silhouetteScore(data, l);
      // console.log(score);
      return results
    } else {
      throw new Error('Invalid dataset');
    }
  }
}