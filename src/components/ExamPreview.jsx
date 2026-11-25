import { getArabicOrdinal, getArabicPartLetter } from '../utils/latexGenerator';

const LEVEL_ARABIC_NAMES = {
  '1AS': 'الأولى ثانوي',
  '2AS': 'الثانية ثانوي',
  '3AS': 'الثالثة ثانوي',
};

function ExamRule() {
  return (
    <div className="my-2.5 space-y-0.5" aria-hidden="true">
      <div className="h-[1.5px] bg-charcoal w-full" />
      <div className="h-[0.5px] bg-charcoal w-full" />
    </div>
  );
}

function PartSeparator() {
  return (
    <div className="my-4 flex items-center justify-center gap-2 text-charcoal" aria-hidden="true">
      <span className="w-14 sm:w-20 h-[0.5px] bg-charcoal/70" />
      <span className="w-1 h-1 bg-charcoal inline-block" />
      <span className="w-1.5 h-1.5 bg-charcoal rotate-45 inline-block" />
      <span className="w-1 h-1 bg-charcoal inline-block" />
      <span className="w-14 sm:w-20 h-[0.5px] bg-charcoal/70" />
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="flex items-center gap-2.5 my-3">
      <span className="border border-charcoal px-3 py-1 text-sm font-bold text-charcoal bg-paper shrink-0">
        {title}
      </span>
      <span className="flex-1 border-b border-dotted border-charcoal/70" />
    </div>
  );
}

function SanadBox({ religiousText }) {
  if (!religiousText?.text?.trim()) return null;
  const isQuran = religiousText.type === 'quran';
  const text = religiousText.text.trim();

  return (
    <div className="space-y-2.5 my-3">
      {/* Double-framed container with beige background, Amiri font & slightly reduced text size */}
      <div className="border-[1.5px] border-charcoal p-[2px] bg-ivory">
        <div className="border-[0.6px] border-charcoal/80 bg-ivory px-4 py-3">
          <p
            dir="rtl"
            className="font-religious text-[15px] sm:text-base text-charcoal leading-[2.0] whitespace-pre-wrap text-justify"
          >
            {isQuran && !text.includes('﴿') ? `﴿ ${text} ﴾` : text}
          </p>
          {religiousText.source?.trim() && (
            <p className="text-xs font-bold text-charcoal mt-2 text-left">
              -- {religiousText.source.trim()} --
            </p>
          )}
          {religiousText.note?.trim() && (
            <p className="text-xs text-muted mt-1.5 italic">{religiousText.note.trim()}</p>
          )}
        </div>
      </div>

      {/* \vocabbox */}
      {religiousText.vocab?.trim() && (
        <div className="border border-charcoal/70 border-r-[3px] border-r-charcoal bg-paper px-3 py-2 text-xs leading-relaxed">
          <span className="font-bold ml-1.5">شرح الكلمات:</span>
          <span>{religiousText.vocab.trim()}</span>
        </div>
      )}
    </div>
  );
}

