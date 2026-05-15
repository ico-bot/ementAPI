

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement

class HTMLExtrator:

    def __init__(self, nav):
        self.nav = nav
    
    
    #Com a pagina inicial aberta, ele retorna todos os links dos cursos
    def listar_links_cursos(self):

        tabela = self.nav.navegador.find_element(By.ID, 'table-cursos')
        trs = tabela.find_element(By.TAG_NAME, "tbody").find_elements(By.TAG_NAME, "tr")

        links = []

        for tr in trs:
            a = tr.find_element(By.TAG_NAME, "a")
            link = a.get_attribute('href')
            links.append(link)

        return links
    
    #Método principal de extração de informações gerais dos cursos
    def extrair_tabelas_curso(self):

        tabela_docentes = None
        tabela_info = None

        tabelas = self.nav.navegador.find_elements(By.TAG_NAME, "table")

        tabela_info_bruta = tabelas[2]

        if len(tabelas) == 4:
            tabela_docentes_bruta = tabelas[3]
            tabela_docentes = tabela_docentes_bruta.get_attribute("outerHTML")

        tabela_info = tabela_info_bruta.get_attribute("outerHTML")


        return {
            "tabela_informacoes_gerais_principal": tabela_info,
            "tabela_docentes_principal": tabela_docentes
        }