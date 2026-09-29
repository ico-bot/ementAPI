from rest_framework import serializers

from .models import (
    Curso,
    CursoEdicaoUsuario,
    Curriculo,
    CurriculoDisciplina,
    Disciplina,
    Docente,
    DocenteDisciplina,
    DocumentoCurso,
    PPC,
    Unidade,
    Usuario,
)

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # Segurança: Escondendo senha e permissões do AbstractUser
        exclude = ['password', 'groups', 'user_permissions', 'is_superuser', 'is_staff']

class DocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Docente
        fields = "__all__"

class UnidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidade
        fields = "__all__"

class CursoSerializer(serializers.ModelSerializer):
    # Trazendo o nome do coordenador em vez de apenas o ID para facilitar a leitura
    nome_coordenador = serializers.CharField(source='coordenador.nome_docente', read_only=True)
    carga_horaria = serializers.SerializerMethodField()

    class Meta:
        model = Curso
        fields = "__all__"
        read_only_fields = ['id_curso']

    def get_carga_horaria(self, obj):
        curriculo = obj.curriculos.filter(status='Corrente').first() or obj.curriculos.first()
        return curriculo.carga_horaria_total if curriculo else 0

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        campos_conflito = [
            'nome_curso', 'nivel_curso', 'turno_curso', 'modalidade_curso', 
            'area_conhecimento_curso', 'funcionamento_curso', 
            'grau_academico', 'ato_autorizacao_curso', 
            'ato_reconhecimento_curso', 'conceito_mec_curso'
        ]

        for campo in campos_conflito:
            atributo_final = f"{campo}_final"
            # Substitui o valor do campo original pelo valor consolidado, se existir
            if hasattr(instance, atributo_final) and getattr(instance, atributo_final) is not None:
                data[campo] = getattr(instance, atributo_final)
                
        return data

    def update(self, instance, validated_data):
        # Impede a alteração do código do curso, pois é a chave de integração com a UFAC
        validated_data.pop('codigo_curso', None)

        edicao, created = CursoEdicaoUsuario.objects.get_or_create(curso=instance)
        
        for attr, value in validated_data.items():
            if hasattr(edicao, attr):
                setattr(edicao, attr, value)
        
        edicao.save()
        return Curso.objects.consolidados().get(pk=instance.pk)

class CurriculoSerializer(serializers.ModelSerializer):
    nome_curso = serializers.CharField(source='curso.nome_curso', read_only=True)

    class Meta:
        model = Curriculo
        fields = "__all__"
    
class DisciplinaSerializer(serializers.ModelSerializer):
    nome_unidade = serializers.CharField(source='unidade.nome_unidade', read_only=True)

    class Meta:
        model = Disciplina
        fields = "__all__"

    def create(self, validated_data):
        validated_data['inserido_manualmente'] = True
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['editado_manualmente'] = True
        return super().update(instance, validated_data)

class CurriculoDisciplinaSerializer(serializers.ModelSerializer):
    # DX: Trazendo os dados completos da disciplina junto com a grade para evitar múltiplas requisições do Front-end
    codigo_disciplina = serializers.CharField(source='disciplina.codigo_disciplina', read_only=True)
    nome_disciplina = serializers.CharField(source='disciplina.nome_disciplina', read_only=True)
    carga_horaria = serializers.IntegerField(source='disciplina.carga_horaria', read_only=True)
    creditos = serializers.IntegerField(source='disciplina.creditos', read_only=True)
    nota_minima_aprovacao = serializers.DecimalField(source='disciplina.nota_minima_aprovacao', max_digits=3, decimal_places=1, read_only=True)
    nome_unidade = serializers.CharField(source='disciplina.unidade.nome_unidade', read_only=True)
    ementa = serializers.CharField(source='disciplina.ementa', read_only=True)
    programa = serializers.CharField(source='disciplina.programa', read_only=True)
    objetivos = serializers.CharField(source='disciplina.objetivos', read_only=True)
    metodologia = serializers.CharField(source='disciplina.metodologia', read_only=True)
    avaliacao = serializers.CharField(source='disciplina.avaliacao', read_only=True)
    bibliografia_basica = serializers.CharField(source='disciplina.bibliografia_basica', read_only=True)
    bibliografia_complementar = serializers.CharField(source='disciplina.bibliografia_complementar', read_only=True)
    editado_manualmente = serializers.BooleanField(source='disciplina.editado_manualmente', read_only=True)
    inserido_manualmente = serializers.BooleanField(source='disciplina.inserido_manualmente', read_only=True)

    class Meta:
        model = CurriculoDisciplina
        fields = "__all__"

class DocenteDisciplinaSerializer(serializers.ModelSerializer):
    nome_docente = serializers.CharField(source='docente.nome_docente', read_only=True)
    nome_disciplina = serializers.CharField(source='disciplina.nome_disciplina', read_only=True)

    class Meta:
        model = DocenteDisciplina
        fields = "__all__"

class PPCSerializer(serializers.ModelSerializer):
    class Meta:
        model = PPC
        fields = "__all__"

class DocumentoCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentoCurso
        fields = "__all__"