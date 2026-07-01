/**
 * @file disciplinasMock.ts
 * @description Base de dados mockada realista para matrizes curriculares e disciplinas (com características reais do ementário da UFAC).
 */

import type { Curriculo, Disciplina } from './types';

export const CURRICULOS_MOCK: Curriculo[] = [
  {
    id: 'curr-1',
    cursoId: '1',
    cursoNome: 'Bacharelado em Sistemas de Informação',
    versao: 'PPC 2023 - UFAC',
    anoInicio: 2023,
    semestreInicio: 1,
    regimeLetivo: 'Semestral',
    numPeriodosIdeal: 8,
    totalCreditos: 180,
    cargaHorariaTotal: 3200,
    status: 'Corrente',
    corpoDocente: [
      { id: 'doc-10', nome: 'Dr. Alan Turing', titulacao: 'Doutorado' },
      { id: 'doc-11', nome: 'Me. Grace Hopper', titulacao: 'Mestrado' },
      { id: 'doc-12', nome: 'Dr. Daricélio Soares', titulacao: 'Doutorado' },
      { id: 'doc-13', nome: 'Esp. Linus Torvalds', titulacao: 'Especialização' },
      { id: 'doc-14', nome: 'Dr. George Boole', titulacao: 'Doutorado' },
      { id: 'doc-15', nome: 'Dra. Clarice Lispector', titulacao: 'Doutorado' },
      { id: 'doc-16', nome: 'Me. Machado de Assis', titulacao: 'Mestrado' },
      { id: 'doc-17', nome: 'Dr. Edsger Dijkstra', titulacao: 'Doutorado' },
    ],
  },
  {
    id: 'curr-2',
    cursoId: '2',
    cursoNome: 'Engenharia de Software',
    versao: 'PPC 2024 - UFAC',
    anoInicio: 2024,
    semestreInicio: 1,
    regimeLetivo: 'Semestral',
    numPeriodosIdeal: 8,
    totalCreditos: 200,
    cargaHorariaTotal: 3600,
    status: 'Corrente',
    corpoDocente: [
      { id: 'doc-40', nome: 'Dra. Margaret Hamilton', titulacao: 'Doutorado' },
      { id: 'doc-10', nome: 'Dr. Alan Turing', titulacao: 'Doutorado' },
      { id: 'doc-50', nome: 'Dr. Tim Berners-Lee', titulacao: 'Doutorado' },
    ],
  },
];

