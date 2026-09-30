# -*- coding: utf-8 -*-
import os
import re

def process_file(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    # Remover tab definition
    content = content.replace("type DetailTabType = 'geral' | 'pedagogico' | 'bibliografia';", "type DetailTabType = 'geral' | 'pedagogico';")
    content = content.replace("type EditTabType = 'geral' | 'pedagogico' | 'bibliografia';", "type EditTabType = 'geral' | 'pedagogico';")

    # Remover botao da tab
    content = re.sub(r'<button\s+type="button"\s+onClick=\{\(\) => setActiveTab\(\'bibliografia\'\)\}.*?Bibliografias & Referências\s+</button>', '', content, flags=re.DOTALL)
    content = re.sub(r'<button\s+type="button"\s+onClick=\{\(\) => setActiveTab\(\'bibliografia\'\)\}.*?Bibliografias\s+</button>', '', content, flags=re.DOTALL)

    # Remover conteudo da tab bibliografia
    content = re.sub(r'\{\/\* ABA 3: BIBLIOGRAFIAS \*\/\}.*?\{\/\* Rodap[eé][^\}]*\*\/\}', '{/* Rodapé */}', content, flags=re.DOTALL)
    
    # Check if there is still any 'bibliografiaBasica' in the text
    content = re.sub(r'\s*bibliografiaBasica:.*?,\n?', '\n', content)
    content = re.sub(r'\s*bibliografiaComplementar:.*?,\n?', '\n', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

process_file('src/modules/disciplinas/components/modals/EditDisciplinaModal.tsx')
process_file('src/modules/disciplinas/components/modals/NewDisciplinaModal.tsx')
