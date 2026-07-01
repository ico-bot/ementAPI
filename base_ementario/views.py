from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_api_key.permissions import HasAPIKey

from .models import (
    Curso,
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
from .serializers import (
    CursoSerializer,
    CurriculoDisciplinaSerializer,
    CurriculoSerializer,
    DisciplinaSerializer,
    DocenteDisciplinaSerializer,
    DocenteSerializer,
    DocumentoCursoSerializer,
    PPCSerializer,
    UnidadeSerializer,
    UsuarioSerializer,
)

class IsAdminOrHasAPIKey(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            is_admin = bool(request.user and request.user.is_staff)
            has_api_key = HasAPIKey().has_permission(request, view)
            return is_admin or has_api_key
        return bool(request.user and request.user.is_staff)

def base(request):
    return render(request, 'base.html')

def _resolve_activity_status(disciplina: Disciplina) -> str:
    if not disciplina.ementa or not disciplina.programa:
        return 'Desatualizado'
    elapsed_seconds = (disciplina.updated_at - disciplina.created_at).total_seconds()
    if elapsed_seconds > 120:
        return 'Manual'
    return 'Sincronizado!'

@api_view(['GET'])
@permission_classes([IsAdminOrHasAPIKey])
def dashboard_overview(_request):
    total_cursos = Curso.objects.count()
    sincronizados = Curso.objects.consolidados().filter(
        funcionamento_curso_final=Curso.Funcionamento.ATIVO).count()
    desatualizados = max(total_cursos - sincronizados, 0)
    inseridos_manualmente = 0

    latest_candidates = [
        Curso.objects.order_by('-updated_at').values_list('updated_at', flat=True).first(),
        Disciplina.objects.order_by('-updated_at').values_list('updated_at', flat=True).first(),
        Curriculo.objects.order_by('-updated_at').values_list('updated_at', flat=True).first(),
    ]
    latest_sync = max((value for value in latest_candidates if value is not None), default=None)

    recent_disciplinas = (
        Disciplina.objects.select_related('unidade').order_by('-updated_at', '-id_disciplina')[:5]
    )

    recent_activity = [
        {
            'code': disciplina.codigo_disciplina,
            'title': disciplina.nome_disciplina,
            'area': disciplina.unidade.nome_unidade if disciplina.unidade else 'Unidade nao informada',
            'status': _resolve_activity_status(disciplina),
        }
        for disciplina in recent_disciplinas
    ]

    return Response(
        {
            'last_sync': latest_sync.isoformat() if latest_sync else None,
            'metrics': {
                'total_cursos': total_cursos,
                'sincronizados': sincronizados,
                'desatualizados': desatualizados,
                'inseridos_manualmente': inseridos_manualmente,
            },
            'recent_activity': recent_activity,
        }
    )

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('id')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['cpf_usuario', 'email_usuario']
    search_fields = ['username', 'first_name']

class DocenteViewSet(viewsets.ModelViewSet):
    queryset = Docente.objects.all().order_by('id_docente')
    serializer_class = DocenteSerializer
    permission_classes = [IsAdminOrHasAPIKey]
    filterset_fields = ['titulacao_docente', 'cargo_docente', 'centro_lotacao', 'unidade_vinculo', 'cursos_vinculados']
    search_fields = ['nome_docente', 'email_docente']

class UnidadeViewSet(viewsets.ModelViewSet):
    queryset = Unidade.objects.all().order_by('id_unidade')
    serializer_class = UnidadeSerializer
    permission_classes = [IsAdminOrHasAPIKey]
    filterset_fields = ['campus', 'sigla']
    search_fields = ['nome_unidade']

class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.consolidados().order_by('id_curso')
    serializer_class = CursoSerializer
    permission_classes = [IsAdminOrHasAPIKey]
    filterset_fields = ['nivel_curso', 'turno_curso', 'modalidade_curso', 'funcionamento_curso']
    search_fields = ['nome_curso', 'codigo_curso', 'area_conhecimento_curso']
    ordering_fields = ['nome_curso', 'created_at']

class CurriculoViewSet(viewsets.ModelViewSet):
    queryset = Curriculo.objects.all().order_by('id_curriculo')
    serializer_class = CurriculoSerializer
    permission_classes = [IsAdminOrHasAPIKey]
    filterset_fields = ['curso', 'status', 'regime_letivo']

class DisciplinaViewSet(viewsets.ModelViewSet):
    queryset = Disciplina.objects.all().order_by('id_disciplina')
    serializer_class = DisciplinaSerializer
    permission_classes = [IsAdminOrHasAPIKey]
    filterset_fields = ['unidade', 'creditos', 'cursos_vinculados']
    search_fields = ['nome_disciplina', 'codigo_disciplina', 'ementa']
    ordering_fields = ['nome_disciplina', 'codigo_disciplina']

class CurriculoDisciplinaViewSet(viewsets.ModelViewSet):
    queryset = CurriculoDisciplina.objects.all().order_by('id_curriculo_disciplina')
    serializer_class = CurriculoDisciplinaSerializer
    permission_classes = [IsAdminOrHasAPIKey]
    filterset_fields = ['curriculo', 'disciplina', 'periodo', 'tipo_disciplina']

class DocenteDisciplinaViewSet(viewsets.ModelViewSet):
    queryset = DocenteDisciplina.objects.all().order_by('id_docente_disciplina')
    serializer_class = DocenteDisciplinaSerializer
    permission_classes = [IsAdminOrHasAPIKey]
    filterset_fields = ['docente', 'disciplina', 'curso', 'ano', 'semestre']

class PPCViewSet(viewsets.ModelViewSet):
    queryset = PPC.objects.all().order_by('id_ppc')
    serializer_class = PPCSerializer
    permission_classes = [IsAdminOrHasAPIKey]

class DocumentoCursoViewSet(viewsets.ModelViewSet):
    queryset = DocumentoCurso.objects.all().order_by('id_documento')
    serializer_class = DocumentoCursoSerializer
    permission_classes = [IsAdminOrHasAPIKey]
    filterset_fields = ['curso', 'tipo_documento']
    search_fields = ['titulo']
