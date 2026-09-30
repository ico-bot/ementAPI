# -*- coding: utf-8 -*-
import os

f = 'ementa-app/src/modules/cursos/pages/CursosListPage.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = content.replace("    setExactCode('');\n", "")
content = content.replace("    setExactCode('');", "")

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
