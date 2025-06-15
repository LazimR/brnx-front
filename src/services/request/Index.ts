import axios from 'axios';
import type { AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
  statusCode: number;
  responseBody: T;
}

interface ErrorResponse {
  error: string;
}

const API_URL = 'http://localhost:3100'; // substitua pela sua URL da API

const getHeaders = () => ({
  'Content-Type': 'application/json'
});

export async function getReport(url: string): Promise<ApiResponse<Blob | ErrorResponse>> {
    try {
        const response: AxiosResponse<Blob> = await axios.get(API_URL + url, {
            headers: {'Content-Type': 'application/pdf'},
            responseType: 'blob', // Configura para receber dados binários
        });
        return {
            statusCode: response.status,
            responseBody: response.data,
        };
    } catch (error: any) {
        const errorDetail = error?.message || 'Erro ao baixar o relatório';
        return {
            statusCode: error?.response?.status || 500,
            responseBody: { error: errorDetail },
        };
    }
}

export async function get<T = any>(url: string): Promise<ApiResponse<T | ErrorResponse>> {
  try {
    const response: AxiosResponse<T> = await axios.get(API_URL + url, {
      headers: getHeaders()
    });
    return {
      statusCode: response.status,
      responseBody: response.data
    };
  } catch (error: any) {
    const errorDetail = error?.message || 'Erro na request';
    return {
      statusCode: error?.response?.status || 500,
      responseBody: { error: errorDetail }
    };
  }
}

export async function post<T = any>(url: string, body: any): Promise<ApiResponse<T | ErrorResponse>> {
  try {
    const response: AxiosResponse<T> = await axios.post(API_URL + url, body, {
      headers: getHeaders()
    });
    return {
      statusCode: response.status,
      responseBody: response.data
    };
  } catch (error: any) {
    const errorDetail = error?.message || 'Erro na request';
    return {
      statusCode: error?.response?.status || 500,
      responseBody: { error: errorDetail }
    };
  }
}

export async function put<T = any>(url: string, body: any): Promise<ApiResponse<T | ErrorResponse>> {
  try {
    const response: AxiosResponse<T> = await axios.put(API_URL + url, body, {
      headers: getHeaders()
    });
    return {
      statusCode: response.status,
      responseBody: response.data
    };
  } catch (error: any) {
    const errorDetail = error?.message || 'Erro na request';
    return {
      statusCode: error?.response?.status || 500,
      responseBody: { error: errorDetail }
    };
  }
}

export async function del<T = any>(url: string): Promise<ApiResponse<T | ErrorResponse>> {
  try {
    const response: AxiosResponse<T> = await axios.delete(API_URL + url, {
      headers: getHeaders()
    });
    return {
      statusCode: response.status,
      responseBody: response.data
    };
  } catch (error: any) {
    const errorDetail = error?.message || 'Erro na request';
    return {
      statusCode: error?.response?.status || 500,
      responseBody: { error: errorDetail }
    };
  }
}

export async function login<T = any>(body: any): Promise<ApiResponse<T | ErrorResponse>> {
  try {
    const response: AxiosResponse<T> = await axios.post(API_URL + '/user/login', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return {
      statusCode: response.status,
      responseBody: response.data
    };
  } catch (error: any) {
    const errorDetail = error?.message || 'Erro na request';
    return {
      statusCode: error?.response?.status || 500,
      responseBody: { error: errorDetail }
    };
  }
}
