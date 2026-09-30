# -*- coding: utf-8 -*-
import os

f = 'src/modules/admin/pages/AdminDashboardPage.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = content.replace('import { fetchDashboardOverview } from \'../services/dashboardService\';', 'import { fetchDashboardOverview, triggerManualSync } from \'../services/dashboardService\';')

content = content.replace('const [error, setError] = useState<string | null>(null);', 'const [error, setError] = useState<string | null>(null);\n  const [isSyncing, setIsSyncing] = useState(false);')

func = '''
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await triggerManualSync();
      alert('Sincronização iniciada com sucesso. Em breve os dados serão atualizados.');
      loadDashboardData();
    } catch (err) {
      alert('Erro ao iniciar a sincronização.');
    } finally {
      setIsSyncing(false);
    }
  };
'''

content = content.replace('  const loadDashboardData = () => {', func + '\n  const loadDashboardData = () => {')

btn = '''
            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold border border-purple-500 transition-all cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </button>
'''
content = content.replace('<div className="flex items-center gap-3 shrink-0">', '<div className="flex items-center gap-3 shrink-0">' + btn)

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
