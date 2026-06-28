from extracao_dados.extratores.extracao_html import HTMLExtrator

class DisciplinaExtrator:

    def __init__(self, nav=None):
        self.nav = nav
        self.extrator_html = HTMLExtrator()


    def extrair_informacoes_disciplina(self, listaUrl):

        disciplinas = []
    
        for url in listaUrl:

            secoes_disciplina = self.extrator_html.extrair_secoes_disciplina(url)

            disciplina = {
                "informacoes_gerais": self.extrair_informacoes_gerais(
                    secoes_disciplina.get("informacoes_gerais")
                ),

                "ementa": self.extrair_ementa(
                    secoes_disciplina.get("ementa")
                ),

                "programa": self.extrair_programa(
                    secoes_disciplina.get("programa")
                ),

                "docentes": self.extrair_docentes(
                    secoes_disciplina.get("docentes")
                ),

                "objetivos": self.extrair_objetivos(
                    secoes_disciplina.get("objetivos")
                )
            }

            disciplinas.append(disciplina)

        return disciplinas


    def extrair_ementa(self, secao):
        """
        Extrai a ementa da disciplina.

        Retorna:
            str | None
        """

        if secao is None:
            return None

        texto = " ".join(secao.stripped_strings)

        if not texto:
            return None

        if texto.lower() == "não consta":
            return None

        return texto
    

    def extrair_programa(self, secao):
        """
        Extrai o programa da disciplina.

        Retorna:
            str | None
        """

        if secao is None:
            return None

        texto = " ".join(secao.stripped_strings)

        if not texto:
            return None

        if texto.lower() == "não consta":
            return None

        return texto

    
    def extrair_docentes(self, secao):

        if secao is None:
            return []

        docentes = list(secao.stripped_strings)

        if not docentes:
            return []

        if "nenhum professor" in docentes[0].lower():
            return []

        return docentes


    def extrair_informacoes_gerais(self, tabela):
        """
        Extrai as informações gerais da disciplina.

        Retorna:
        {
            "nome": "...",
            "codigo": "...",
            "unidade": "...",
            "tipo": "...",
            "periodo_ideal": "...",
            "nota_minima": "...",
            "carga_horaria": "...",
            "creditos": "..."
        }
        """

        if tabela is None:
            return {}

        informacoes = {}

        mapeamento = {
            "Disciplina": "disciplina",
            "Unidade": "unidade",
            "Tipo": "tipo",
            "Período Ideal no Curso": "periodo_ideal",
            "Nota Mínima para Aprovação": "nota_minima",
            "Carga Horária": "carga_horaria",
            "Nº de Créditos": "creditos"
        }

        for td in tabela.find_all("td"):

            label = td.find("span", class_="label")

            if label is None:
                continue

            chave = label.get_text(strip=True)

            if chave not in mapeamento:
                continue

            textos = list(td.stripped_strings)

            valor = " ".join(" ".join(textos[1:]).split())

            informacoes[mapeamento[chave]] = valor

        # Separa nome e código da disciplina
        disciplina = informacoes.get("disciplina")

        if disciplina and "(" in disciplina and ")" in disciplina:

            nome = disciplina.split("(")[0].strip()
            codigo = disciplina.split("(")[1].replace(")", "").strip()

            informacoes["nome"] = nome
            informacoes["codigo"] = codigo

            del informacoes["disciplina"]

        return informacoes

    def extrair_objetivos(self, secao):
        """
        Extrai os objetivos da disciplina.

        Retorna:
            str | None
        """

        if secao is None:
            return None

        texto = " ".join(secao.stripped_strings)

        if texto.lower() == "não consta":
            return None

        return texto
