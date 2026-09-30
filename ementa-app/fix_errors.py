# -*- coding: utf-8 -*-
import os

f1 = 'src/modules/cursos/pages/CursosListPage.tsx'
with open(f1, 'r', encoding='utf-8') as file:
    content1 = file.read()

# Let's see if exactCode is defined.
# I used: content = content.replace('const [searchTerm, setSearchTerm] = useState(\\'\\');', ...)
# Maybe it was 'const [searchTerm, setSearchTerm] = useState<string>('');' ?
if 'const [exactCode, setExactCode] = useState' not in content1:
    content1 = content1.replace("const [searchTerm, setSearchTerm] = useState<string>('');", "const [searchTerm, setSearchTerm] = useState<string>('');\n  const [exactCode, setExactCode] = useState<string>('');")
    content1 = content1.replace("const [searchTerm, setSearchTerm] = useState('');", "const [searchTerm, setSearchTerm] = useState('');\n  const [exactCode, setExactCode] = useState('');")

with open(f1, 'w', encoding='utf-8') as file:
    file.write(content1)

f2 = 'src/modules/disciplinas/components/modals/NewDisciplinaModal.tsx'
with open(f2, 'r', encoding='utf-8') as file:
    content2 = file.read()

# Remove remaining bibliografia in NewDisciplinaModal
content2 = content2.replace('bibliografiaBasica: \'\',', '')
content2 = content2.replace('bibliografiaComplementar: \'\',', '')
content2 = content2.replace('bibliografiaBasica: formData.bibliografiaBasica,', '')
content2 = content2.replace('bibliografiaComplementar: formData.bibliografiaComplementar,', '')

with open(f2, 'w', encoding='utf-8') as file:
    file.write(content2)

