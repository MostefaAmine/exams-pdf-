import { escapeLatex, formatMixedLatex, formatMultilineLatex } from './latexEscape';

export const TEMPLATE_STATUS = 'custom-template-active';

const ARABIC_ORDINALS = [
  'الأول',
  'الثاني',
  'الثالث',
  'الرابع',
  'الخامس',
  'السادس',
  'السابع',
  'الثامن',
  'التاسع',
  'العاشر',
];

const ARABIC_PART_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'];

const LEVEL_ARABIC_NAMES = {
  '1AS': 'الأولى ثانوي',
  '2AS': 'الثانية ثانوي',
  '3AS': 'الثالثة ثانوي',
};

export function getArabicOrdinal(index) {
  return ARABIC_ORDINALS[index] || `${index + 1}`;
}

export function getArabicPartLetter(index) {
  return ARABIC_PART_LETTERS[index] || `${index + 1}`;
}

const TEMPLATE_PREAMBLE = String.raw`\documentclass[12pt, a4paper]{article}

% Page margins
\usepackage[a4paper, top=1.5cm, bottom=2cm, left=1.8cm, right=1.8cm]{geometry}

% Fonts and Arabic RTL support (XeLaTeX / LuaLaTeX)
\usepackage{fontspec}
\usepackage[arabic, bidi=basic, provide=*]{babel}
\babelprovide[import, onchar=ids fonts]{english}
\babelfont{rm}{Noto Naskh Arabic}
\babelfont[english]{rm}{Noto Sans}

% Layout, color, and formatting packages
\usepackage{xcolor}
\usepackage{tabularx}
\usepackage{multirow}
\usepackage{enumitem}
\usepackage{fancyhdr}

\definecolor{sanadbg}{HTML}{FAF8F3}

\newcommand{\lat}[1]{\foreignlanguage{english}{#1}}
\setlist[itemize]{label=\lat{-}}

% ============================================================
% CUSTOM REUSABLE EXAM COMMANDS
% ============================================================

\newcommand{\examrule}{%
    \par\vspace{0.15cm}%
    \noindent\vbox{%
        \hrule height 1.2pt width \textwidth
        \kern 2pt
        \hrule height 0.4pt width \textwidth
    }%
    \par\vspace{0.2cm}%
}

\newcommand{\questiontitle}[1]{%
    \par\vspace{0.35cm}%
    \noindent{\setlength{\fboxrule}{0.8pt}\setlength{\fboxsep}{5pt}%
    \fbox{\large\textbf{\hspace{0.15cm}#1\hspace{0.15cm}}}}%
    \hspace{0.25cm}%
    \leavevmode\leaders\hbox{\rule[0.35ex]{1pt}{0.6pt}}\hfill\kern0pt%
    \par\vspace{0.2cm}%
}

\newcommand{\partsep}{%
    \par\vspace{0.2cm}%
    \begin{center}
        \rule[0.3ex]{2.8cm}{0.5pt}%
        \hspace{0.25cm}%
        \rule[0.1ex]{3pt}{3pt}\hspace{0.15cm}%
        \rule[0.0ex]{4.5pt}{4.5pt}\hspace{0.15cm}%
        \rule[0.1ex]{3pt}{3pt}%
        \hspace{0.25cm}%
        \rule[0.3ex]{2.8cm}{0.5pt}%
    \end{center}%
    \par\vspace{0.2cm}%
}

\newcommand{\sanadbox}[2]{%
    \par\vspace{0.2cm}%
    \begingroup
    \setlength{\fboxrule}{1pt}%
    \setlength{\fboxsep}{2pt}%
    \noindent\fbox{%
        \setlength{\fboxrule}{0.4pt}%
        \setlength{\fboxsep}{8pt}%
        \fcolorbox{black}{sanadbg}{%
            \parbox{\dimexpr\textwidth-22.8pt\relax}{%
                {\small\linespread{1.45}\selectfont
                #1}%
                \if\relax\detokenize{#2}\relax\else
                    \par\vspace{4pt}%
                    \hfill\textbf{\lat{--} #2 \lat{--}}%
                \fi
            }%
        }%
    }%
    \endgroup
    \par\vspace{0.2cm}%
}

\newcommand{\vocabbox}[2][شرح الكلمات:]{%
    \par\vspace{0.15cm}%
    {\renewcommand{\arraystretch}{1.45}%
    \noindent\begin{tabularx}{\textwidth}{!{\vrule width 2.2pt} X |}
        \hline
        \textbf{#1} #2 \\
        \hline
    \end{tabularx}}%
    \par\vspace{0.2cm}%
}

\newcolumntype{C}{>{\centering\arraybackslash}X}
\newcommand{\examtable}[3][2.0]{%
    \par\vspace{0.25cm}%
    {\renewcommand{\arraystretch}{#1}%
    \begin{tabularx}{\textwidth}{|*{#2}{C|}}
        \hline
        #3
    \end{tabularx}}%
    \par\vspace{0.35cm}%
}

\makeatletter
\newcommand{\@emptycols}[1]{%
    \ifnum#1>1\relax
        \expandafter\@firstofone
    \else
        \expandafter\@gobble
    \fi
    {& \@emptycols{\numexpr#1-1\relax}}%
}
\newcommand{\@subrows}[2]{%
    \ifnum#2>1\relax
        \expandafter\@firstoftwo
    \else
        \expandafter\@secondoftwo
    \fi
    {\@emptycols{#1} \\ \cline{2-#1} \@subrows{#1}{\numexpr#2-1\relax}}%
    {\@emptycols{#1} \\ \hline}%
}
\newcommand{\splitrow}[3]{%
    \multirow{#2}{*}{#3}\@subrows{#1}{#2}%
}
\makeatother

\newcommand{\mergecell}[2]{\multirow{#1}{*}{#2}}

% Footer configuration
\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0.5pt}
\fancyfoot[C]{\small الصفحة \thepage}

% Paragraph spacing
\setlength{\parindent}{0pt}
\setlength{\parskip}{6pt}
\setlength{\fboxsep}{9pt}`;

