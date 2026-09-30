# -*- coding: utf-8 -*-
import os
import re

f = 'extracao_dados/extratores/curso.py'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = content.replace('dados["codigo_curso"] = str(match.group(2))', 'codigo_bruto = str(match.group(2))\n                    dados["codigo_curso"] = codigo_bruto.zfill(3) if codigo_bruto.isdigit() else codigo_bruto')

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
