from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    CursoViewSet,
    CurriculoDisciplinaViewSet,
    CurriculoViewSet,
    dashboard_overview,
    DisciplinaViewSet,
    DocenteDisciplinaViewSet,
    DocenteViewSet,
    DocumentoCursoViewSet,
    PPCViewSet,
    UnidadeViewSet,
    UsuarioViewSet,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'docentes', DocenteViewSet, basename='docente')
router.register(r'unidades', UnidadeViewSet, basename='unidade')
router.register(r'cursos', CursoViewSet, basename='curso')
router.register(r'curriculos', CurriculoViewSet, basename='curriculo')
router.register(r'disciplinas', DisciplinaViewSet, basename='disciplina')
router.register(r'curriculo-disciplinas', CurriculoDisciplinaViewSet, basename='curriculo-disciplina')
router.register(r'docente-disciplinas', DocenteDisciplinaViewSet, basename='docente-disciplina')
router.register(r'ppcs', PPCViewSet, basename='ppc')
router.register(r'documentos-curso', DocumentoCursoViewSet, basename='documento-curso')

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/', dashboard_overview, name='dashboard-overview'),
    *router.urls,
]