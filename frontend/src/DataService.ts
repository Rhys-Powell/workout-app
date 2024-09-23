const API_BASE_URL = import.meta.env.VITE_API_URL;

const DataService = (token: string | null) => {
  const apiRequest: (endpoint: string, params?: { [key: string]: string; }, options?: RequestInit) => Promise<Response> = async (endpoint, params = {}, options = {}) => {
  try {
    
    const url = new URL(`${API_BASE_URL}/api/${endpoint}`);
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

  const getData = async (endpoint: string, params: { [key: string]: string } = {}) => {
    const response = await apiRequest(endpoint, params);
    return response.json();
  };

  const postData = async (endpoint: string, data: object,  params: { [key: string]: string } = {}) => {
    const response = await apiRequest(endpoint, params, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
      return response.json();
  };    

  const deleteData = async (endpoint: string, params: { [key: string]: string } = {}) => {
    const response = await apiRequest(endpoint, params, {
      method: 'DELETE',
    });
    if (response.status === 204) {
      return null;
    }
    return response.json();
  };

  const postDataWithQueryString = async (endpoint: string, params: { [key: string]: string } = {}) => {
    const response = await apiRequest(endpoint, params, {
      method: 'POST',
    });
    return response.json();
  };

return {
  getData,
  postData,
  deleteData,
  postDataWithQueryString
};
}

export default DataService;