# -*- coding: utf-8 -*-
import os

def restore_div(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace('{/* Rodapé */}', '        </div>\n\n        {/* Rodapé */}')
    content = content.replace('{/* Rodap\u00e9 */}', '        </div>\n\n        {/* Rodapé */}')
    content = content.replace('{/* Rodap\u00e9 do Modal */}', '        </div>\n\n        {/* Rodapé do Modal */}')

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

restore_div('src/modules/disciplinas/components/modals/DisciplinaDetailModal.tsx')
restore_div('src/modules/disciplinas/components/modals/EditDisciplinaModal.tsx')
restore_div('src/modules/disciplinas/components/modals/NewDisciplinaModal.tsx')

