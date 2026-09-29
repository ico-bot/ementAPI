"""
Módulo de paginação customizada para a API REST do Ementário.
Permite que os clientes front-end solicitem o tamanho da página via parâmetro de consulta (`page_size`),
garantindo o carregamento de catálogos completos em selects, filtros e listagens no cliente.
"""

from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 2000
