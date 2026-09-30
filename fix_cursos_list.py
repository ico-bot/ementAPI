# -*- coding: utf-8 -*-
import os
import re

f = 'ementa-app/src/modules/cursos/pages/CursosListPage.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = re.sub(r'\s*codigoExact:.*?,', '', content)
content = re.sub(r'\s*codigoExact=\{.*?\}', '', content)
content = re.sub(r'\s*onExactCodeChange=\{.*?\}', '', content)

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
