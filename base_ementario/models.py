from django.db import models
from django.db.models.functions import Coalesce
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    cpf_usuario = models.CharField(
        max_length=14, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'usuario'

    def __str__(self):
        return self.username



class Docente(models.Model):

    class Titulacao(models.TextChoices):
        GRADUACAO = 'Graduação', 'Graduação'
        ESPECIALIZACAO = 'Especialização', 'Especialização'
        MESTRADO = 'Mestrado', 'Mestrado'
        DOUTORADO = 'Doutorado', 'Doutorado'
        POS_DOUTORADO = 'Pós-Doutorado', 'Pós-Doutorado'

    class Cargo(models.TextChoices):
        ADJUNTO = 'Professor Adjunto', 'Professor Adjunto'
        ASSISTENTE = 'Professor Assistente', 'Professor Assistente'
        TITULAR = 'Professor Titular', 'Professor Titular'
        SUBSTITUTO = 'Professor Substituto', 'Professor Substituto'
        MAGISTERIO_SUPERIOR = 'Professor do Magistério Superior', 'Professor do Magistério Superior'

    id_docente = models.AutoField(primary_key=True)
    nome_docente = models.CharField(max_length=255)
    titulacao_docente = models.CharField(
        max_length=50, choices=Titulacao.choices, null=True, blank=True)
    centro_lotacao = models.CharField(max_length=255, null=True, blank=True)
    unidade_vinculo = models.ForeignKey(
        'Unidade', on_delete=models.SET_NULL, null=True, blank=True, related_name='docentes_vinculados')
    cursos_vinculados = models.ManyToManyField(
        'Curso', related_name='corpo_docente', blank=True)
    cargo_docente = models.CharField(
        max_length=100, choices=Cargo.choices, null=True, blank=True)
    jornada_docente = models.CharField(max_length=50, null=True, blank=True)
    tempo_casa_docente = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'docente'
        indexes = [
            models.Index(fields=['nome_docente'], name='idx_nome_docente'),
        ]

    def __str__(self):
        return self.nome_docente



class Unidade(models.Model):
    id_unidade = models.AutoField(primary_key=True)
    nome_unidade = models.CharField(max_length=255, unique=True)
    sigla = models.CharField(max_length=20, null=True, blank=True)
    campus = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'unidade'
        indexes = [
            models.Index(fields=['sigla'], name='idx_sigla_unidade'),
        ]

    def __str__(self):
        return self.nome_unidade



class CursoManager(models.Manager):
    def consolidados(self):
        return self.select_related('edicao_usuario').annotate(
            nome_curso_final=Coalesce(
                'edicao_usuario__nome_curso', 'nome_curso'),
            nivel_curso_final=Coalesce(
                'edicao_usuario__nivel_curso', 'nivel_curso'),
            turno_curso_final=Coalesce(
                'edicao_usuario__turno_curso', 'turno_curso'),
            modalidade_curso_final=Coalesce(
                'edicao_usuario__modalidade_curso', 'modalidade_curso'),
            area_conhecimento_curso_final=Coalesce(
                'edicao_usuario__area_conhecimento_curso', 'area_conhecimento_curso'),
            funcionamento_curso_final=Coalesce(
                'edicao_usuario__funcionamento_curso', 'funcionamento_curso'),
            grau_academico_final=Coalesce(
                'edicao_usuario__grau_academico', 'grau_academico'),
            ato_autorizacao_curso_final=Coalesce(
                'edicao_usuario__ato_autorizacao_curso', 'ato_autorizacao_curso'),
            ato_reconhecimento_curso_final=Coalesce(
                'edicao_usuario__ato_reconhecimento_curso', 'ato_reconhecimento_curso'),
            conceito_mec_curso_final=Coalesce(
                'edicao_usuario__conceito_mec_curso', 'conceito_mec_curso'),
        )



class Curso(models.Model):
    class Nivel(models.TextChoices):
        GRADUACAO = 'Graduação', 'Graduação'
        POS_GRADUACAO = 'Pós-Graduação', 'Pós-Graduação'

    class Turno(models.TextChoices):
        INTEGRAL = 'Integral', 'Integral'
        MATUTINO = 'Matutino', 'Matutino'
        VESPERTINO = 'Vespertino', 'Vespertino'
        NOTURNO = 'Noturno', 'Noturno'
        DIURNO = 'Diurno', 'Diurno'

    class Funcionamento(models.TextChoices):
        ATIVO = 'Em atividade', 'Em atividade'
        INATIVO = 'Inativo', 'Inativo'
        SUSPENSO = 'Suspenso', 'Suspenso'

    id_curso = models.AutoField(primary_key=True)
    codigo_curso = models.CharField(max_length=20, unique=True)
    nome_curso = models.CharField(max_length=255)
    nivel_curso = models.CharField(max_length=20, choices=Nivel.choices)
    turno_curso = models.CharField(
        max_length=20, choices=Turno.choices, null=True, blank=True)
    modalidade_curso = models.CharField(max_length=45, null=True, blank=True)
    area_conhecimento_curso = models.CharField(
        max_length=100, null=True, blank=True)
    funcionamento_curso = models.CharField(
        max_length=20, choices=Funcionamento.choices, default=Funcionamento.ATIVO)
    grau_academico = models.CharField(max_length=100, null=True, blank=True)
    ato_autorizacao_curso = models.TextField(null=True, blank=True)
    ato_reconhecimento_curso = models.TextField(null=True, blank=True)
    conceito_mec_curso = models.CharField(max_length=50, null=True, blank=True)
    coordenador = models.ForeignKey(
        Docente, on_delete=models.SET_NULL, null=True, blank=True, db_column='coordenador_id')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CursoManager()

    class Meta:
        db_table = 'curso'
        indexes = [
            models.Index(fields=['codigo_curso'], name='idx_codigo_curso'),
            models.Index(fields=['nome_curso'], name='idx_nome_curso'),
        ]

    def __str__(self):
        return f"{self.nome_curso} ({self.codigo_curso})"



class CursoEdicaoUsuario(models.Model):
    curso = models.OneToOneField(
        Curso,
        on_delete=models.CASCADE,
        related_name='edicao_usuario',
        primary_key=True
    )
    nome_curso = models.CharField(max_length=255, null=True, blank=True)
    nivel_curso = models.CharField(
        max_length=20, choices=Curso.Nivel.choices, null=True, blank=True)
    turno_curso = models.CharField(
        max_length=20, choices=Curso.Turno.choices, null=True, blank=True)
    modalidade_curso = models.CharField(max_length=45, null=True, blank=True)
    area_conhecimento_curso = models.CharField(
        max_length=100, null=True, blank=True)
    funcionamento_curso = models.CharField(
        max_length=20, choices=Curso.Funcionamento.choices, null=True, blank=True)
    grau_academico = models.CharField(max_length=100, null=True, blank=True)
    ato_autorizacao_curso = models.TextField(null=True, blank=True)
    ato_reconhecimento_curso = models.TextField(null=True, blank=True)
    conceito_mec_curso = models.CharField(max_length=50, null=True, blank=True)
    modificado_por = models.ForeignKey(
        Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'curso_edicao_usuario'



class Curriculo(models.Model):
    class Regime(models.TextChoices):
        SEMESTRAL = 'Semestral', 'Semestral'
        ANUAL = 'Anual', 'Anual'

    class Status(models.TextChoices):
        CORRENTE = 'Corrente', 'Corrente'
        ATIVA_ANTERIOR = 'Ativa Anterior', 'Ativa Anterior'
        INATIVO = 'Inativo', 'Inativo'

    id_curriculo = models.AutoField(primary_key=True)
    curso = models.ForeignKey(
        Curso, on_delete=models.CASCADE, related_name='curriculos')
    versao = models.CharField(max_length=120)
    ano_inicio = models.IntegerField(default=2024)
    semestre_inicio = models.IntegerField(default=1)
    regime_letivo = models.CharField(
        max_length=20, choices=Regime.choices, default=Regime.SEMESTRAL)
    num_periodos_ideal = models.IntegerField(null=True, blank=True)
    total_creditos = models.IntegerField(null=True, blank=True)
    carga_horaria_total = models.IntegerField(null=True, blank=True)
    carga_horaria_min_periodo = models.IntegerField(default=30)
    carga_horaria_max_periodo = models.IntegerField(default=600)
    num_trancamentos_totais = models.IntegerField(default=3)
    num_trancamentos_parciais = models.IntegerField(default=20)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.ATIVA_ANTERIOR)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'curriculo'
        unique_together = [
            ['curso', 'versao', 'ano_inicio', 'semestre_inicio']]
        indexes = [
            models.Index(fields=['status'], name='idx_status_curriculo'),
        ]

    def __str__(self):
        return f"{self.curso.nome_curso} - {self.versao} ({self.ano_inicio}/{self.semestre_inicio})"



class Disciplina(models.Model):
    id_disciplina = models.AutoField(primary_key=True)
    codigo_disciplina = models.CharField(max_length=120, unique=True)
    nome_disciplina = models.CharField(max_length=255)
    unidade = models.ForeignKey(
        Unidade, on_delete=models.SET_NULL, null=True, blank=True)
    cursos_vinculados = models.ManyToManyField(
        Curso, related_name='disciplinas_diretas', blank=True)
    carga_horaria = models.IntegerField(null=True, blank=True)
    creditos = models.IntegerField(null=True, blank=True)
    nota_minima_aprovacao = models.DecimalField(
        max_digits=3, decimal_places=1, default=5.0)
    ementa = models.TextField(null=True, blank=True)
    programa = models.TextField(null=True, blank=True)
    objetivos = models.TextField(null=True, blank=True)
    metodologia = models.TextField(null=True, blank=True)
    avaliacao = models.TextField(null=True, blank=True)
    bibliografia_basica = models.TextField(null=True, blank=True)
    bibliografia_complementar = models.TextField(null=True, blank=True)
    inserido_manualmente = models.BooleanField(default=False)
    editado_manualmente = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'disciplina'
        indexes = [
            models.Index(fields=['codigo_disciplina'],
                         name='idx_codigo_disciplina'),
            models.Index(fields=['nome_disciplina'],
                         name='idx_nome_disciplina'),
        ]

    def __str__(self):
        return f"{self.codigo_disciplina} - {self.nome_disciplina}"



class CurriculoDisciplina(models.Model):
    class Tipo(models.TextChoices):
        OBRIGATORIA = 'Obrigatória', 'Obrigatória'
        OPTATIVA = 'Optativa', 'Optativa'
        ELETIVA = 'Eletiva', 'Eletiva'
        ATIVIDADES_COMPLEMENTARES_PG = 'Atividades Complementares de PG', 'Atividades Complementares de PG'

    id_curriculo_disciplina = models.AutoField(primary_key=True)
    curriculo = models.ForeignKey(Curriculo, on_delete=models.CASCADE)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    periodo = models.IntegerField(default=1)
    tipo_disciplina = models.CharField(
        max_length=50, choices=Tipo.choices, default=Tipo.OBRIGATORIA)
    ordem_exibicao = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'curriculo_disciplina'
        unique_together = [['curriculo', 'disciplina']]
        indexes = [
            models.Index(fields=['periodo'], name='idx_periodo_cd'),
        ]

    def __str__(self):
        return f"{self.curriculo} - {self.disciplina} ({self.periodo}º)"



class DocenteDisciplina(models.Model):
    id_docente_disciplina = models.AutoField(primary_key=True)
    docente = models.ForeignKey(
        Docente, on_delete=models.CASCADE, related_name='vinculos_disciplinas')
    disciplina = models.ForeignKey(
        Disciplina, on_delete=models.CASCADE, related_name='vinculos_docentes')
    curso = models.ForeignKey(
        Curso, on_delete=models.CASCADE, related_name='docentes_disciplinas')
    ano = models.IntegerField(default=2024)
    semestre = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'docente_disciplina'
        indexes = [
            models.Index(fields=['ano', 'semestre'],
                         name='idx_ano_semestre_dd'),
        ]



class PPC(models.Model):
    id_ppc = models.AutoField(primary_key=True)
    curriculo = models.OneToOneField(Curriculo, on_delete=models.CASCADE)
    conteudo = models.TextField(null=True, blank=True)
    arquivo_url = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ppc'



class DocumentoCurso(models.Model):
    
    class Tipo(models.TextChoices):
        REGULAMENTO = 'Regulamento', 'Regulamento'
        PORTARIA = 'Portaria', 'Portaria'
        RESOLUCAO = 'Resolução', 'Resolução'
        OUTRO = 'Outro', 'Outro'

    id_documento = models.AutoField(primary_key=True)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    arquivo_url = models.CharField(max_length=500, null=True, blank=True)
    tipo_documento = models.CharField(
        max_length=20, choices=Tipo.choices, default=Tipo.OUTRO)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'documento_curso'