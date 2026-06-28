import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import unicodedata


class HTMLExtrator:

    BASE_URL = "https://portal.ufac.br"
    URL_CURSOS = f"{BASE_URL}/ementario/cursos.action"

    def listar_links_cursos(self):
        url = "https://portal.ufac.br/ementario/cursos.action"

        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        tabela = soup.find("table", id="table-cursos")

        if tabela is None:
            return []

        links = []

        for a in tabela.find_all("a", href=True):
            href = a["href"]

            if "/ementario/curso.action" in href:
                link_completo = urljoin("https://portal.ufac.br", href)

                if link_completo not in links:
                    links.append(link_completo)

        return links
    

    def extrair_tabelas_curso(self, url):
        tabelas = self.extrair_tabelas(url)

        tabela_info_bruta = tabelas[2]
        tabela_docentes = None

        if len(tabelas) == 4:
            tabela_docentes_bruta = tabelas[3]
            tabela_docentes = str(tabela_docentes_bruta)

        tabela_info = str(tabela_info_bruta)

        return {
            "tabela_informacoes_gerais_principal": tabela_info,
            "tabela_docentes_principal": tabela_docentes
        }
    
    def extrair_tabelas_curriculo(self, url):
        response = requests.get(url, timeout=20)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        tabela_informacoes = None
        tabela_disciplinas = None

        # procura a tabela logo após o cabeçalho "Informações Gerais"
        header = soup.find("div", class_="header")

        if header:
            tabela_informacoes = header.find_next("table")

        tabela_disciplinas = soup.find("table", id="table-disciplinas")

        return {
            "informacoes_gerais": tabela_informacoes,
            "disciplinas": tabela_disciplinas
    }        

    def extrair_tabelas(self, url):
        response = requests.get(url, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        tabelas = soup.find_all("table")
        return tabelas


    def extrair_secoes_disciplina(self, url):
        """
        Extrai os trechos relevantes da página de uma disciplina.

        Retorna:
        {
            "informacoes_gerais": <table>,
            "docentes": <div>,
            "objetivos": <div>,
            "ementa": <div>,
            "programa": <div>
        }
        """

        soup = self.extrair_soup(url)

        secoes = {}

        for header in soup.find_all("div", class_="header"):

            titulo = header.get_text(strip=True).lower()

            conteudo = header.find_next_sibling()

            if titulo == "informações gerais":
                secoes["informacoes_gerais"] = conteudo

            elif titulo == "docentes":
                secoes["docentes"] = conteudo

            elif titulo == "objetivos":
                secoes["objetivos"] = conteudo

            elif titulo == "ementa":
                secoes["ementa"] = conteudo

            elif titulo == "programa":
                secoes["programa"] = conteudo

        return secoes
    
    
    def extrair_soup(self, url):
        response = requests.get(url, timeout=20)
        response.raise_for_status()

        return BeautifulSoup(response.text, "html.parser")
    
    
    def extrair_tabelas_ppc(self, url):
        soup = self.extrair_soup(url)

        tabela_projeto_pedagogico = None
        tabela_documentos = None

        for header in soup.find_all("div", class_="header"):
            titulo = self._normalizar_texto(header.get_text(" ", strip=True))
            tabela = header.find_next_sibling("table")

            if titulo == "projeto pedagogico do curso":
                tabela_projeto_pedagogico = tabela

            elif titulo == "documentos do curso":
                tabela_documentos = tabela

        return {
            "projeto_pedagogico_curso": tabela_projeto_pedagogico,
            "documentos_curso": tabela_documentos
        }

    def _normalizar_texto(self, texto):
        texto = unicodedata.normalize("NFKD", texto)
        texto = "".join(char for char in texto if not unicodedata.combining(char))
        return " ".join(texto.lower().split())
