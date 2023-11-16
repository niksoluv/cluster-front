import { agnes } from 'ml-hclust';

export default class HClust {
  dataset
  k
  MAX_ITERATIONS = 40;
  coefficients = {}
  selectedProps = []

  constructor(dataset) {
    this.dataset = dataset
  }
  getLabelByIndex(index) {
    const point = this.dataset[index]
    return `${this.selectedProps[0]}: ${point[this.selectedProps[0]]}, ${this.selectedProps[1]}: ${point[this.selectedProps[1]]}`
  }
  getDendogramDataWithLabels(data) {
    if (data.children.length !== 0) {
      this.getDendogramDataWithLabels(data.children[0])
      this.getDendogramDataWithLabels(data.children[1])
    }
    else {
      data.name = this.getLabelByIndex(data.index)
    }
  }
  calculate(selectedProps) {
    this.selectedProps = selectedProps
    const features = this.dataset.map(point => [point[selectedProps[0]], point[selectedProps[1]]])

    const dendrogramData = agnes(features);

    const layout = {
      title: 'Hierarchical Clustering Dendrogram',
      xaxis: { title: selectedProps[0] },
      yaxis: { title: selectedProps[1] },
    };
    const treeConfig = {
      nodeSize: { x: 200, y: 100 },
      separation: { siblings: 1, nonSiblings: 2 },
    };
    const dataWithLabels = this.getDendogramDataWithLabels(dendrogramData)
    console.log(dataWithLabels);
    return {
      dendogram: dendrogramData,
      layout: layout,
      treeConfig: treeConfig
    }
  }
}