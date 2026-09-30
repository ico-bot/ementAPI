# -*- coding: utf-8 -*-
import os

f = 'ementa-app/src/modules/cursos/components/filters/CursosFilterBar.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

content = content.replace("  exactCode: string;\n", "")
content = content.replace("  onExactCodeChange: (value: string) => void;\n", "")
content = content.replace("  exactCode,\n", "")
content = content.replace("  onExactCodeChange,\n", "")
content = content.replace("    exactCode.trim() !== '' ||\n", "")

input_str = '''
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
content = content.replace(input_str, "")

# Some edge cases
content = content.replace("exactCode: string;", "")
content = content.replace("onExactCodeChange: (value: string) => void;", "")

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

f2 = 'ementa-app/src/modules/cursos/pages/CursosListPage.tsx'
with open(f2, 'r', encoding='utf-8') as file:
    content = file.read()
content = content.replace("exactCode={exactCode}", "")
with open(f2, 'w', encoding='utf-8') as file:
    file.write(content)

