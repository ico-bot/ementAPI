import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ementaAPI.settings')
django.setup()

from base_ementario.models import Curso

for c in Curso.objects.filter(nome_curso__icontains='Sistemas'):
    print(repr(c.codigo_curso), c.nome_curso)