function QuestionsListPreview({ questions }) {
  if (!questions || questions.length === 0) return null;

  return (
    <ol className="space-y-2.5 pr-1">
      {questions.map((q, qIdx) => (
        <li key={q.id} className="text-xs sm:text-sm leading-relaxed">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="font-bold ml-1.5" dir="ltr">
                ({qIdx + 1})
              </span>
              <span className="whitespace-pre-wrap">
                {q.text?.trim() || (
                  <span className="text-muted italic">سؤال فارغ...</span>
                )}
              </span>
            </div>
            {q.mark?.trim() && (
              <span className="text-xs font-bold shrink-0">
                ({q.mark.trim()})
              </span>
            )}
          </div>

          {(q.subquestions || []).length > 0 && (
            <ul className="mt-1.5 mr-6 space-y-1">
              {q.subquestions.map((sq, sqIdx) => (
                <li
                  key={sq.id}
                  className="flex items-start justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="flex-1">
                    <span className="font-bold ml-1.5" dir="rtl">
                      {getArabicPartLetter(sqIdx)}
                      <span dir="ltr">(</span>
                    </span>
                    <span>{sq.text?.trim() || '...'}</span>
                  </div>
                  {sq.mark?.trim() && (
                    <span className="text-xs shrink-0">
                      ({sq.mark.trim()})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {q.hasTable && <ExamTablePreview table={q.table} />}
        </li>
      ))}
    </ol>
  );
}

function ExamTablePreview({ table }) {
  if (!table || !table.columns?.length) return null;

  return (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse border border-charcoal text-xs text-center">
        <thead>
          <tr className="border-b-2 border-charcoal bg-ivory/60">
            {table.columns.map((col, idx) => (
              <th key={idx} className="border border-charcoal px-2.5 py-2 font-bold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(table.rows || []).map((row) => {
            const subrows = Math.max(1, Number(row.subrows) || 1);
            return Array.from({ length: subrows }, (_, srIdx) => (
              <tr key={`${row.id}_${srIdx}`}>
                {srIdx === 0 && (
                  <td
                    rowSpan={subrows}
                    className="border border-charcoal px-2.5 py-3 font-medium align-middle"
                  >
                    {row.cells?.[0] || ''}
                  </td>
                )}
                {table.columns.slice(1).map((_, colOffset) => (
                  <td key={colOffset} className="border border-charcoal px-2.5 py-3">
                    {srIdx === 0 ? row.cells?.[colOffset + 1] || '' : ''}
                  </td>
                ))}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ExamPreview({ exam }) {
  const { info = {}, exercises = [] } = exam;
  const levelLabel = LEVEL_ARABIC_NAMES[info.level] || info.level || '—';
  const dateLabel = info.date?.trim() ? 'التاريخ:' : 'السنة الدراسية:';
  const dateValue = info.date?.trim() || info.academicYear?.trim() || '—';

  return (
    <div id="exam-print-sheet" className="bg-paper border border-border rounded-sm shadow-xs p-5 sm:p-7 text-charcoal" dir="rtl">
      {/* 1. Official Algerian Exam Header */}
      <div className="text-center space-y-1 text-xs sm:text-sm">
        <p className="font-bold">الجمهورية الجزائرية الديمقراطية الشعبية</p>
        <p className="font-bold">وزارة التربية الوطنية</p>
        <p className="font-semibold text-xs">
          مديرية التربية - {info.directorate?.trim() || 'الجزائر غرب'} -
        </p>
        <p className="font-semibold text-xs pt-0.5">
          المؤسسة:{' '}
          {info.schoolName?.trim() ? (
            info.schoolName.trim()
          ) : (
            <span className="inline-block w-36 border-b border-dotted border-charcoal/70 align-middle" />
          )}
        </p>
      </div>

      <ExamRule />

      {/* 2. Exam Metadata Bar */}
      <div className="grid grid-cols-3 items-center gap-2 py-1 text-xs">
        <div className="space-y-1.5 text-right">
          <div>
            <span className="font-bold">المادة: </span>
            <span>{info.subject?.trim() || 'العلوم الإسلامية'}</span>
          </div>
          <div>
            <span className="font-bold">المستوى: </span>
            <span>{levelLabel}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="border-[1.5px] border-charcoal p-[2px]">
            <div className="border-[0.6px] border-charcoal px-3 py-1.5 text-center font-bold text-xs sm:text-sm">
              {info.examType?.trim() || 'اختبار الفصل الأول'}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <div>
            <span className="font-bold">{dateLabel} </span>
            <span dir="ltr">{dateValue}</span>
          </div>
          <div>
            <span className="font-bold">المدة: </span>
            <span>{info.duration?.trim() || '01 سا'}</span>
          </div>
        </div>
      </div>

      <ExamRule />

      {/* Optional extra title */}
      {info.title?.trim() && (
        <div className="text-center my-2">
          <h3 className="text-sm sm:text-base font-bold">{info.title.trim()}</h3>
        </div>
      )}

      {/* Exercises -> Parts -> Sanad (ON/OFF) -> Questions */}
      {exercises.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted border border-dashed border-border rounded-sm mt-3">
          أضف تمارين في المحرر لتظهر معاينة ورقة الاختبار هنا.
        </div>
      ) : (
        <div className="space-y-5 mt-3">
          {exercises.map((ex, exIdx) => {
            const parts = ex.parts || [];

            return (
              <section key={ex.id}>
                <SectionTitle
                  title={
                    ex.title?.trim()
                      ? ex.title.trim()
                      : `التمرين ${getArabicOrdinal(exIdx)}:`
                  }
                />

                {ex.instructions?.trim() && (
                  <p className="text-xs sm:text-sm mb-2 whitespace-pre-wrap">
                    {ex.instructions.trim()}
                  </p>
                )}

                {parts.map((part, partIdx) => {
                  const hasSanad = Boolean(part.hasReligiousText && part.religiousText?.text?.trim());
                  const hasQuestions = (part.questions || []).length > 0;

                  return (
                    <div key={part.id} className="space-y-2">
                      {partIdx > 0 && <PartSeparator />}

                      {(part.title?.trim() || parts.length > 1) && (
                        <h5 className="text-xs sm:text-sm font-bold text-charcoal">
                          {part.title?.trim()
                            ? `الجزء ${getArabicOrdinal(partIdx)}: ${part.title.trim()}`
                            : `الجزء ${getArabicOrdinal(partIdx)}:`}
                        </h5>
                      )}

                      {part.instructions?.trim() && (
                        <p className="text-xs text-muted whitespace-pre-wrap">
                          {part.instructions.trim()}
                        </p>
                      )}

                      {hasSanad && (
                        <>
                          <SanadBox religiousText={part.religiousText} />
                          {hasQuestions && <PartSeparator />}
                        </>
                      )}

                      <QuestionsListPreview questions={part.questions} />

                      {part.hasTable && <ExamTablePreview table={part.table} />}
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      )}

      {/* Closing footer */}
      <div className="mt-8 flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-charcoal">
        <span className="w-14 h-[0.5px] bg-charcoal" />
        <span>وفقكم الله</span>
        <span className="w-14 h-[0.5px] bg-charcoal" />
      </div>
    </div>
  );
}
