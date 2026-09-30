# -*- coding: utf-8 -*-
import os
import re

def fix_detail():
    f = 'ementa-app/src/modules/disciplinas/components/modals/DisciplinaDetailModal.tsx'
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. DetailTabType
    content = content.replace("type DetailTabType = 'geral' | 'pedagogico' | 'bibliografia';", "type DetailTabType = 'geral' | 'pedagogico';")

    # 2. Bibliografia Button
    pattern_btn = re.compile(r'<button\s+type="button"\s+onClick=\{\(\) => setActiveTab\(\'bibliografia\'\)\}.*?</button>', re.DOTALL)
    content = pattern_btn.sub('', content)

    # 3. ABA 3 content (if it exists)
    pattern_aba3 = re.compile(r'\{\/\* ABA 3: BIBLIOGRAFIAS \*\/\}[\s\S]*?\{\/\* Rodapé', re.DOTALL)
    # Be careful to preserve closing div before Rodape if we replace until Rodapé
    match = pattern_aba3.search(content)
    if match:
        content = content[:match.start()] + '\n          </div>\n\n        {/* Rodapé' + content[match.end():]
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

def fix_edit():
    f = 'ementa-app/src/modules/disciplinas/components/modals/EditDisciplinaModal.tsx'
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace("type TabType = 'geral' | 'pedagogico' | 'bibliografia';", "type TabType = 'geral' | 'pedagogico';")
    content = content.replace("type EditTabType = 'geral' | 'pedagogico' | 'bibliografia';", "type EditTabType = 'geral' | 'pedagogico';")
    
    pattern_btn = re.compile(r'<button\s+type="button"\s+onClick=\{\(\) => setActiveTab\(\'bibliografia\'\)\}.*?</button>', re.DOTALL)
    content = pattern_btn.sub('', content)

    pattern_aba3 = re.compile(r'\{\/\* ABA 3: BIBLIOGRAFIAS \*\/\}[\s\S]*?\{\/\* Rodapé', re.DOTALL)
    match = pattern_aba3.search(content)
    if match:
        content = content[:match.start()] + '\n          </div>\n\n          {/* Rodapé' + content[match.end():]

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

def fix_new():
    f = 'ementa-app/src/modules/disciplinas/components/modals/NewDisciplinaModal.tsx'
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # states
    content = re.sub(r'const \[bibliografia, setBibliografia\] = useState<string>\(\'\'\);\n\s*', '', content)
    content = re.sub(r'setBibliografia\(\'\'\);\n\s*', '', content)
    
    # The textarea
    pattern_div = re.compile(r'\{\/\* Bibliografia \*\/\}[\s\S]*?</div>', re.DOTALL)
    content = pattern_div.sub('', content)

    # In case there's something else
    content = content.replace("bibliografiaBasica: bibliografia.trim(),", "")
    content = content.replace("bibliografiaComplementar: bibliografia.trim(),", "")

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

fix_detail()
fix_edit()
fix_new()

