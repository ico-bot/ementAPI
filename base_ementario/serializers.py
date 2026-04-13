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
        fields = "__all__"

class DocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Docente
        fields = "__all__"

class UnidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidade
        fields = "__all__"

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = "__all__"
        read_only_fields = ['id_curso']

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
            if hasattr(instance, atributo_final):
                data[campo] = getattr(instance, atributo_final)
                
        return data

    def update(self, instance, validated_data):
        validated_data.pop('codigo_curso', None)

        edicao, created = CursoEdicaoUsuario.objects.get_or_create(curso=instance)
        
        for attr, value in validated_data.items():
            if hasattr(edicao, attr):
                setattr(edicao, attr, value)
        
        edicao.save()
        return Curso.objects.consolidados().get(pk=instance.pk)

class CurriculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curriculo
        fields = "__all__"

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = "__all__"

class CurriculoDisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculoDisciplina
        fields = "__all__"

class DocenteDisciplinaSerializer(serializers.ModelSerializer):
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