import { api } from "./configs/axiosConfig"
import { defineCancelApiObject } from "./configs/axiosUtils"

export const UserAPI = {
  logIn: async (user, cancel = false) => {
    const response = await api.post("/users/login", user)
    return response.data
  },
  register: async (user, cancel = false) => {
    const response = await api.post("/users/register", user)

    // returning the product returned by the API
    return response.data
  },
  getInfo: async (cancel = false) => {
    const response = await api.get("/users/info", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

    // returning the product returned by the API
    return response.data
  },
}

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(UserAPI)