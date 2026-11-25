/**
 * Generates a stable unique identifier for exam entities.
 * Uses crypto.randomUUID when available, with a timestamp-random fallback.
 */
export function createId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const EDUCATIONAL_LEVELS = [
  { value: '1AS', label: 'الأولى ثانوي (1AS)' },
  { value: '2AS', label: 'الثانية ثانوي (2AS)' },
  { value: '3AS', label: 'الثالثة ثانوي (3AS)' },
];

export const RELIGIOUS_TEXT_TYPES = [
  { value: 'quran', label: 'آية قرآنية' },
  { value: 'hadith', label: 'حديث شريف' },
];

export function createEmptyQuestion() {
  return {
    id: createId('q'),
    text: '',
    mark: '',
    hasTable: false,
    table: createEmptyTable(),
    subquestions: [],
  };
}

export function createEmptyTable() {
  return {
    rowHeight: '2.2',
    columns: ['الكلمة', 'الحكم', 'السبب'],
    rows: [
      { id: createId('row'), subrows: 1, cells: ['', '', ''] },
    ],
  };
}

export function createEmptyPart() {
  return {
    id: createId('part'),
    title: '',
    instructions: '',
    hasReligiousText: false,
    religiousText: {
      type: 'quran',
      text: '',
      source: '',
      vocab: '',
      note: '',
    },
    hasTable: false,
    table: createEmptyTable(),
    questions: [createEmptyQuestion()],
  };
}

export function createEmptyExercise() {
  return {
    id: createId('ex'),
    title: '',
    instructions: '',
    parts: [createEmptyPart()],
  };
}

export function createEmptyExam() {
  return {
    info: {
      directorate: '',
      schoolName: '',
      academicYear: '',
      date: '',
      level: '2AS',
      subject: '',
      examType: '',
      duration: '',
      title: '',
    },
    exercises: [createEmptyExercise()],
  };
}

export const initialExam = {
  info: {
    directorate: 'الجزائر غرب',
    schoolName: '',
    academicYear: '2025 / 2026',
    date: '23/12/04',
    level: '2AS',
    subject: 'العلوم الإسلامية',
    examType: 'اختبار الفصل الأول',
    duration: '01 سا',
    title: '',
  },
  exercises: [
    {
      id: 'ex_initial_1',
      title: '',
      instructions: '',
      parts: [
        {
          id: 'part_initial_1',
          title: '',
          instructions: '',
          hasReligiousText: true,
          religiousText: {
            type: 'hadith',
            text: 'عن عياض بن حمار المجاشعي رضي الله عنه أن رسول الله صلى الله عليه وسلم قال ذات يوم في خطبته: «أَلَا إِنَّ رَبِّي أَمَرَنِي أَنْ أُعَلِّمَكُمْ مَا جَهِلْتُمْ، مِمَّا عَلَّمَنِي يَوْمِي هَذَا، كُلُّ مَالٍ نَحَلْتُهُ عَبْدًا حَلَالٌ، وَإِنِّي خَلَقْتُ عِبَادِي حُنَفَاءَ كُلَّهُمْ، وَإِنَّهُمْ أَتَتْهُمُ الشَّيَاطِينُ فَاجْتَالَتْهُمْ عَنْ دِينِهِمْ، وَحَرَّمَتْ عَلَيْهِمْ مَا أَحْلَلْتُ لَهُمْ، وَأَمَرَتْهُمْ أَنْ يُشْرِكُوا بِي مَا لَمْ أُنَزِّلْ بِهِ سُلْطَانًا، وَإِنَّ اللَّهَ نَظَرَ إِلَى أَهْلِ الْأَرْضِ فَمَقَتَهُمْ عَرَبَهُمْ وَعَجَمَهُمْ إِلَّا بَقَايَا مِنْ أَهْلِ الْكِتِابِ»',
            source: 'رواه مسلم',
            vocab: 'نحلته: أعطيته، اجتالتهم: حولتهم، مقتهم: أبغضهم.',
            note: '',
          },
          hasTable: false,
          table: createEmptyTable(),
          questions: [
            {
              id: 'q_initial_1',
              text: 'في الحديث إشارة إلى أصل يُخلق عليه الإنسان، استخرجه ثُمَّ عرفه.',
              mark: '',
              subquestions: [],
            },
            {
              id: 'q_initial_2',
              text: 'في الحديث ذكر لسبب من أسباب فساد ذلك الأصل:',
              mark: '',
              subquestions: [
                {
                  id: 'sq_initial_1',
                  text: 'استخرجه.',
                  mark: '',
                },
                {
                  id: 'sq_initial_2',
                  text: 'أذكر بقية الأسباب الأخرى.',
                  mark: '',
                },
              ],
            },
            {
              id: 'q_initial_3',
              text: 'ذكر الحديث السابق عاملاً من عوامل إصلاح ذلك الأصل الذي يُخلق عليه الإنسان، استخرجه مع بيان الشاهد من الحديث.',
              mark: '',
              subquestions: [],
            },
            {
              id: 'q_initial_4',
              text: 'إلى أي قسم من أقسام السُّنَّة ينتمي هذا الحديث؟ عرفه.',
              mark: '',
              subquestions: [],
            },
            {
              id: 'q_initial_5',
              text: 'للسنة علاقة وطيدة بالقرآن الكريم، بين من خلال الحديث السابق طبيعة تلك العلاقة.',
              mark: '',
              subquestions: [],
            },
            {
              id: 'q_initial_6',
              text: 'روى هذا الحديث الإمام مسلم في كتابه، عَرِّف هذا الراوي من خلال: الاسم الكامل، عدد أحاديث الكتاب، أهم ما تميز به الكتاب.',
              mark: '',
              subquestions: [],
            },
            {
              id: 'q_initial_7',
              text: 'استخرج من الحديث السابق حكمين وفائدة.',
              mark: '',
              subquestions: [],
            },
          ],
        },
      ],
    },
    {
      id: 'ex_initial_2',
      title: '',
      instructions: '',
      parts: [
        {
          id: 'part_initial_2',
          title: '',
          instructions: '',
          hasReligiousText: false,
          religiousText: {
            type: 'quran',
            text: '',
            source: '',
            vocab: '',
            note: '',
          },
          hasTable: false,
          table: createEmptyTable(),
          questions: [
            {
              id: 'q_initial_8',
              text: 'أكمل الجدول التالي:',
              mark: '',
              hasTable: true,
              table: {
                rowHeight: '2.2',
                columns: ['الكلمة', 'اسم حكم الترتيل', 'السبب'],
                rows: [
                  { id: 'row_init_1', subrows: 2, cells: ['فيه هدى للمتقين', '', ''] },
                  { id: 'row_init_2', subrows: 1, cells: ['من ورائي', '', ''] },
                  { id: 'row_init_3', subrows: 1, cells: ['ءال يعقوب', '', ''] },
                ],
              },
              subquestions: [],
            },
          ],
        },
      ],
    },
  ],
};
