import { api } from "./configs/axiosConfig"
import { defineCancelApiObject } from "./configs/axiosUtils"

export const ResultsAPI = {
  getData: async (user, cancel = false) => {
    const response = await api.post("/results/data", user)
    return response.data
  },
  saveData: async (data, user) => {
    const stringData = JSON.stringify(data)
    const response = await api.post("/results/saveData", {
      data: stringData, user: user
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    })

    // returning the product returned by the API
    return response.data
  },
  getHistory: async () => {
    try {
      const response = await api.get("/results/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      return response.data
    }
    catch (err) {
      console.log(err)
    }
  }
  // getInfo: async (cancel = false) => {
  //   try {
  //     const response = await api.get("/users/info", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`
  //       }
  //     })

  //     // returning the product returned by the API
  //     return response.data
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }
  // },
}

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(ResultsAPI)