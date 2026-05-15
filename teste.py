from extracao_dados.services.extracao_service import ExtracaoService

service = ExtracaoService()
resultado = service.executar()

print(resultado)