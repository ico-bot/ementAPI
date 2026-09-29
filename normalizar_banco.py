import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ementaAPI.settings')
django.setup()

from django.db import connection

def normalizar_banco():
    cursor = connection.cursor()

    print("Normalizando tabela docente (lotacao, cargo, jornada, titulacao)...")
    cursor.execute("ALTER TABLE docente MODIFY COLUMN centro_lotacao VARCHAR(255) NULL;")
    cursor.execute("ALTER TABLE docente MODIFY COLUMN cargo_docente VARCHAR(100) NULL;")
    cursor.execute("ALTER TABLE docente MODIFY COLUMN jornada_docente VARCHAR(100) NULL;")
    cursor.execute("ALTER TABLE docente MODIFY COLUMN titulacao_docente VARCHAR(100) NULL;")

    print("Normalizando tabela docente_disciplina (ano e semestre nulos)...")
    cursor.execute("ALTER TABLE docente_disciplina MODIFY COLUMN ano INT NULL;")
    cursor.execute("ALTER TABLE docente_disciplina MODIFY COLUMN semestre INT NULL;")

    print("Normalizando tabelas curso, curriculo e curriculo_disciplina...")
    cursor.execute("ALTER TABLE curso MODIFY COLUMN nivel_curso VARCHAR(50) NULL;")
    cursor.execute("ALTER TABLE curso MODIFY COLUMN turno_curso VARCHAR(50) NULL;")
    cursor.execute("ALTER TABLE curso MODIFY COLUMN modalidade_curso VARCHAR(100) NULL;")
    cursor.execute("ALTER TABLE curso MODIFY COLUMN funcionamento_curso VARCHAR(50) NULL;")
    cursor.execute("ALTER TABLE curriculo MODIFY COLUMN regime_letivo VARCHAR(50) NULL;")
    cursor.execute("ALTER TABLE curriculo_disciplina MODIFY COLUMN tipo_disciplina VARCHAR(100) NULL;")

    print("Criando tabela docente_cursos_vinculados...")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS docente_cursos_vinculados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        docente_id INT NOT NULL,
        curso_id INT NOT NULL,
        UNIQUE KEY unique_docente_curso (docente_id, curso_id),
        FOREIGN KEY (docente_id) REFERENCES docente(id_docente) ON DELETE CASCADE,
        FOREIGN KEY (curso_id) REFERENCES curso(id_curso) ON DELETE CASCADE
    );
    """)

    print("Criando tabela disciplina_cursos_vinculados...")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS disciplina_cursos_vinculados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        disciplina_id INT NOT NULL,
        curso_id INT NOT NULL,
        UNIQUE KEY unique_disciplina_curso (disciplina_id, curso_id),
        FOREIGN KEY (disciplina_id) REFERENCES disciplina(id_disciplina) ON DELETE CASCADE,
        FOREIGN KEY (curso_id) REFERENCES curso(id_curso) ON DELETE CASCADE
    );
    """)

    print("Criando tabela curso_edicao_usuario...")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS curso_edicao_usuario (
        curso_id INT NOT NULL PRIMARY KEY,
        nome_curso VARCHAR(255) NULL,
        nivel_curso VARCHAR(20) NULL,
        turno_curso VARCHAR(20) NULL,
        modalidade_curso VARCHAR(45) NULL,
        area_conhecimento_curso VARCHAR(100) NULL,
        funcionamento_curso VARCHAR(20) NULL,
        grau_academico VARCHAR(100) NULL,
        ato_autorizacao_curso TEXT NULL,
        ato_reconhecimento_curso TEXT NULL,
        conceito_mec_curso VARCHAR(50) NULL,
        modificado_por_id INT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (curso_id) REFERENCES curso(id_curso) ON DELETE CASCADE,
        FOREIGN KEY (modificado_por_id) REFERENCES usuario(id_usuario) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)

    print("Banco de dados 100% normalizado com sucesso!")

if __name__ == '__main__':
    normalizar_banco()
