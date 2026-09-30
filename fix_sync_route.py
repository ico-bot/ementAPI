# -*- coding: utf-8 -*-
import os

views_file = 'base_ementario/views.py'
with open(views_file, 'r', encoding='utf-8') as f:
    views_content = f.read()

sync_view = '''
from extracao_dados.services.extracao_service import ExtracaoService

@api_view(['POST'])
@permission_classes([IsAdminUser])
def manual_sync(request):
    try:
        service = ExtracaoService()
        resultado = service.executar(salvar_no_banco=True)
        return Response({'status': 'success', 'message': f'Sincronização concluída com sucesso! {len(resultado)} cursos processados.'})
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=500)
'''

if 'def manual_sync' not in views_content:
    views_content += '\n' + sync_view
    with open(views_file, 'w', encoding='utf-8') as f:
        f.write(views_content)


urls_file = 'base_ementario/urls.py'
with open(urls_file, 'r', encoding='utf-8') as f:
    urls_content = f.read()

if "path('sync/', views.manual_sync, name='manual-sync')" not in urls_content:
    target = "path('dashboard/', views.dashboard_overview, name='dashboard-overview'),\n]"
    replacement = "path('dashboard/', views.dashboard_overview, name='dashboard-overview'),\n    path('sync/', views.manual_sync, name='manual-sync'),\n]"
    urls_content = urls_content.replace(target, replacement)
    
    with open(urls_file, 'w', encoding='utf-8') as f:
        f.write(urls_content)

