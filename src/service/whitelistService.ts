const API_URL = import.meta.env.VITE_BACKEND_API_URL + "/whitelist/";

type HttpMethod = "GET";

interface RequestOptions {
  method: HttpMethod;
  headers: HeadersInit;
  body?: string;
}

const getHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Accept: "application/json",
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

const WhitelistApiService = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    } as RequestOptions);
    return handleResponse<T>(response);
  },
};

export default WhitelistApiService;
