# -*- coding: utf-8 -*-
import os

f = 'base_ementario/views.py'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

if 'from django.db.models import Case, When, Value, IntegerField' not in content:
    content = 'from django.db.models import Case, When, Value, IntegerField\nfrom django.db.models.functions import Length\n' + content

content = content.replace(
    "filterset_fields = ['nivel_curso', 'turno_curso', 'modalidade_curso', 'funcionamento_curso']",
    "filterset_fields = ['nivel_curso', 'turno_curso', 'modalidade_curso', 'funcionamento_curso', 'codigo_curso']"
)

custom_filter = '''
    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        search_term = self.request.query_params.get('search', '').strip()
        if search_term and search_term.isdigit():
            queryset = queryset.annotate(
                is_exact=Case(
                    When(codigo_curso=search_term, then=Value(0)),
                    default=Value(1),
                    output_field=IntegerField(),
                ),
                code_len=Length('codigo_curso')
            ).order_by('is_exact', 'code_len', 'id_curso')
        return queryset
'''

if 'def filter_queryset' not in content:
    content = content.replace("ordering_fields = ['nome_curso', 'created_at']", "ordering_fields = ['nome_curso', 'created_at']\n" + custom_filter)

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
