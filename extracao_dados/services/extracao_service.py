from extracao_dados.navegacao import AdministracaoNavegador
from extracao_dados.extratores.curso import CursoExtrator
from extracao_dados.extratores.docente import DocenteExtrator
from extracao_dados.extratores.extracao_html import HTMLExtrator
from extracao_dados.extratores.curriculo import CurriculoExtrator
from extracao_dados.extratores.ppc import PPCExtrator
import re


#Service responsável por ordenar todo fluxo de extração
class ExtracaoService:
    CURRICULO_URL_BASE = 'https://portal.ufac.br/ementario/curriculo.action?v='
    PPC_URL_BASE = 'https://portal.ufac.br/ementario/ppc.action?v='


    #Fluco principal da extração
    def executar(self):
        # 2. Extrai links de cursos



        extrator_html = HTMLExtrator()
        # links_cursos = extrator_html.listar_links_cursos()
        links_cursos = ['https://portal.ufac.br/ementario/curso.action?v=238']

        cursos_extraidos = []

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

        extrator_cursos = CursoExtrator()
        extrator_docentes = DocenteExtrator()
        extrator_html = HTMLExtrator()
        extrator_curriculo = CurriculoExtrator()
        extrator_ppc = PPCExtrator()

        # Extração das tabelas da tela principal do curso
        tabelas_curso = extrator_html.extrair_tabelas_curso(link)

        #Dados das Informações Gerais da tela principal do curso
        dados_gerais_cursos = extrator_cursos.extrair_informacoes_gerais_curso(str(tabelas_curso["tabela_informacoes_gerais_principal"]))

        print(dados_gerais_cursos)

        #Dados dos docentes da tela principal do curso
        dados_docentes = extrator_docentes.extrair_dados_docentes_curso(str(tabelas_curso["tabela_docentes_principal"]))

        print(dados_docentes)

        #Extração do link do url
        id_url = self.extrair_id_url(link)

        #Construção e inicialização do url do curriculo
        curriculo_url = self.CURRICULO_URL_BASE + str(id_url)

        #Dados do curriculo do curso, englobanod disciplinas e tudo mais
        dados_informacoes_curriculo = extrator_curriculo.extrair_informacoes_curriculo(curriculo_url)
        print(dados_informacoes_curriculo)

        #Construção e inicialização do url de ppc
        ppc_url = self.PPC_URL_BASE + str(id_url)
        dados_informacoes_ppc = extrator_ppc.extrair_informacoes_ppc(ppc_url)
        print(dados_informacoes_ppc)


        # ========================= 
        # 3. Montagem da estrutura
        # =========================
        return {
            "dados_gerais": dados_gerais_cursos,
            "docentes": dados_docentes,
            "curriculo": dados_informacoes_curriculo,
            "ppc": dados_informacoes_ppc,
        }
