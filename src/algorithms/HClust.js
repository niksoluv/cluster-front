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
    console.log(point)
    return `Cluster ${index}`//${this.selectedProps[0]}: ${point[this.selectedProps[0]].toFixed(2)}, ${this.selectedProps[1]}: ${point[this.selectedProps[1]].toFixed(2)}`
  }
  getDendogramDataWithLabels(data) {
    if (data.children.length !== 0) {
      //data.name = "test"// make avg label by childrens
      this.getDendogramDataWithLabels(data.children[0])
      this.getDendogramDataWithLabels(data.children[1])
    }
    else {
      const attributes = {}
      this.selectedProps.forEach(prop=>attributes[prop] = this.dataset[data.index][prop].toFixed(2))
      data.name = this.getLabelByIndex(data.index)
      data.attributes=attributes
    }
  }
  calculate(selectedProps, dataset) {
    this.dataset = dataset
    this.selectedProps = selectedProps
    const features = this.dataset.map(point => [point[selectedProps[0]], point[selectedProps[1]]])

    const dendrogramData = agnes(features, {
      method: 'ward',
    });
    //const clusters = dendrogramData.cut(1500)
    const layout = {
      title: 'Hierarchical Clustering Dendrogram',
      xaxis: { title: selectedProps[0] },
      yaxis: { title: selectedProps[1] },
    };
    const treeConfig = {
      nodeSize: { x: 200, y: 100 },
      separation: { siblings: 1, nonSiblings: 2 },
    };
    this.getDendogramDataWithLabels(dendrogramData)
    return {
      dendogram: dendrogramData,
      layout: layout,
      treeConfig: treeConfig
    }
  }
}