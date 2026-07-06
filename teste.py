import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ementaAPI.settings")
django.setup()

from normalizar_banco import normalizar_banco
from extracao_dados.services.extracao_service import ExtracaoService

print("Executando normalização do banco de dados pré-extração...")
normalizar_banco()

service = ExtracaoService()
resultado = service.executar(salvar_no_banco=True)

print("Cursos salvos:", len(resultado))