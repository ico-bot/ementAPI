import json
import re
from decimal import Decimal, InvalidOperation
from django.db import transaction
from base_ementario.models import (
    Curso,
    Curriculo,
    CurriculoDisciplina,
    Disciplina,
    Docente,
    DocenteDisciplina,
    DocumentoCurso,
    PPC,
    Unidade,
)


class PersistenciaService:

    @transaction.atomic
    def salvar_curso_extraido(self, dados_extraidos):
        dados_gerais = dados_extraidos.get("dados_gerais", {})
        docentes = dados_extraidos.get("docentes", [])
        dados_curriculo = dados_extraidos.get("curriculo", {})
        dados_ppc = dados_extraidos.get("ppc", {})

        curso = self.salvar_curso(dados_gerais)
        docentes_curso = self.salvar_docentes_curso(curso, docentes)
        self.definir_coordenador(curso, dados_gerais.get("coordenador"), docentes_curso)

        curriculo = self.salvar_curriculo(
            curso,
            dados_curriculo.get("informacoes_gerais", {})
        )
        self.salvar_disciplinas_curriculo(
            curso,
            curriculo,
            dados_curriculo.get("disciplinas", [])
        )
        self.salvar_ppc(curso, curriculo, dados_ppc)

        return curso

    def salvar_curso(self, dados):
        curso, _ = Curso.objects.update_or_create(
            codigo_curso=dados.get("codigo_curso"),
            defaults={
                "nome_curso": dados.get("nome_curso") or "",
                "nivel_curso": dados.get("nivel_ensino") or Curso.Nivel.GRADUACAO,
                "turno_curso": dados.get("turno"),
                "modalidade_curso": dados.get("modalidade"),
                "area_conhecimento_curso": dados.get("area_conhecimento"),
                "funcionamento_curso": dados.get("funcionamento") or Curso.Funcionamento.ATIVO,
                "grau_academico": dados.get("grau_academico"),
                "ato_autorizacao_curso": dados.get("ato_autorizacao"),
                "ato_reconhecimento_curso": dados.get("ato_reconhecimento"),
                "conceito_mec_curso": dados.get("conceito_mec"),
                "inserido_manualmente": False,
            }
        )
        return curso
    
    def salvar_docentes_curso(self, curso, docentes):
        docentes_salvos = {}

        for dados_docente in docentes:
            docente = self.salvar_docente(dados_docente)
            docente.cursos_vinculados.add(curso)
            docentes_salvos[docente.nome_docente] = docente

        return docentes_salvos

    def salvar_docente(self, dados):
        nome = dados.get("nome")
        unidade = self.obter_unidade(dados.get("lotacao"))

        docente = Docente.objects.filter(nome_docente=nome).first()
        valores = {
            "titulacao_docente": dados.get("titulacao"),
            "centro_lotacao": dados.get("lotacao"),
            "unidade_vinculo": unidade,
            "cargo_docente": dados.get("cargo"),
            "jornada_docente": dados.get("jornada"),
            "tempo_casa_docente": self.extrair_anos(dados.get("tempo_de_casa")),
        }

        if docente is None:
            docente = Docente.objects.create(nome_docente=nome, **valores)
        else:
            for campo, valor in valores.items():
                setattr(docente, campo, valor)
            docente.save()

        return docente

    def definir_coordenador(self, curso, nome_coordenador, docentes_curso):
        if not nome_coordenador:
            return

        coordenador = docentes_curso.get(nome_coordenador)

        if coordenador is None:
            coordenador = Docente.objects.filter(nome_docente=nome_coordenador).first()
    
        if coordenador is None:
            coordenador = Docente.objects.create(nome_docente=nome_coordenador)
            coordenador.cursos_vinculados.add(curso)

        if curso.coordenador_id != coordenador.id_docente:
            curso.coordenador = coordenador
            curso.save(update_fields=["coordenador", "updated_at"])

    def salvar_curriculo(self, curso, dados):
        min_periodo, max_periodo = self.extrair_dois_inteiros(
            dados.get("carga_horaria_periodo"),
            padrao=(30, 600)
        )
        tranc_totais, tranc_parciais = self.extrair_dois_inteiros(
            dados.get("numero_maximo_trancamentos"),
            padrao=(3, 20)
        )

        curriculo, _ = Curriculo.objects.update_or_create(
            curso=curso,
            versao=dados.get("curriculo") or "Sem versão",
            defaults={
                "regime_letivo": dados.get("regime_letivo") or Curriculo.Regime.SEMESTRAL,
                "num_periodos_ideal": self.extrair_inteiro(dados.get("numero_periodos")),
                "total_creditos": self.extrair_inteiro(dados.get("total_creditos")),
                "carga_horaria_total": self.extrair_inteiro(dados.get("carga_horaria_total")),
                "carga_horaria_min_periodo": min_periodo,
                "carga_horaria_max_periodo": max_periodo,
                "num_trancamentos_totais": tranc_totais,
                "num_trancamentos_parciais": tranc_parciais,
                "status": Curriculo.Status.ATIVA_ANTERIOR,
            }
        )
        return curriculo

    def salvar_disciplinas_curriculo(self, curso, curriculo, disciplinas):
        for ordem, dados_disciplina in enumerate(disciplinas, start=1):
            informacoes = dados_disciplina.get("informacoes_gerais", {})
            disciplina = self.salvar_disciplina(curso, informacoes, dados_disciplina)
            self.salvar_vinculo_curriculo_disciplina(
                curriculo,
                disciplina,
                informacoes,
                ordem
            )
            self.salvar_docentes_disciplina(
                curso,
                disciplina,
                dados_disciplina.get("docentes", []),
                None,
                None
            )

    def salvar_disciplina(self, curso, informacoes, dados_disciplina):
        unidade = self.obter_unidade(informacoes.get("unidade"))
        disciplina, _ = Disciplina.objects.update_or_create(
            codigo_disciplina=informacoes.get("codigo"),
            defaults={
                "nome_disciplina": informacoes.get("nome") or "",
                "unidade": unidade,
                "carga_horaria": self.extrair_inteiro(informacoes.get("carga_horaria")),
                "creditos": self.extrair_inteiro(informacoes.get("creditos")),
                "nota_minima_aprovacao": self.extrair_decimal(
                    informacoes.get("nota_minima"),
                    Decimal("5.0")
                ),
                "ementa": dados_disciplina.get("ementa"),
                "programa": dados_disciplina.get("programa"),
                "objetivos": dados_disciplina.get("objetivos"),
            }
        )
        disciplina.cursos_vinculados.add(curso)
        return disciplina

    def salvar_vinculo_curriculo_disciplina(self, curriculo, disciplina, informacoes, ordem):
        CurriculoDisciplina.objects.update_or_create(
            curriculo=curriculo,
            disciplina=disciplina,
            defaults={
                "periodo": self.extrair_inteiro(informacoes.get("periodo_ideal")) or 0,
                "tipo_disciplina": informacoes.get("tipo") or CurriculoDisciplina.Tipo.OBRIGATORIA,
                "ordem_exibicao": ordem,
            }
        )

    def salvar_docentes_disciplina(self, curso, disciplina, nomes_docentes, ano, semestre):
        for nome_docente in nomes_docentes:
            docente = Docente.objects.filter(nome_docente=nome_docente).first()

            if docente is None:
                docente = Docente.objects.create(nome_docente=nome_docente)

            docente.cursos_vinculados.add(curso)

            vinculo = DocenteDisciplina.objects.filter(
                docente=docente,
                disciplina=disciplina,
                curso=curso,
                ano=ano,
                semestre=semestre,
            ).first()

            if vinculo is None:
                DocenteDisciplina.objects.create(
                    docente=docente,
                    disciplina=disciplina,
                    curso=curso,
                    ano=ano,
                    semestre=semestre,
                )

    def salvar_ppc(self, curso, curriculo, dados_ppc):
        projeto = dados_ppc.get("projeto_pedagogico_curso") or {}
        documentos = dados_ppc.get("documentos_curso") or []

        primeiro_documento = documentos[0] if documentos else {}
        conteudo = json.dumps(projeto, ensure_ascii=False) if projeto else None

        if conteudo or primeiro_documento.get("url"):
            PPC.objects.update_or_create(
                curriculo=curriculo,
                defaults={
                    "conteudo": conteudo,
                    "arquivo_url": primeiro_documento.get("url"),
                }
            )

        for documento in documentos:
            self.salvar_documento_curso(curso, documento)

    def salvar_documento_curso(self, curso, documento):
        titulo = documento.get("nome")

        if not titulo:
            return

        documento_curso = DocumentoCurso.objects.filter(curso=curso, titulo=titulo).first()
        valores = {
            "arquivo_url": documento.get("url"),
            "tipo_documento": DocumentoCurso.Tipo.OUTRO,
        }

        if documento_curso is None:
            DocumentoCurso.objects.create(curso=curso, titulo=titulo, **valores)
        else:
            for campo, valor in valores.items():
                setattr(documento_curso, campo, valor)
            documento_curso.save()

    def obter_unidade(self, nome):
        if not nome:
            return None

        if not nome.lower().startswith("centro "):
            return None

        unidade, _ = Unidade.objects.get_or_create(nome_unidade=nome)
        return unidade

    def extrair_inteiro(self, valor):
        if valor is None:
            return None

        match = re.search(r"\d+", str(valor))
        return int(match.group()) if match else None

    def extrair_dois_inteiros(self, valor, padrao):
        numeros = re.findall(r"\d+", str(valor or ""))

        if len(numeros) >= 2:
            return int(numeros[0]), int(numeros[1])

        return padrao

    def extrair_anos(self, valor):
        if not valor:
            return None

        texto = str(valor).lower()
        numero = self.extrair_inteiro(texto)

        if numero is None:
            return None

        if "mês" in texto or "mes" in texto:
            return 0

        return numero

    def extrair_decimal(self, valor, padrao):
        if valor is None:
            return padrao

        try:
            return Decimal(str(valor).replace(",", "."))
        except (InvalidOperation, ValueError):
            return padrao
