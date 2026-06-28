from selenium.webdriver.common.by import By
from extracao_dados.extratores.extracao_html import HTMLExtrator
from extracao_dados.extratores.disciplina import DisciplinaExtrator
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin


class CurriculoExtrator:

    def __init__(self, nav=None):
        self.nav = nav
        self.extrator_html = HTMLExtrator()
        self.extrator_disciplina = DisciplinaExtrator(nav)



    def extrair_informacoes_curriculo(self, url):

        tabelas_curriculo = self.extrator_html.extrair_tabelas_curriculo(url)
        informacoes_gerais_curriculo = self.extrair_informacoes_gerais_curriculo(tabelas_curriculo["informacoes_gerais"])


        urls_disciplina = self.extrair_urls_disciplinas(tabelas_curriculo["disciplinas"])
        informacoes_disciplinas = self.extrator_disciplina.extrair_informacoes_disciplina(urls_disciplina)

        return {
                "informacoes_gerais": informacoes_gerais_curriculo,
                "disciplinas": informacoes_disciplinas
            }

        

    
    def extrair_urls_disciplinas(self, tabela_disciplinas):
        """
        Extrai os urls de todas as disciplinas presentes na tabela do currículo.

        Retorna:
            list[str]: Lista com as URLs absolutas das disciplinas.
        """

        if tabela_disciplinas is None:
            return []

        urls = []

        tbody = tabela_disciplinas.find("tbody")

        if tbody is None:
            return urls

        for tr in tbody.find_all("tr"):

            url = tr.find("a", href=True)

            if url is None:
                continue

            urls.append(
                urljoin(
                    HTMLExtrator.BASE_URL,
                    url["href"]
                )
            )

        return urls


    def extrair_informacoes_gerais_curriculo(self, tabela):
        """
        Extrai as informações gerais do currículo.

        Exemplo de retorno:
        {
            "curriculo": "Versão 01",
            "regime_letivo": "Semestral",
            "numero_periodos": "8",
            "total_creditos": "184",
            "carga_horaria_total": "3120",
            "carga_horaria_periodo": "60h mínima / 450h máxima",
            "numero_maximo_trancamentos": "3 totais / 20 parciais"
        }
        """

        informacoes = {}

        if tabela is None:
            return informacoes

        mapeamento = {
            "Currículo": "curriculo",
            "Regime Letivo": "regime_letivo",
            "Nº de Períodos (ideal)": "numero_periodos",
            "Total de Créditos": "total_creditos",
            "Carga Horária Total": "carga_horaria_total",
            "Carga Horária/Período": "carga_horaria_periodo",
            "Nº Máximo de Trancamentos": "numero_maximo_trancamentos",
        }

        for td in tabela.find_all("td"):

            label = td.find("span", class_="label")

            if label is None:
                continue

            chave = label.get_text(strip=True)

            if chave not in mapeamento:
                continue

            textos = list(td.stripped_strings)

            # Remove o rótulo, mantendo apenas o valor.
            valor = " ".join(" ".join(textos[1:]).split())

            informacoes[mapeamento[chave]] = valor

        return informacoes
