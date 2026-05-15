from selenium.webdriver.common.by import By
import re
from bs4 import BeautifulSoup

class DocenteExtrator:
    def __init__(self, nav):
        self.nav = nav


    def extrair_dados_docentes_curso(self, html: str) -> dict:
        soup = BeautifulSoup(html, "html.parser")

        tabela = soup.find("table")
        docentes = []

        if not tabela:
            return docentes

        linhas = tabela.find("tbody").find_all("tr")

        for linha in linhas:
            colunas = linha.find_all("td")

            if len(colunas) < 3:
                continue

            nome = colunas[0].get_text(strip=True)
            titulacao = colunas[1].get_text(strip=True)

            dados_lotacao = [
                texto.strip()
                for texto in colunas[2].stripped_strings
            ]

            docente = {
                "nome": nome,
                "titulacao": titulacao,
                "lotacao": dados_lotacao[0] if len(dados_lotacao) > 0 else None,
                "cargo": dados_lotacao[1] if len(dados_lotacao) > 1 else None,
                "jornada": dados_lotacao[2] if len(dados_lotacao) > 2 else None,
                "tempo_de_casa": dados_lotacao[3] if len(dados_lotacao) > 3 else None,
            }

            docentes.append(docente)

        return docentes

