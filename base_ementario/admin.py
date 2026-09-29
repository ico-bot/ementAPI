from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Usuario, Docente, Unidade, Curso, CursoEdicaoUsuario, Curriculo, 
    Disciplina, CurriculoDisciplina, DocenteDisciplina, 
    PPC, DocumentoCurso
)

@admin.register(Usuario)
class CustomUsuarioAdmin(UserAdmin):
    list_display = ('id', 'username', 'first_name', 'email', 'cpf_usuario', 'is_staff')
    search_fields = ('username', 'first_name', 'email', 'cpf_usuario')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Informações Adicionais', {'fields': ('cpf_usuario',)}),
    )

@admin.register(Docente)
class DocenteAdmin(admin.ModelAdmin):
    list_display = ('id_docente', 'nome_docente', 'unidade_vinculo', 'titulacao_docente', 'cargo_docente')
    search_fields = ('nome_docente', 'email_docente')
    list_filter = ('unidade_vinculo', 'titulacao_docente', 'cargo_docente')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('cursos_vinculados',) 

@admin.register(Unidade)
class UnidadeAdmin(admin.ModelAdmin):
    list_display = ('id_unidade', 'nome_unidade', 'sigla', 'campus')
    search_fields = ('nome_unidade', 'sigla', 'campus')
    list_filter = ('campus',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = (
        'id_curso',
        'codigo_curso',
        'nome_curso',
        'nivel_curso',
        'turno_curso',
        'funcionamento_curso',
        'coordenador',
    )
    search_fields = ('codigo_curso', 'nome_curso')
    list_filter = ('nivel_curso', 'turno_curso', 'funcionamento_curso', 'modalidade_curso')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ['coordenador']

@admin.register(CursoEdicaoUsuario)
class CursoEdicaoUsuarioAdmin(admin.ModelAdmin):
    list_display = ('curso', 'nome_curso', 'modificado_por', 'updated_at')
    search_fields = ('curso__nome_curso', 'nome_curso')
    autocomplete_fields = ['curso', 'modificado_por']

@admin.register(Curriculo)
class CurriculoAdmin(admin.ModelAdmin):
    list_display = ('id_curriculo', 'curso', 'versao', 'status', 'total_creditos')
    search_fields = ('versao', 'curso__nome_curso')
    list_filter = ('status', 'regime_letivo')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ['curso']

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ('id_disciplina', 'codigo_disciplina', 'nome_disciplina', 'unidade', 'carga_horaria', 'creditos')
    search_fields = ('codigo_disciplina', 'nome_disciplina')
    list_filter = ('unidade', 'creditos')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ['unidade']
    filter_horizontal = ('cursos_vinculados',)

@admin.register(CurriculoDisciplina)
class CurriculoDisciplinaAdmin(admin.ModelAdmin):
    list_display = ('id_curriculo_disciplina', 'curriculo', 'disciplina', 'periodo', 'tipo_disciplina')
    search_fields = ('curriculo__versao', 'disciplina__nome_disciplina')
    list_filter = ('periodo', 'tipo_disciplina')
    autocomplete_fields = ['curriculo', 'disciplina']

@admin.register(DocenteDisciplina)
class DocenteDisciplinaAdmin(admin.ModelAdmin):
    list_display = ('id_docente_disciplina', 'docente', 'disciplina', 'curso', 'ano', 'semestre')
    search_fields = ('docente__nome_docente', 'disciplina__nome_disciplina', 'curso__nome_curso')
    list_filter = ('ano', 'semestre')
    autocomplete_fields = ['docente', 'disciplina', 'curso']

@admin.register(PPC)
class PPCAdmin(admin.ModelAdmin):
    list_display = ('id_ppc', 'curriculo', 'created_at')
    search_fields = ('curriculo__versao', 'curriculo__curso__nome_curso')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ['curriculo']

@admin.register(DocumentoCurso)
class DocumentoCursoAdmin(admin.ModelAdmin):
    list_display = ('id_documento', 'curso', 'titulo', 'tipo_documento', 'created_at')
    search_fields = ('titulo', 'curso__nome_curso')
    list_filter = ('tipo_documento', 'created_at')
    autocomplete_fields = ['curso']