function renderSanadBox(religiousText) {
  if (!religiousText || !religiousText.text?.trim()) return '';

  const rawText = religiousText.text.trim();
  const formattedText =
    religiousText.type === 'quran' && !rawText.includes('﴿')
      ? `﴿${escapeLatex(rawText)}﴾`
      : escapeLatex(rawText);

  const source = religiousText.source?.trim()
    ? formatMixedLatex(religiousText.source.trim())
    : '';

  const blocks = [
    `\\sanadbox{%\n    ${formattedText}%\n}{${source}}`,
  ];

  if (religiousText.vocab?.trim()) {
    blocks.push(`\\vocabbox{${formatMixedLatex(religiousText.vocab.trim())}}`);
  }

  if (religiousText.note?.trim()) {
    blocks.push(`\\textit{${formatMixedLatex(religiousText.note.trim())}}`);
  }

  return blocks.join('\n\n');
}

function renderExamTable(table) {
  if (!table || !Array.isArray(table.columns) || table.columns.length === 0) {
    return '';
  }

  const numCols = table.columns.length;
  const rowHeight = table.rowHeight?.trim() || '2.0';
  const headerRow = table.columns
    .map((col) => `\\textbf{${formatMixedLatex(col || '')}}`)
    .join(' & ');

  const bodyRows = (table.rows || []).map((row) => {
    const subrows = Number(row.subrows) || 1;
    const firstCell = formatMixedLatex(row.cells?.[0] || '');
    const restEmpty = (row.cells || []).slice(1).every((c) => !c?.trim());

    if (restEmpty) {
      return `    \\splitrow{${numCols}}{${subrows}}{${firstCell}}`;
    }

    const formattedCells = Array.from({ length: numCols }, (_, i) =>
      formatMixedLatex(row.cells?.[i] || '')
    );
    return `    ${formattedCells.join(' & ')} \\\\ \\hline`;
  });

  return [
    `\\examtable[${rowHeight}]{${numCols}}{%`,
    `    ${headerRow} \\\\ \\hline\\hline`,
    ...bodyRows,
    `}`,
  ].join('\n');
}

function renderQuestionsList(questions) {
  if (!questions || questions.length === 0) return '';

  const items = questions.map((q) => {
    const markText = q.mark?.trim() ? ` \\hfill \\textbf{(${formatMixedLatex(q.mark.trim())})}` : '';
    const qText = formatMultilineLatex(q.text?.trim() || '');
    const lines = [`    \\item ${qText}${markText}`];

    if (q.subquestions && q.subquestions.length > 0) {
      lines.push('    \\begin{itemize}[leftmargin=1.2cm, itemsep=6pt]');
      q.subquestions.forEach((sq, sqIdx) => {
        const letter = getArabicPartLetter(sqIdx);
        const sqMark = sq.mark?.trim() ? ` \\hfill (${formatMixedLatex(sq.mark.trim())})` : '';
        lines.push(
          `        \\item[\\textbf{${letter}\\lat{(}}] ${formatMultilineLatex(sq.text?.trim() || '')}${sqMark}`
        );
      });
      lines.push('    \\end{itemize}');
    }

    if (q.hasTable && q.table) {
      lines.push(renderExamTable(q.table));
    }

    return lines.join('\n');
  });

  return [
    '\\begin{enumerate}[label=\\textbf{\\lat{(\\arabic*)}}, leftmargin=*, itemsep=10pt]',
    items.join('\n\n'),
    '\\end{enumerate}',
  ].join('\n');
}

