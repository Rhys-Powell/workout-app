const API_BASE_URL = await import.meta.env.VITE_PROXY;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`${response.status} ${response.statusText}: ${error.message}`);
  }
  return await response.json();
};

export const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/exercises`);
  return handleResponse(response);
};
