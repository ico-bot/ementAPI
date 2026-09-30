# -*- coding: utf-8 -*-
import os

f = 'src/modules/admin/services/dashboardService.ts'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

new_func = '''
/**
 * Inicia a sincronização manual chamando o Back-End.
 */
export async function triggerManualSync(): Promise<{ status: string; message: string }> {
  try {
    const response = await apiClient<any>('/sync/', { method: 'POST' });
    return { status: 'success', message: response.message || 'Sincronização iniciada com sucesso.' };
  } catch (error) {
    console.error('Erro ao iniciar sincronização:', error);
    throw new Error('Falha ao iniciar sincronização.');
  }
}
'''

if 'triggerManualSync' not in content:
    content += '\n' + new_func

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
