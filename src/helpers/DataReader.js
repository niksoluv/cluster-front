import * as XLSX from 'xlsx'

export default class DataReader {
  file
  jsonData
  constructor(file = null) {
    this.file = file
  }
  
  handleFile = async (e) => {
    const file = e.target.files[0]
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)

    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    this.jsonData = jsonData
    console.log(jsonData)
    return this.jsonData
  }

  readData = async (e) => {
    const file = e.target.files[0]
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)

    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    // const jsonData = XLSX.utils.sheet_to_json(worksheet)
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: ''
    })

    return jsonData
  }
}