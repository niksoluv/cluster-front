import { api } from "./configs/axiosConfig"
//import { defineCancelApiObject } from "./configs/axiosUtils"

export const UserAPI = {
  logIn: async (user, cancel = false) => {
    try {
      const response = await api.post("/Users/login", user)
      return response.data
    }
    catch (err) {
      return {
        error: err,
        errorMessage: "Wrong username or password"
      }
    }
  },
  register: async (user, cancel = false) => {
    const response = await api.post("/users/register", user)

    // returning the product returned by the API
    return response.data
  },
  getInfo: async (cancel = false) => {
    try {
      const response = await api.get("/users/info", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      // returning the product returned by the API
      return response.data
    }
    catch (err) {
      console.log(err)
    }
  },
}

// defining the cancel API object for ProductAPI
//const cancelApiObject = defineCancelApiObject(UserAPI)