export const DISCIPLINAS_MOCK: Record<string, Disciplina[]> = {
  // Matriz BSI (curr-1 / cursoId: '1')
  '1': [
    // --- 1º PERÍODO ---
    {
      id: 'disc-101',
      codigo: 'CCET011',
      nome: 'Introdução à Programação',
      tipo: 'Obrigatória',
      periodoIdeal: 1,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [
        { id: 'doc-10', nome: 'Dr. Alan Turing', titulacao: 'Doutorado' },
        { id: 'doc-11', nome: 'Me. Grace Hopper', titulacao: 'Mestrado' },
      ],
      objetivos: 'Capacitar o discente no desenvolvimento de algoritmos estruturados.',
      ementa: 'Conceitos de algoritmos. Variáveis e tipos de dados. Estruturas condicionais e de repetição. Modularização e vetores.',
    },
    {
      id: 'disc-102',
      codigo: 'CCET012',
      nome: 'Fundamentos de Sistemas de Informação',
      tipo: 'Obrigatória',
      periodoIdeal: 1,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [
        { id: 'doc-12', nome: 'Dr. Daricélio Soares', titulacao: 'Doutorado' },
        { id: 'doc-13', nome: 'Esp. Linus Torvalds', titulacao: 'Especialização' }
      ],
      editadoManualmente: true,
    },
    {
      id: 'disc-103',
      codigo: 'CCET013',
      nome: 'Matemática Discreta',
      tipo: 'Obrigatória',
      periodoIdeal: 1,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [
        { id: 'doc-14', nome: 'Dr. George Boole', titulacao: 'Doutorado' }
      ],
      ementa: 'Lógica proposicional. Teoria dos conjuntos. Relações e funções. Indução matemática e combinatória.',
    },
    {
      id: 'disc-104',
      codigo: 'CHL014',
      nome: 'Leitura e Produção de Textos',
      tipo: 'Obrigatória',
      periodoIdeal: 1,
      unidade: 'Centro de Filosofia e Ciências Humanas - CFCH',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [
        { id: 'doc-15', nome: 'Dra. Clarice Lispector', titulacao: 'Doutorado' },
        { id: 'doc-16', nome: 'Me. Machado de Assis', titulacao: 'Mestrado' }
      ],
    },

    // --- 2º PERÍODO ---
    {
      id: 'disc-201',
      codigo: 'CCET021',
      nome: 'Estrutura de Dados I',
      tipo: 'Obrigatória',
      periodoIdeal: 2,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [
        { id: 'doc-10', nome: 'Dr. Alan Turing', titulacao: 'Doutorado' },
        { id: 'doc-17', nome: 'Dr. Edsger Dijkstra', titulacao: 'Doutorado' }
      ],
      ementa: 'Listas lineares sequenciais e encadeadas. Pilhas e Filas. Recursividade. Algoritmos de ordenação e busca.',
    },
    {
      id: 'disc-202',
      codigo: 'CCET022',
      nome: 'Arquitetura e Organização de Computadores',
      tipo: 'Obrigatória',
      periodoIdeal: 2,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      // sem docentes, objetivos, ementa
    },
    {
      id: 'disc-203',
      codigo: 'CCET023',
      nome: 'Cálculo Diferencial e Integral I',
      tipo: 'Obrigatória',
      periodoIdeal: 2,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 6,
      cargaHoraria: 90,
      docentes: [{ id: 'doc-20', nome: 'Dr. Isaac Newton' }],
      ementa: 'Limites e continuidade. Derivadas e suas aplicações. Integral indefinida e definida.',
    },

    // --- 3º PERÍODO ---
    {
      id: 'disc-301',
      codigo: 'CCET031',
      nome: 'Banco de Dados I',
      tipo: 'Obrigatória',
      periodoIdeal: 3,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [{ id: 'doc-30', nome: 'Dr. Edgar Frank Codd' }],
      ementa: 'Modelo Entidade-Relacionamento. Modelo Relacional. Álgebra Relacional. Linguagem SQL.',
    },
    {
      id: 'disc-302',
      codigo: 'CCET032',
      nome: 'Programação Orientada a Objetos',
      tipo: 'Obrigatória',
      periodoIdeal: 3,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [{ id: 'doc-31', nome: 'Dra. Ada Lovelace' }],
      ementa: 'Conceitos de classes e objetos. Encapsulamento, herança e poliformismo. Tratamento de exceções.',
    },

    // --- 4º PERÍODO ---
    {
      id: 'disc-401',
      codigo: 'CCET041',
      nome: 'Engenharia de Software I',
      tipo: 'Obrigatória',
      periodoIdeal: 4,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [{ id: 'doc-40', nome: 'Dra. Margaret Hamilton' }],
      ementa: 'Processos de desenvolvimento de software. Engenharia de requisitos. Modelagem com UML. Metodologias Ágeis.',
    },

    // --- OPTATIVAS ---
    {
      id: 'disc-opt-1',
      codigo: 'CCET901',
      nome: 'Tópicos Especiais em Inteligência Artificial',
      tipo: 'Optativa',
      periodoIdeal: 6,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      ementa: 'Redes neurais profundas. Processamento de linguagem natural. Ética em IA.',
    },
    {
      id: 'disc-opt-2',
      codigo: 'CCET902',
      nome: 'Desenvolvimento Web Mobile',
      tipo: 'Optativa',
      periodoIdeal: 5,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [{ id: 'doc-50', nome: 'Dr. Tim Berners-Lee' }],
    },
  ],

  // Matriz Engenharia de Software (cursoId: '2')
  '2': [
    {
      id: 'disc-esoft-1',
      codigo: 'ESOFT101',
      nome: 'Fundamentos de Engenharia de Software',
      tipo: 'Obrigatória',
      periodoIdeal: 1,
      unidade: 'Centro de Ciências Exatas e Tecnológicas - CCET',
      notaMinimaAprovacao: 5.0,
      creditos: 4,
      cargaHoraria: 60,
      docentes: [{ id: 'doc-40', nome: 'Dra. Margaret Hamilton' }],
      ementa: 'Visão geral da engenharia de software e princípios de qualidade e arquitetura.',
    },
  ],
};
