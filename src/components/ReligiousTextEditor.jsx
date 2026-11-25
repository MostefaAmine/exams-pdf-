import { RELIGIOUS_TEXT_TYPES } from '../data/initialExam';

export default function ReligiousTextEditor({ religiousText, onChange }) {
  const handleField = (field) => (e) => {
    onChange({ ...religiousText, [field]: e.target.value });
  };

  const isQuran = religiousText.type === 'quran';

  return (
    <section className="academic-panel p-4 sm:p-5" aria-labelledby="religious-text-heading">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 bg-gold rounded-xs inline-block" />
          <h2 id="religious-text-heading" className="text-base font-bold text-forest">
            السند الشرعي الرئيسي
          </h2>
        </div>
        <span className="text-[11px] font-mono text-muted">02 / SANAD</span>
      </div>

      {/* Type selector */}
      <div className="mb-4">
        <span className="academic-label">نوع السند</span>
        <div className="inline-flex border border-border rounded-sm bg-ivory p-0.5">
          {RELIGIOUS_TEXT_TYPES.map((option) => {
            const active = religiousText.type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...religiousText, type: option.value })}
                className={`px-4 py-1.5 text-sm font-medium rounded-xs transition-colors cursor-pointer ${
                  active
                    ? 'bg-forest text-ivory'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Religious text input */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="religious-text-body" className="academic-label mb-0">
              {isQuran ? 'نص الآية القرآنية (مشكولًا)' : 'نص الحديث الشريف (مشكولًا)'}
            </label>
            <span className="text-[11px] text-muted">
              يُحفَظ النص والتشكيل كما هو دون تعديل تلقائي
            </span>
          </div>
          <textarea
            id="religious-text-body"
            rows={4}
            dir="rtl"
            className="academic-input font-religious text-lg leading-loose"
            value={religiousText.text}
            onChange={handleField('text')}
            placeholder={
              isQuran
                ? 'أدخل نص الآية أو الآيات الكريمة بالرسم والتشكيل المطلوب...'
                : 'أدخل نص الحديث الشريف بالتشكيل المطلوب...'
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="religious-source" className="academic-label">
              {isQuran ? 'المصدر (اسم السورة ورقم الآية)' : 'التخريج / المصدر'}
            </label>
            <input
              id="religious-source"
              type="text"
              className="academic-input"
              value={religiousText.source}
              onChange={handleField('source')}
              placeholder={isQuran ? 'مثال: سورة البقرة، الآية: 286' : 'مثال: رواه مسلم'}
            />
          </div>

          <div>
            <label htmlFor="religious-note" className="academic-label">
              ملاحظة أو توجيه (اختياري)
            </label>
            <input
              id="religious-note"
              type="text"
              className="academic-input"
              value={religiousText.note}
              onChange={handleField('note')}
              placeholder="مثال: اقرأ السند بتدبر ثم أجب عن الأسئلة"
            />
          </div>
        </div>

        {/* Vocabulary explanations (\vocabbox) */}
        <div>
          <label htmlFor="religious-vocab" className="academic-label">
            شرح الكلمات (اختياري — يُولّد صندوق <code className="font-mono text-[11px]" dir="ltr">\vocabbox</code>)
          </label>
          <input
            id="religious-vocab"
            type="text"
            className="academic-input"
            value={religiousText.vocab || ''}
            onChange={handleField('vocab')}
            placeholder="مثال: نحلته: أعطيته، اجتالتهم: حولتهم، مقتهم: أبغضهم."
          />
        </div>

        {/* Manuscript-inspired preview */}
        {religiousText.text?.trim() && (
          <div className="mt-2 border-2 border-charcoal/70 p-0.5 bg-ivory rounded-xs">
            <div className="border border-charcoal/40 bg-ivory p-4 sm:p-5">
              <p
                dir="rtl"
                className="font-religious text-xl text-charcoal leading-[2.2] whitespace-pre-wrap text-justify"
              >
                {isQuran && !religiousText.text.trim().includes('﴿')
                  ? `﴿ ${religiousText.text.trim()} ﴾`
                  : religiousText.text.trim()}
              </p>
              {religiousText.source?.trim() && (
                <p className="text-xs font-bold text-charcoal mt-2 text-left" dir="rtl">
                  — {religiousText.source.trim()} —
                </p>
              )}
              {religiousText.note?.trim() && (
                <p className="text-xs text-muted mt-1.5 italic">
                  {religiousText.note.trim()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
