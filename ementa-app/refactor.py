import os
import re

# 1. src/modules/disciplinas/services/types.ts
f = 'src/modules/disciplinas/services/types.ts'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()
content = re.sub(r'\s*bibliografiaBasica\?: string;', '', content)
content = re.sub(r'\s*bibliografiaComplementar\?: string;', '', content)
with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

# 2. src/modules/disciplinas/services/disciplinasService.ts
f = 'src/modules/disciplinas/services/disciplinasService.ts'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()
content = re.sub(r'\s*bibliografiaBasica:.*?,\n?', '\n', content)
content = re.sub(r'\s*bibliografiaComplementar:.*?,\n?', '\n', content)
content = re.sub(r'\s*bibliografia_basica:.*?,\n?', '\n', content)
content = re.sub(r'\s*bibliografia_complementar:.*?,\n?', '\n', content)
content = content.replace('const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;', 'const totalPages = response.total_pages || Math.ceil(totalItems / itemsPerPage) || 1;\n      const currentPage = response.current_page || page;')
content = content.replace('currentPage: page,', 'currentPage,')
with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

# 3. src/modules/cursos/services/cursosService.ts
f = 'src/modules/cursos/services/cursosService.ts'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()
content = content.replace('if (filtros?.termo && filtros.termo.trim() !== \'\') params.search = filtros.termo;', 
                          "if (filtros?.termo && filtros.termo.trim() !== '') params.search = filtros.termo;\n    if (filtros?.codigoExact && filtros.codigoExact.trim() !== '') params.codigo_curso = filtros.codigoExact;")
content = content.replace('const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;', 'const totalPages = response.total_pages || Math.ceil(totalItems / itemsPerPage) || 1;\n    const currentPage = response.current_page || page;')
content = content.replace('currentPage: page,', 'currentPage,')
with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

# 4. src/modules/cursos/services/types.ts
f = 'src/modules/cursos/services/types.ts'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()
content = content.replace('  termo?: string;', '  termo?: string;\n  codigoExact?: string;')
with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

