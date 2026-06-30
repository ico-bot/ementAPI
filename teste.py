import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ementaAPI.settings")
django.setup()

from extracao_dados.services.extracao_service import ExtracaoService

service = ExtracaoService()
resultado = service.executar(salvar_no_banco=True
)

print("Cursos salvos:", len(resultado))