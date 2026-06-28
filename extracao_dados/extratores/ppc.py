from extracao_dados.extratores.extracao_html import HTMLExtrator
from urllib.parse import urljoin
import re


class PPCExtrator:
    
    def __init__(self, nav=None):
        self.nav = nav
        self.extrator_html = HTMLExtrator()

    def extrair_informacoes_ppc(self, url):
        tabelas_ppc = self.extrator_html.extrair_tabelas_ppc(url)

        return {
            "projeto_pedagogico_curso": self.extrair_projeto_pedagogico(
                tabelas_ppc["projeto_pedagogico_curso"]
            ),
            "documentos_curso": self.extrair_documentos_curso(
                tabelas_ppc["documentos_curso"]
            )
        }
    
    def extrair_projeto_pedagogico(self, tabela):
        if tabela is None:
            return {}

        informacoes = {}
        labels = tabela.find_all("span", class_="label")

        for label in labels:
            chave = self._normalizar_chave(label.get_text(" ", strip=True))
            textos = []

            for irmao in label.next_siblings:
                if getattr(irmao, "name", None) == "span" and "label" in irmao.get("class", []):
                    break

                if hasattr(irmao, "stripped_strings"):
                    textos.extend(irmao.stripped_strings)
                else:
                    texto = str(irmao).strip()
                    if texto:
                        textos.append(texto)

            informacoes[chave] = " ".join(" ".join(textos).split())

        return informacoes

    def extrair_documentos_curso(self, tabela):
        if tabela is None:
            return []

        documentos = []

        for link in tabela.find_all("a"):
            nome = link.get_text(" ", strip=True)
            href = link.get("href")
            onclick = link.get("onclick")

            if not href and onclick:
                match = re.search(r"location=['\"]([^'\"]+)['\"]", onclick)
                if match:
                    href = match.group(1).replace("id=+", "id=")

            documentos.append({
                "nome": nome,
                "url": urljoin(HTMLExtrator.BASE_URL, href) if href else None
            })

        return documentos

    def _normalizar_chave(self, texto):
        texto = texto.lower().strip()
        texto = re.sub(r"[^a-z0-9áàâãéêíóôõúç]+", "_", texto)
        return texto.strip("_")
