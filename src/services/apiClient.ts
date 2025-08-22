import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const BASE_URL: string = 'https://app.ticketmaster.com';
const API_KEY: string = 'jNj8vq10oMx0sGFz8kb9030E7RiG5zgz';

class ApiClient {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.apiClient.interceptors.request.use(
      (config: AxiosRequestConfig): AxiosRequestConfig => {
        if (!config.params) {
          config.params = {};
        }
        config.params.apikey = API_KEY;
        return config;
      },
      (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
      }
    );

    this.apiClient.interceptors.response.use(
      (response: AxiosResponse): any => {
        return response.data;
      },
      (error: AxiosError): Promise<Error> => {
        const errorMessage: string = error.response
          ? `Error ${error.response.status}: ${JSON.response.data}`
          : error.message;
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  public get<T>(url: string, params: object = {}): Promise<T> {
    return this.apiClient.get<T>(url, { params });
  }

}

export const apiClient = new ApiClient();
