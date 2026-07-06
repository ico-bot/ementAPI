import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ementaAPI.settings")
django.setup()

from extracao_dados.services.extracao_service import ExtracaoService

print("Iniciando extração completa de todos os cursos do ementário da UFAC...")

service = ExtracaoService()
resultado = service.executar(salvar_no_banco=True)

print("Cursos processados e salvos:", len(resultado))