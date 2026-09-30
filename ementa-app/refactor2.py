# -*- coding: utf-8 -*-
import os
import re

f = 'src/modules/disciplinas/components/modals/DisciplinaDetailModal.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

# Remover botao da tab
content = re.sub(r'<button\s+type="button"\s+onClick=\{\(\) => setActiveTab\(\'bibliografia\'\)\}.*?Bibliografias & Referências\s+</button>', '', content, flags=re.DOTALL)

# Remover conteudo da tab bibliografia
content = re.sub(r'\{\/\* ABA 3: BIBLIOGRAFIAS \*\/\}.*?\{\/\* Rodapé \*\/\}', '{/* Rodapé */}', content, flags=re.DOTALL)

# Replace fallbacks
content = content.replace('Ementa curricular não detalhada no cadastro atual.', 'Informação não cadastrada.')
content = content.replace('Objetivos não especificados no documento institucional.', 'Informação não cadastrada.')
content = content.replace('Programa detalhado não informado no ementário da universidade.', 'Informação não cadastrada.')
content = content.replace('Metodologia de ensino não informada na ficha da disciplina.', 'Informação não cadastrada.')
content = content.replace('Critérios de avaliação não informados na ficha da disciplina.', 'Informação não cadastrada.')

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
