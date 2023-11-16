import { DBScan } from "./DBScan";

export default class DBScanAlgorithm {
  constructor(dataset) {
    this.dataset = dataset
  }

  calculate(selectedProps) {
    this.selectedProps = selectedProps

    const start = performance.now();
    var dbscanner = DBScan()
      .eps(37)
      .minPts(30)
      .distance('MANHATTAN')
      //.timeEps(1800)
      .data(this.dataset);
    for (let i = 0; i < 100; ++i) {
      dbscanner = DBScan()
        .eps(i)
        .minPts(15)
        .distance('MANHATTAN')
        //.timeEps(1800)
        .data(this.dataset);
      let scan = dbscanner()
      console.log(scan.filter(el => el === 0),scan.filter(el => el === 1),scan.filter(el => el === 2), i)
    }
    const dbscanRes = dbscanner()

    const labels = {}
    dbscanRes.forEach((d, i) => {
      labels[d] = this.dataset[i]
    })
    console.log(labels)

    // const clusters = [];
    // for (let i = 0; i < k; i++) {
    //   clusters.push(labels[i]);
    // }
    // const results = {
    //   clusters: clusters,
    //   centroids: centroids,
    //   iterations: iterations,
    //   converged: iterations <= this.MAX_ITERATIONS,
    // };
    const end = performance.now();
    console.log(`DBScan: ${end - start} ms`);
    return {}
  }
}