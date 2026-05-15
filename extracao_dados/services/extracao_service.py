from extracao_dados.navegacao import AdministracaoNavegador
from extracao_dados.extratores.curso import CursoExtrator
from extracao_dados.extratores.docente import DocenteExtrator
from extracao_dados.extratores.extracao_html import HTMLExtrator
from extracao_dados.extratores.curriculo import CurriculoExtrator
import re
import requests


#Service responsável por ordenar todo fluxo de extração
class ExtracaoService:

    BASE_URL = "https://portal.ufac.br/ementario/cursos.action"
    CURRICULO_URL_BASE = 'https://portal.ufac.br/ementario/curriculo.action?v='
    PPC_URL_BASE = 'https://portal.ufac.br/ementario/ppc.action?v='


    #Fluco principal da extração
    def executar(self):

        #inicializa a navegação
        
        nav = AdministracaoNavegador()
        nav.inicializar_site(self.BASE_URL)

        # 2. Extrai links de cursos

        extrator_html = HTMLExtrator(nav)
        links_cursos = extrator_html.listar_links_cursos()

        cursos_extraidos = [] 

        # 4. Finaliza navegador
        nav.encerrar_site()

        # 3. Loop principal
        for link in links_cursos:
            try:
                curso = self._extrair_curso_completo(link)
                cursos_extraidos.append(curso)

            except Exception as e:
                print(f"Erro ao processar curso {link}: {e}")

        return cursos_extraidos


    @staticmethod
    def extrair_id_url(url):
        match = re.search(r'=(\d+)$', url)

        if match:
            return int(match.group(1))

        return None


    def _extrair_curso_completo(self, link):

        # =========================
        # 1. Extratores
        # =========================

        extrator_cursos = CursoExtrator(link)
        extrator_docentes = DocenteExtrator(link)
        extrator_html = HTMLExtrator(link)
        extrator_curriculo = CurriculoExtrator(link)

        # Extração das tabelas da tela principal do curso
        tabelas_curso = extrator_html.extrair_tabelas_curso()

        #Dados das Informações Gerais da tela principal do curso
        dados_gerais_cursos = extrator_cursos.extrair_informacoes_gerais_curso(str(tabelas_curso["tabela_informacoes_gerais_principal"]))

        #Dados dos docentes da tela principal do curso
        dados_docentes = extrator_docentes.extrair_dados_docentes_curso(str(tabelas_curso["tabela_docentes_principal"]))

        #Extração do link do url
        id_url = self.extrair_id_url(link)

        #Construção e inicialização do url do curriculo
        curriculo_url = self.CURRICULO_URL_BASE + id_url
        nav.inicializar_site(curriculo_url)
        

        #Dados do curriculo do curso
        dados_informacoes_curriculo = extrator_curriculo.extrair_informacoes_curriculo()


        # =========================
        # 3. Montagem da estrutura
        # =========================
        # curso = {
        #     "dados": dados_curso,
        #     "docentes": docentes,
        #     "documentos": documentos,
        # }

        # return curso