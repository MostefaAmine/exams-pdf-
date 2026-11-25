import { useState } from 'react';

function GeometricEmblem() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-9 h-9 shrink-0 text-forest"
      fill="none"
      aria-hidden="true"
    >
      {/* Outer rotated square (Rub el Hizb) */}
      <rect
        x="8"
        y="8"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="8"
        width="24"
        height="24"
        transform="rotate(45 20 20)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Inner gold accent diamond */}
      <rect
        x="14"
        y="14"
        width="12"
        height="12"
        transform="rotate(45 20 20)"
        stroke="#B59449"
        strokeWidth="1.25"
      />
      <circle cx="20" cy="20" r="2.2" fill="#B59449" />
    </svg>
  );
}

export default function Header({
  onNewExam,
  onLoadSample,
  onExportTex,
  onExportPdf,
  isCleared,
  onToggleClear,
}) {
  const [confirmingNew, setConfirmingNew] = useState(false);

  const handleConfirmNew = () => {
    onNewExam();
    setConfirmingNew(false);
  };

  return (
    <header className="no-print bg-paper border-b border-border sticky top-0 z-30">
      {/* Subtle top academic rule */}
      <div className="h-1 bg-forest w-full" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <GeometricEmblem />
          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="font-religious text-2xl sm:text-3xl font-bold text-forest leading-none">
                مُعِدّ
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider text-gold border border-gold/40 bg-gold-light/50 px-1.5 py-0.5 rounded-sm">
                LaTeX
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              مولّد اختبارات التربية الإسلامية — التعليم الثانوي الجزائري
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onToggleClear}
            className={`btn-secondary ${isCleared ? 'border-forest text-forest bg-olive-light/40' : ''}`}
            title={isCleared ? 'استعادة بيانات النموذج' : 'تفريغ جميع الحقول'}
          >
            <span>{isCleared ? 'استعادة النموذج' : 'تفريغ الحقول'}</span>
          </button>

          {confirmingNew ? (
            <div className="flex items-center gap-1.5 bg-ivory border border-gold/50 px-2.5 py-1 rounded-sm">
              <span className="text-xs text-charcoal font-medium">بدء اختبار جديد؟</span>
              <button
                type="button"
                onClick={handleConfirmNew}
                className="text-xs font-semibold text-danger hover:underline px-1.5 py-0.5 cursor-pointer"
              >
                تأكيد (فارغ)
              </button>
              <button
                type="button"
                onClick={() => {
                  onLoadSample();
                  setConfirmingNew(false);
                }}
                className="text-xs font-semibold text-forest hover:underline px-1.5 py-0.5 cursor-pointer"
              >
                نموذج جاهز
              </button>
              <button
                type="button"
                onClick={() => setConfirmingNew(false)}
                className="text-xs text-muted hover:text-charcoal px-1 py-0.5 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingNew(true)}
              className="btn-secondary"
              title="إنشاء اختبار جديد"
            >
              <svg className="w-4 h-4 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>اختبار جديد</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExportPdf}
            className="btn-secondary"
            title="حفظ أو طباعة الاختبار بصيغة PDF"
          >
            <svg className="w-4 h-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            <span>تصدير PDF</span>
          </button>

          <button
            type="button"
            onClick={onExportTex}
            className="btn-primary"
            title="تنزيل ملف LaTeX"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>تصدير .tex</span>
          </button>
        </div>
      </div>
    </header>
  );
}

