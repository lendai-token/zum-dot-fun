const API_URL = import.meta.env.VITE_BACKEND_API_URL + "/user/";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

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

const UserApiService = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    } as RequestOptions);
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    } as RequestOptions);
    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    } as RequestOptions);
    return handleResponse<T>(response);
  },
};

export default UserApiService;
