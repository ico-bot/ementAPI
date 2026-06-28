import os
import sys
from django.apps import AppConfig
from django.db.models.signals import post_migrate

def create_default_admin(sender, **kwargs):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # Lê a senha do arquivo .env. 
    admin_password = os.getenv('DEFAULT_ADMIN_PASSWORD', 'admin123_temp')
    
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@admin.com', admin_password)
        sys.stdout.write("\n==================================================\n")
        sys.stdout.write("USUARIO ADMIN PADRAO CRIADO COM SUCESSO!\n")
        sys.stdout.write("Login: admin\n")
        sys.stdout.write("Senha: [OCULTA POR SEGURANÇA - VEJA O ARQUIVO .ENV]\n")
        sys.stdout.write("==================================================\n\n")

class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base_ementario'

    def ready(self):
        post_migrate.connect(create_default_admin, sender=self)