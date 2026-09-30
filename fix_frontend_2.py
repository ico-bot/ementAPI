# -*- coding: utf-8 -*-
import os
import re

f = 'ementa-app/src/modules/cursos/services/cursosService.ts'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

target = "    if (filtros?.termo && filtros.termo.trim() !== '') params.search = filtros.termo;\n    if (filtros?.codigoExact && filtros.codigoExact.trim() !== '') params.codigo_curso = filtros.codigoExact;"
replacement = """    if (filtros?.termo && filtros.termo.trim() !== '') {
      const termoStr = filtros.termo.trim();
      if (/^\d{3,}$/.test(termoStr)) {
        params.codigo_curso = parseInt(termoStr, 10).toString();
      } else {
        params.search = termoStr;
      }
    }"""
content = content.replace(target, replacement)

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
