# -*- coding: utf-8 -*-
import os

def fix_disc_detail():
    f = 'src/modules/disciplinas/components/modals/DisciplinaDetailModal.tsx'
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Remove bibliografia tab button
    btn_str = '''          <button
            type="button"
            onClick={() => setActiveTab('bibliografia')}
            className={py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer }
          >
            Bibliografias & Referências
          </button>'''
    content = content.replace(btn_str, '')
    
    # 2. Extract out ABA 3
    aba3_start = content.find('{/* ABA 3: BIBLIOGRAFIAS */}')
    aba3_end = content.find('{/* Rodapé */}')
    # Keep the closing tag of the scrollable body!
    # Let's just find the last </div> before Rodape
    aba3_content = content[aba3_start:aba3_end]
    # Actually, we know ABA 3 ends with           )} then         </div>
    # Let's replace the whole ABA3 block manually.
    content = content[:aba3_start] + '\n        </div>\n\n        ' + content[aba3_end:]

    # 3. Replace fallbacks
    content = content.replace('Ementa curricular não detalhada no cadastro atual.', 'Informação não cadastrada.')
    content = content.replace('Objetivos não especificados no documento institucional.', 'Informação não cadastrada.')
    content = content.replace('Programa detalhado não informado no ementário da universidade.', 'Informação não cadastrada.')
    content = content.replace('Metodologia de ensino não informada na ficha da disciplina.', 'Informação não cadastrada.')
    content = content.replace('Critérios de avaliação não informados na ficha da disciplina.', 'Informação não cadastrada.')

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

fix_disc_detail()

def fix_edit_modal(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace("type EditTabType = 'geral' | 'pedagogico' | 'bibliografia';", "type EditTabType = 'geral' | 'pedagogico';")
    content = content.replace("type DetailTabType = 'geral' | 'pedagogico' | 'bibliografia';", "type DetailTabType = 'geral' | 'pedagogico';")
    
    btn_str = '''          <button
            type="button"
            onClick={() => setActiveTab('bibliografia')}
            className={py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer }
          >
            Bibliografias
          </button>'''
    content = content.replace(btn_str, '')

    aba3_start = content.find('{/* ABA 3: BIBLIOGRAFIAS */}')
    if aba3_start != -1:
        aba3_end = content.find('{/* Rodapé', aba3_start)
        # We replace the whole aba3 and carefully restore </div>\n\n         before Rodapé
        content = content[:aba3_start] + '\n          </div>\n\n          ' + content[aba3_end:]
    
    content = content.replace('bibliografiaBasica: disciplina.bibliografiaBasica,', '')
    content = content.replace('bibliografiaComplementar: disciplina.bibliografiaComplementar,', '')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

fix_edit_modal('src/modules/disciplinas/components/modals/EditDisciplinaModal.tsx')
fix_edit_modal('src/modules/disciplinas/components/modals/NewDisciplinaModal.tsx')

