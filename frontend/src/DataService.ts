import FetchError from "./types/FetchError";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const DataService = () => {
   
  const apiRequest = async (token: string, endpoint: string, params: { [key: string]: string } = {}, options: RequestInit = {}) => {
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

  function createError(response: Response) {
    return new FetchError(response.statusText, response.status);
  }

  const getData = async (token: string, endpoint: string, params: { [key: string]: string} = {}) => {
    const response = await apiRequest(token, endpoint, params, {
      method: 'GET',
    });
  if (!response.ok) {
    const error: FetchError = createError(response);
      throw error;      
  } 
  return response.json(); 
  };

  const postData = async (token: string, endpoint: string, params: { [key: string]: string } = {}, data?: object) => {
    const response = await apiRequest(token, endpoint, params, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseBody = await response.json();
    if (!responseBody) { 
      return null;
    } else if (!response.ok) {
      const error: FetchError = createError(response);
      throw error;      
    } 
    return response.json(); 
  };    

  const patchData = async (token: string,endpoint: string, params: { [key: string]: string } = {}, data?: object) => {
    const response = await apiRequest(token, endpoint, params, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseBody = await response.text();
    if (!responseBody) { 
      return null;
    } else if (!response.ok) {
      const error: FetchError = createError(response);
      throw error;      
    } 
    return response.json(); 
  };

  const deleteData = async (token: string, endpoint: string, params: { [key: string]: string } = {}) => {
    const response = await apiRequest(token, endpoint, params, {
      method: 'DELETE',
    });
    if (response.status === 204) {
      return null;
    } else if (!response.ok) {
      const error: FetchError = createError(response);
      throw error;      
    } 
    return response.json(); 
  };

  const postDataWithQueryString = async (token: string,endpoint: string, params: { [key: string]: string } = {}, data?: object) => {
    const response = await apiRequest(token, endpoint, params, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseBody = await response.text();
    if (!responseBody) { 
      return null;
    } else if (!response.ok) {
      const error: FetchError = createError(response);
      throw error;      
    } 
    return response.json(); 
  };

return {
  getData,
  postData,
  patchData,
  deleteData,
  postDataWithQueryString
};
}

export default DataService;