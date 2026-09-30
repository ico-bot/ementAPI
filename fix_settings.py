# -*- coding: utf-8 -*-
import os

f = 'ementaAPI/settings.py'
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

target = '''    # 4. Throttling
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',   # Usuários sem identificação: 100 acessos por dia
        'user': '1000/hour', # Usuários logados/Admin: 1000 acessos por hora
    }'''

replacement = '''    # 4. Throttling
    'DEFAULT_THROTTLE_CLASSES': [
        'base_ementario.throttling.APIKeyRateThrottle',
        'base_ementario.throttling.CustomAnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'api_key': '5000/hour', # Como exigido por contrato ou documentado (NRF4)
        'anon': '100/day',   # Usuários sem identificação: 100 acessos por dia
        'user': '1000/hour', # Usuários logados/Admin: 1000 acessos por hora
    }'''

if "APIKeyRateThrottle" not in content:
    content = content.replace(target, replacement)

with open(f, 'w', encoding='utf-8') as file:
    file.write(content)
