import sys
from django.apps import AppConfig
from django.db.models.signals import post_migrate

def create_default_admin(sender, **kwargs):
    from django.contrib.auth.models import User
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@admin.com', 'admin123')
        sys.stdout.write("\n==================================================\n")
        sys.stdout.write("USUARIO ADMIN PADRAO CRIADO COM SUCESSO!\n")
        sys.stdout.write("Login: admin\n")
        sys.stdout.write("Senha: admin123\n")
        sys.stdout.write("==================================================\n\n")
    

class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'extracao_dados'

    def ready(self):
        post_migrate.connect(create_default_admin, sender=self)