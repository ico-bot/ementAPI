
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('', include('base.urls')),
    path('admin/', admin.site.urls),
    path('base/', include('base.urls')),
    path('api/', include('base.api_urls')),
    path('api-auth/', include('rest_framework.urls')),
    
    # Documentação
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]