/**
 * @file mockClient.ts
 * @description Helper para simular latência de requisições HTTP durante o desenvolvimento com dados mockados.
 */

export const simulateNetworkDelay = (ms = 400): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
