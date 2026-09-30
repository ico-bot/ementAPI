# -*- coding: utf-8 -*-
import os
import re

f = 'src/modules/disciplinas/components/modals/NewDisciplinaModal.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = re.sub(r'\s*bibliografiaBasica:.*?,\n?', '\n', content)
content = re.sub(r'\s*bibliografiaComplementar:.*?,\n?', '\n', content)

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