/**
 * Generates complete XeLaTeX / LuaLaTeX source code from the structured exam state
 * using the custom Algerian Islamic Education exam template.
 *
 * Hierarchy: Exam -> Exercises -> Exercise Parts (with independent sanadbox ON/OFF) -> Questions -> Optional Subquestions
 *
 * @param {object} exam
 * @returns {string}
 */
export function generateLatex(exam) {
  if (!exam) return '';

  const { info = {}, exercises = [] } = exam;

  const directorate = info.directorate?.trim()
    ? formatMixedLatex(info.directorate.trim())
    : 'الجزائر غرب';
  const schoolLine = info.schoolName?.trim()
    ? formatMixedLatex(info.schoolName.trim())
    : '\\dotfill\\hspace{3cm}';
  const subject = formatMixedLatex(info.subject?.trim() || 'العلوم الإسلامية');
  const levelText = LEVEL_ARABIC_NAMES[info.level] || formatMixedLatex(info.level || '');
  const examType = formatMixedLatex(info.examType?.trim() || 'اختبار الفصل الأول');
  const dateOrYear = info.date?.trim()
    ? formatMixedLatex(info.date.trim())
    : formatMixedLatex(info.academicYear?.trim() || '');
  const dateLabel = info.date?.trim() ? 'التاريخ:' : 'السنة الدراسية:';
  const duration = formatMixedLatex(info.duration?.trim() || '01 سا');

  const headerSection = String.raw`\begin{center}
    {\large \textbf{الجمهورية الجزائرية الديمقراطية الشعبية}} \\[4pt]
    {\large \textbf{وزارة التربية الوطنية}} \\[4pt]
    {\normalsize \textbf{مديرية التربية \lat{-} ${directorate} \lat{-}}} \\[4pt]
    {\normalsize \textbf{المؤسسة:} ${schoolLine}}
\end{center}

\examrule

\renewcommand{\arraystretch}{1.4}
\begin{tabularx}{\textwidth}{@{} X >{\centering\arraybackslash}X X @{}}
    \textbf{المادة:} ${subject} &
    \raisebox{-0.35\height}{\begingroup\setlength{\fboxrule}{1pt}\setlength{\fboxsep}{2pt}\fbox{\setlength{\fboxrule}{0.4pt}\setlength{\fboxsep}{6pt}\fbox{\hspace{0.25cm}\textbf{\large ${examType}}\hspace{0.25cm}}}\endgroup} &
    \textbf{${dateLabel}} ${dateOrYear} \\
    \textbf{المستوى:} ${levelText} &
    &
    \textbf{المدة:} ${duration}
\end{tabularx}

\examrule
\vspace{0.2cm}`;

  const titleBanner = info.title?.trim()
    ? `\\begin{center}\n    {\\large \\textbf{${formatMixedLatex(info.title.trim())}}}\n\\end{center}\n`
    : '';

  const exerciseBlocks = exercises.map((ex, exIdx) => {
    const exHeading = ex.title?.trim()
      ? formatMixedLatex(ex.title.trim())
      : `التمرين ${getArabicOrdinal(exIdx)}:`;

    const sections = [`\\questiontitle{${exHeading}}`];

    if (ex.instructions?.trim()) {
      sections.push(formatMultilineLatex(ex.instructions.trim()));
    }

    const parts = ex.parts || [];
    parts.forEach((part, partIdx) => {
      if (partIdx > 0) {
        sections.push('\\partsep');
      }

      if (part.title?.trim()) {
        sections.push(`\\textbf{الجزء ${getArabicOrdinal(partIdx)}: ${formatMixedLatex(part.title.trim())}}`);
      } else if (parts.length > 1) {
        sections.push(`\\textbf{الجزء ${getArabicOrdinal(partIdx)}:}`);
      }

      if (part.instructions?.trim()) {
        sections.push(formatMultilineLatex(part.instructions.trim()));
      }

      const hasSanad = Boolean(part.hasReligiousText && part.religiousText?.text?.trim());
      if (hasSanad) {
        sections.push(renderSanadBox(part.religiousText));
        if ((part.questions || []).length > 0) {
          sections.push('\\partsep');
        }
      }

      const qList = renderQuestionsList(part.questions);
      if (qList) sections.push(qList);

      if (part.hasTable && part.table) {
        sections.push(renderExamTable(part.table));
      }
    });

    return sections.join('\n\n');
  });

  const bodyContent = [titleBanner, ...exerciseBlocks].filter(Boolean).join('\n\n');

  const closingFooter = String.raw`\vspace{1.2cm}

\begin{center}
    \rule[0.3ex]{2cm}{0.5pt}\hspace{0.3cm}{\large \textbf{وفقكم الله}}\hspace{0.3cm}\rule[0.3ex]{2cm}{0.5pt}
\end{center}`;

  return [
    TEMPLATE_PREAMBLE,
    '',
    '\\begin{document}',
    '',
    headerSection,
    '',
    bodyContent,
    '',
    closingFooter,
    '',
    '\\end{document}',
  ].join('\n');
}
