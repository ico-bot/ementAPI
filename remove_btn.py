# -*- coding: utf-8 -*-
import os
import re

f = 'ementa-app/src/modules/admin/pages/AdminDashboardPage.tsx'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

# Removing the "Atualizar Dados" button.
# It looks something like:
# <button type="button" onClick={() => window.location.reload()} className="..."> ... Atualizar Dados ... </button>
pattern = re.compile(r'<button\s+type="button"\s+onClick=\{\(\) => window\.location\.reload\(\)\}[\s\S]*?</button>', re.DOTALL)
content = pattern.sub('', content)

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)

