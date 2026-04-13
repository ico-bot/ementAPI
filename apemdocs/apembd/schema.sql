CREATE DATABASE IF NOT EXISTS apem;
USE apem;


-- ============================================================
-- TABELA: usuario
-- ============================================================
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(255) NOT NULL,
    cpf_usuario VARCHAR(14) UNIQUE,
    email_usuario VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABELA: docente
-- ============================================================
CREATE TABLE IF NOT EXISTS docente (
    id_docente INT AUTO_INCREMENT PRIMARY KEY,
    nome_docente VARCHAR(255) NOT NULL,
    titulacao_docente ENUM('Graduação', 'Especialização', 'Mestrado', 'Doutorado', 'Pós-Doutorado'),
    centro_lotacao VARCHAR(45),
    cargo_docente ENUM('Professor Adjunto', 'Professor Assistente', 'Professor Titular', 'Professor Substituto'),
    jornada_docente INT COMMENT 'Horas semanais',
    tempo_casa_docente INT COMMENT 'Anos na instituição',
    email_docente VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome (nome_docente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABELA: unidade
-- ============================================================
CREATE TABLE IF NOT EXISTS unidade (
    id_unidade INT AUTO_INCREMENT PRIMARY KEY,
    nome_unidade VARCHAR(255) NOT NULL UNIQUE,
    sigla VARCHAR(20),
    campus VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sigla (sigla)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Centros e unidades acadêmicas';



-- ============================================================
-- TABELA: curso
-- ============================================================
CREATE TABLE IF NOT EXISTS curso (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    codigo_curso VARCHAR(20) NOT NULL UNIQUE,
    nome_curso VARCHAR(255) NOT NULL,
    nivel_curso ENUM('Graduação', 'Pós-Graduação') NOT NULL,
    turno_curso ENUM('Integral', 'Matutino', 'Vespertino', 'Noturno', 'Diurno'),
    modalidade_curso VARCHAR(45) COMMENT 'Presencial, EAD, Semipresencial, ABI',
    area_conhecimento_curso VARCHAR(100),
    funcionamento_curso ENUM('Em atividade', 'Inativo', 'Suspenso') DEFAULT 'Em atividade',
    grau_academico VARCHAR(100) COMMENT 'Bacharelado, Licenciatura, Tecnólogo',
    ato_autorizacao_curso TEXT,
    ato_reconhecimento_curso TEXT,
    conceito_mec_curso VARCHAR(50),
    coordenador_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo_curso),
    INDEX idx_nome (nome_curso),
    INDEX idx_nivel (nivel_curso),
    INDEX idx_funcionamento (funcionamento_curso),
    FOREIGN KEY (coordenador_id) REFERENCES docente(id_docente) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cursos oferecidos pela instituição';


-- ============================================================
-- TABELA: curriculo
-- ============================================================
CREATE TABLE IF NOT EXISTS curriculo (
    id_curriculo INT AUTO_INCREMENT PRIMARY KEY,
    curso_id INT NOT NULL,
    versao VARCHAR(50) NOT NULL COMMENT 'Ex: Versão 01, Versão 1',
    ano_inicio INT NOT NULL,
    semestre_inicio INT NOT NULL COMMENT '1 ou 2',
    regime_letivo ENUM('Semestral', 'Anual') DEFAULT 'Semestral',
    num_periodos_ideal INT,
    total_creditos INT,
    carga_horaria_total INT,
    carga_horaria_min_periodo INT DEFAULT 30,
    carga_horaria_max_periodo INT DEFAULT 600,
    num_trancamentos_totais INT DEFAULT 3,
    num_trancamentos_parciais INT DEFAULT 20,
    status ENUM('Corrente', 'Ativa Anterior', 'Inativo') DEFAULT 'Ativa Anterior',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_curriculo (curso_id, versao, ano_inicio, semestre_inicio),
    INDEX idx_curso_status (curso_id, status),
    INDEX idx_status (status),
    FOREIGN KEY (curso_id) REFERENCES curso(id_curso) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Versões de currículos dos cursos';


-- ============================================================
-- TABELA: disciplina
-- ============================================================
CREATE TABLE IF NOT EXISTS disciplina (
    id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    codigo_disciplina VARCHAR(30) NOT NULL UNIQUE,
    nome_disciplina VARCHAR(255) NOT NULL,
    unidade_id INT,
    carga_horaria INT,
    creditos INT,
    nota_minima_aprovacao DECIMAL(3,1) DEFAULT 5.0,
    ementa TEXT,
    programa TEXT,
    objetivos TEXT,
    metodologia TEXT,
    avaliacao TEXT,
    bibliografia_basica TEXT,
    bibliografia_complementar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo_disciplina),
    INDEX idx_nome (nome_disciplina),
    INDEX idx_unidade (unidade_id),
    FOREIGN KEY (unidade_id) REFERENCES unidade(id_unidade) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Disciplinas oferecidas pela instituição';


-- ============================================================
-- TABELA: curriculo_disciplina
-- ============================================================
CREATE TABLE IF NOT EXISTS curriculo_disciplina (
    id_curriculo_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    curriculo_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    periodo INT NOT NULL COMMENT 'Período em que a disciplina é oferecida',
    tipo_disciplina ENUM('Obrigatória', 'Optativa', 'Eletiva') DEFAULT 'Obrigatória',
    ordem_exibicao INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_disciplina_curriculo (curriculo_id, disciplina_id),
    INDEX idx_curriculo (curriculo_id),
    INDEX idx_disciplina (disciplina_id),
    INDEX idx_periodo (periodo),
    INDEX idx_tipo (tipo_disciplina),
    FOREIGN KEY (curriculo_id) REFERENCES curriculo(id_curriculo) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id_disciplina) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Relacionamento entre currículos e disciplinas';


-- ============================================================
-- TABELA: docente_disciplina
-- ============================================================
CREATE TABLE IF NOT EXISTS docente_disciplina (
    id_docente_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    docente_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    curso_id INT NOT NULL,
    ano INT NOT NULL,
    semestre INT NOT NULL COMMENT '1 ou 2',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_docente (docente_id),
    INDEX idx_disciplina (disciplina_id),
    INDEX idx_curso (curso_id),
    INDEX idx_ano_semestre (ano, semestre),
    FOREIGN KEY (docente_id) REFERENCES docente(id_docente) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplina(id_disciplina) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES curso(id_curso) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Docentes ministrando disciplinas por período';


-- ============================================================
-- TABELA: ppc
-- ============================================================
CREATE TABLE IF NOT EXISTS ppc (
    id_ppc INT AUTO_INCREMENT PRIMARY KEY,
    curriculo_id INT NOT NULL,
    conteudo LONGTEXT,
    arquivo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_ppc_curriculo (curriculo_id),
    FOREIGN KEY (curriculo_id) REFERENCES curriculo(id_curriculo) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Projeto Pedagógico do Curso';


-- ============================================================
-- TABELA: documento_curso
-- ============================================================
CREATE TABLE IF NOT EXISTS documento_curso (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    curso_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    arquivo_url VARCHAR(500),
    tipo_documento ENUM('Regulamento', 'Portaria', 'Resolução', 'Outro') DEFAULT 'Outro',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_curso (curso_id),
    INDEX idx_tipo (tipo_documento),
    FOREIGN KEY (curso_id) REFERENCES curso(id_curso) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Documentos relacionados aos cursos';