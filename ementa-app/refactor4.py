# -*- coding: utf-8 -*-
import os

# CursosFilterBar.tsx
f = 'src/modules/cursos/components/filters/CursosFilterBar.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = content.replace('searchTerm: string;', 'searchTerm: string;\n  exactCode: string;\n  onExactCodeChange: (value: string) => void;')
content = content.replace('searchTerm,', 'searchTerm,\n  exactCode,\n  onExactCodeChange,')
content = content.replace('searchTerm.trim() !== \'\' ||', 'searchTerm.trim() !== \'\' ||\n    exactCode.trim() !== \'\' ||')

new_input = '''
        {/* Exact Code Input */}
        <div className="relative flex-1 max-w-[200px]">
          <input
            type="text"
            value={exactCode}
            onChange={(e) => onExactCodeChange(e.target.value)}
            placeholder="Código Exato (Ex: 30)"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/80 transition-all"
          />
        </div>
'''
content = content.replace('{/* Filter selects group */}', new_input + '\n        {/* Filter selects group */}')
with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

# CursosListPage.tsx
f = 'src/modules/cursos/pages/CursosListPage.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = content.replace('const [searchTerm, setSearchTerm] = useState(\'\');', 'const [searchTerm, setSearchTerm] = useState(\'\');\n  const [exactCode, setExactCode] = useState(\'\');')

content = content.replace('termo: searchTerm,', 'termo: searchTerm,\n      codigoExact: exactCode,')

content = content.replace('setSearchTerm(\'\');', 'setSearchTerm(\'\');\n    setExactCode(\'\');')

content = content.replace('searchTerm={searchTerm}', 'searchTerm={searchTerm}\n          exactCode={exactCode}\n          onExactCodeChange={setExactCode}')

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

