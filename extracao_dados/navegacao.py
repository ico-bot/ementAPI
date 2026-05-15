
#Permite a interação com a página:
from selenium import webdriver

import sys

#Permite o modo Headless e configurações de otimização
from selenium.webdriver.chrome.options import Options

from selenium.webdriver.common.by import By

#Utilizados para esperar certo elemento carregar antes de seguir
from selenium.webdriver.support.ui import WebDriverWait

#Conjunto de condições prontas
from selenium.webdriver.support import expected_conditions as EC

class AdministracaoNavegador:
    def __init__(self, headless=False):
        opts = Options()
        if headless:
            opts.add_argument("--headless=new")
        opts.add_argument("--no-sandbox") #---------------|
        opts.add_argument("--disable-gpu")#----------------->Todos utilizados para melhorar a compatibilidade em Linux, servidores e dockers
        opts.add_argument("--disable-dev-shm-usage")#=----|
        opts.add_argument("--window-size=1920,1080")
        opts.add_argument('--ignore-certificate-errors')
        prefs = {
        # 1 = permitir, 2 = bloquear
        "profile.default_content_setting_values.notifications": 2, 
        # Tenta bloquear pop-ups em geral (embora banners de cookies não sejam tecnicamente pop-ups)
        "profile.default_content_setting_values.popups": 2,

         "profile.managed_default_content_settings.images": 2,   # desliga imagens
        }
        opts.add_experimental_option("prefs", prefs)

        # user-agent ajuda em alguns sites com proteção
        opts.add_argument("--user-agent=Mozilla/5.0") #Evita bloqueadores anti-bot

        # reduzir sinais de automação (alguns sites barram)
        opts.add_experimental_option("excludeSwitches", ["enable-automation"])
        opts.add_experimental_option('useAutomationExtension', False)

        try:
            self.navegador = webdriver.Chrome(options=opts)
            self.wait=WebDriverWait(self.navegador, 15)
        except Exception as e:
            raise RuntimeError(f"Falha ao iniciar o Chrome: {e}")

    def inicializar_site(self, url: str):
        try:
            self.navegador.get(url)
            self.wait.until(EC.presence_of_element_located((By.ID, "corpo")))
            return self.navegador
        except Exception as e:
            raise RuntimeError(f"Falha ao abrir/carregar o site: {e}")
            
    
    def encerrar_site(self):
        if self.navegador:
            try:
                self.navegador.close()
            except Exception as e:
                print(f"erro ao fechar o navegador: {e}")
            finally:
                self.navegador = None