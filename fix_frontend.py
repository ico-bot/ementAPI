# -*- coding: utf-8 -*-
import os
import re

# 1. src/modules/cursos/services/types.ts
f = 'ementa-app/src/modules/cursos/services/types.ts'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()
content = content.replace('  codigoExact?: string;\n', '')
with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

# 2. src/modules/cursos/services/cursosService.ts
f = 'ementa-app/src/modules/cursos/services/cursosService.ts'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

# Replace mapping to pad 3 zeros
mapping_old = "const codigo = dto.codigo_curso || 'SEM-CODIGO';"
mapping_new = "const rawCodigo = dto.codigo_curso || 'SEM-CODIGO';\n  const codigo = rawCodigo !== 'SEM-CODIGO' && /^\d+$/.test(rawCodigo) ? rawCodigo.padStart(3, '0') : rawCodigo;"
content = content.replace(mapping_old, mapping_new)

# Replace fetchCursos search logic
content = re.sub(r"if \(filtros\?\.termo && filtros\.termo\.trim\(\) !== ''\) params\.search = filtros\.termo;\n\s*if \(filtros\?\.codigoExact.*?\n", 
"""if (filtros?.termo && filtros.termo.trim() !== '') {
      const termoStr = filtros.termo.trim();
      if (/^\d{3,}$/.test(termoStr)) {
        params.codigo_curso = parseInt(termoStr, 10).toString();
      } else {
        params.search = termoStr;
      }
    }
    """, content)

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

# 3. src/modules/cursos/components/filters/CursosFilterBar.tsx
f = 'ementa-app/src/modules/cursos/components/filters/CursosFilterBar.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = content.replace('  exactCode: string;\n  onExactCodeChange: (value: string) => void;\n', '')
content = content.replace('  exactCode,\n  onExactCodeChange,\n', '')
content = content.replace("exactCode.trim() !== '' ||\n", '')

exact_input_regex = r'\{\/\* Exact Code Input \*\/\}[\s\S]*?\{\/\* Filter selects group \*\/\}'
content = re.sub(exact_input_regex, '{/* Filter selects group */}', content)

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

# 4. src/modules/cursos/pages/CursosListPage.tsx
f = 'ementa-app/src/modules/cursos/pages/CursosListPage.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = content.replace("const [exactCode, setExactCode] = useState('');\n", "")
content = content.replace("const [exactCode, setExactCode] = useState<string>('');\n", "")
content = content.replace("      codigoExact: exactCode,\n", "")
content = content.replace("    setExactCode('');\n", "")
content = content.replace("          exactCode={exactCode}\n          onExactCodeChange={setExactCode}\n", "")

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

