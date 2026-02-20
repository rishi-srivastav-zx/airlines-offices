import api from ".";

export const getOffices = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      limit: '100',
      ...params
    });
    
    const response = await api.get(`/offices?${queryParams}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
