from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

# O Router automatiza a criação dos endpoints da API
router = DefaultRouter()
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'docentes', views.DocenteViewSet)
router.register(r'unidades', views.UnidadeViewSet)
router.register(r'cursos', views.CursoViewSet)
router.register(r'curriculos', views.CurriculoViewSet)
router.register(r'disciplinas', views.DisciplinaViewSet)
router.register(r'curriculo-disciplinas', views.CurriculoDisciplinaViewSet)
router.register(r'docente-disciplinas', views.DocenteDisciplinaViewSet)
router.register(r'ppcs', views.PPCViewSet)
router.register(r'documentos-curso', views.DocumentoCursoViewSet)

urlpatterns = [
    # Rotas de Autenticação JWT
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Inclui todas as rotas geradas pelo router
    path('', include(router.urls)),
    
    # Nossa rota customizada do Dashboard que o admin vai usar
    path('dashboard/', views.dashboard_overview, name='dashboard-overview'),
    path('sync/', views.manual_sync, name='manual-sync'),
]