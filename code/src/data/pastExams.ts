export interface PastExam {
  date: string;
  dateSort: string;
  community: string;
  questions: number;
  duration: string;
  icon: string;
}

export const pastExams: PastExam[] = [
  {
    date: 'Julio 2024',
    dateSort: '2024-07',
    community: 'Andalucía',
    questions: 45,
    duration: '60 min',
    icon: '🌊'
  },
  {
    date: 'Julio 2024',
    dateSort: '2024-07',
    community: 'Cataluña',
    questions: 45,
    duration: '60 min',
    icon: '⛵'
  },
  {
    date: 'Julio 2024',
    dateSort: '2024-07',
    community: 'Comunidad Valenciana',
    questions: 45,
    duration: '60 min',
    icon: '🏖️'
  },
  {
    date: 'Mayo 2024',
    dateSort: '2024-05',
    community: 'Baleares',
    questions: 45,
    duration: '60 min',
    icon: '🏝️'
  },
  {
    date: 'Mayo 2024',
    dateSort: '2024-05',
    community: 'Canarias',
    questions: 45,
    duration: '60 min',
    icon: '🌴'
  },
  {
    date: 'Mayo 2024',
    dateSort: '2024-05',
    community: 'Galicia',
    questions: 45,
    duration: '60 min',
    icon: '🦪'
  },
  {
    date: 'Marzo 2024',
    dateSort: '2024-03',
    community: 'Madrid',
    questions: 45,
    duration: '60 min',
    icon: '🏛️'
  },
  {
    date: 'Marzo 2024',
    dateSort: '2024-03',
    community: 'País Vasco',
    questions: 45,
    duration: '60 min',
    icon: '⚓'
  },
  {
    date: 'Febrero 2024',
    dateSort: '2024-02',
    community: 'Murcia',
    questions: 45,
    duration: '60 min',
    icon: '🌊'
  },
  {
    date: 'Diciembre 2023',
    dateSort: '2023-12',
    community: 'Andalucía',
    questions: 45,
    duration: '60 min',
    icon: '🌊'
  },
  {
    date: 'Diciembre 2023',
    dateSort: '2023-12',
    community: 'Cataluña',
    questions: 45,
    duration: '60 min',
    icon: '⛵'
  },
  {
    date: 'Octubre 2023',
    dateSort: '2023-10',
    community: 'Asturias',
    questions: 45,
    duration: '60 min',
    icon: '🐚'
  }
];

// Helper functions for sorting and filtering
export const communities = [...new Set(pastExams.map(exam => exam.community))].sort();
export const dates = [...new Set(pastExams.map(exam => exam.date))].sort();

