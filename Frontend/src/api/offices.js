import api from ".";

export const getOffices = async () => {
  try {
    const response = await api.get("/offices?limit=100");
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
