/**
 * @file apiClient.ts
 * @description Cliente HTTP centralizado para comunicação com a API Back-End Django via Fetch API.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Monta a URL final com parâmetros de query string opcionais.
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = endpoint.startsWith('http')
    ? new URL(endpoint)
    : new URL(`${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'Todos') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Função genérica para realizar requisições HTTP e tratar erros padronizados da API.
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;
  const url = buildUrl(endpoint, params);

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  try {
    const response = await fetch(url, {
      headers: defaultHeaders,
      ...rest,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erro desconhecido');
      console.error(`Erro API [${response.status}] ${url}:`, errorText);
      throw new Error(`Erro na requisição (${response.status}): ${errorText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.warn(`Falha na comunicação com a API [${endpoint}]:`, error);
    throw error;
  }
}
