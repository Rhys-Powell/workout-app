const API_BASE_URL = await import.meta.env.VITE_PROXY;

export const getData = async (endpoint: string, params: { [key: string]: string } = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postData = async (endpoint: string, payload: object) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 204) {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postDataWithQueryString = async (endpoint: string, params: { [key: string]: string } = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
