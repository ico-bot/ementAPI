from bs4 import BeautifulSoup
import re

#Extrair informações relacionadas a cursos
class CursoExtrator:

    def __init__(self, nav=None):
        self.nav = nav

    # 4. Extrair ID do Link
    def extrair_id_link(self, link):
        """
        Extrai o número do final do link.
        Ex: ?v=123 → retorna 123
        """
        m = re.search(r'(\d+)$', link)
        return m.group(1) if m else None

   
    #Montagem de links derivados
    def montar_link_curriculo(self, numero):
        return f"https://portal.ufac.br/ementario/curriculo.action?v={numero}"

    def montar_link_ppc(self, numero):
        return f"https://portal.ufac.br/ementario/ppc.action?v={numero}"


    def extrair_informacoes_gerais_curso(self, html: str) -> dict:
        soup = BeautifulSoup(html, "html.parser")

        dados = {}

        mapeamento = {
            "Nome do Curso": "nome_curso",
            "Nivel de Ensino": "nivel_ensino",
            "Funcionamento": "funcionamento",
            "Modalidade": "modalidade",
            "Grau Acadêmico": "grau_academico",
            "Área de Conhecimento": "area_conhecimento",
            "Turno": "turno",
            "Ato de Autorização": "ato_autorizacao",
            "Ato de Reconhecimento": "ato_reconhecimento",
            "Conceito MEC": "conceito_mec",
            "Coordenador": "coordenador",
        }

        for td in soup.find_all("td"):
            label = td.find("span", class_="label")

            if not label:
                continue

            nome_label = label.get_text(strip=True)
            chave = mapeamento.get(nome_label)

            if not chave:
                continue

            texto_completo = td.get_text(" ", strip=True)
            valor = texto_completo.replace(nome_label, "", 1).strip()

            if chave == "nome_curso":
                match = re.search(r"^(.*?)\s*\(\s*([A-Za-z0-9]+)\s*\)$", valor, re.DOTALL)

                if match:
                    dados["nome_curso"] = match.group(1).strip()
                    codigo_bruto = str(match.group(2))
                    dados["codigo_curso"] = codigo_bruto.zfill(3) if codigo_bruto.isdigit() else codigo_bruto
                else:
                    dados["nome_curso"] = valor
            else:
                dados[chave] = valor

        return dados
