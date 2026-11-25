import { useState } from 'react';
import {
  createEmptyQuestion,
  createEmptyTable,
  RELIGIOUS_TEXT_TYPES,
} from '../data/initialExam';
import { getArabicOrdinal } from '../utils/latexGenerator';
import QuestionEditor from './QuestionEditor';
import TableEditor from './TableEditor';

export default function PartEditor({
  part,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const partOrdinal = getArabicOrdinal(index);
  const questions = part.questions || [];
  const table = part.table || createEmptyTable();
  const isQuran = (part.religiousText?.type || 'quran') === 'quran';

  const handleAddQuestion = () => {
    onChange({
      ...part,
      questions: [...questions, createEmptyQuestion()],
    });
  };

  const handleUpdateQuestion = (qId, updatedQ) => {
    onChange({
      ...part,
      questions: questions.map((q) => (q.id === qId ? updatedQ : q)),
    });
  };

  const handleDeleteQuestion = (qId) => {
    onChange({
      ...part,
      questions: questions.filter((q) => q.id !== qId),
    });
  };

  const handleMoveQuestion = (qIndex, direction) => {
    const targetIndex = qIndex + direction;
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    const copy = [...questions];
    const [moved] = copy.splice(qIndex, 1);
    copy.splice(targetIndex, 0, moved);
    onChange({ ...part, questions: copy });
  };

  const toggleReligiousText = () => {
    onChange({
      ...part,
      hasReligiousText: !part.hasReligiousText,
      religiousText: part.religiousText || {
        type: 'quran',
        text: '',
        source: '',
        vocab: '',
        note: '',
      },
    });
  };

  const updateReligiousField = (field) => (e) => {
    onChange({
      ...part,
      religiousText: { ...part.religiousText, [field]: e.target.value },
    });
  };

  const toggleTable = () => {
    onChange({
      ...part,
      hasTable: !part.hasTable,
      table: part.table || createEmptyTable(),
    });
  };

  const updateTable = (nextTable) => {
    onChange({ ...part, table: nextTable });
  };

  return (
    <div className="bg-ivory/70 border border-border rounded-sm p-3.5 space-y-3">
      {/* Part header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-forest bg-gold-light border border-gold/40 px-2.5 py-0.5 rounded-sm">
            الجزء {partOrdinal}
          </span>
          {part.title?.trim() && (
            <span className="text-xs font-medium text-charcoal truncate max-w-[200px]">
              — {part.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="btn-ghost"
            title="تحريك الجزء لأعلى"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="btn-ghost"
            title="تحريك الجزء لأسفل"
          >
            ↓
          </button>

          {confirmDelete ? (
            <span className="inline-flex items-center gap-1.5 bg-danger-light px-2 py-0.5 rounded-sm text-xs">
              <span className="text-danger">حذف الجزء؟</span>
              <button
                type="button"
                onClick={onDelete}
                className="text-danger font-semibold hover:underline cursor-pointer"
              >
                نعم
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-muted hover:text-charcoal cursor-pointer"
              >
                لا
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (questions.length > 0 && questions.some((q) => q.text?.trim())) {
                  setConfirmDelete(true);
                } else {
                  onDelete();
                }
              }}
              className="btn-danger-ghost"
              title="حذف الجزء"
            >
              حذف الجزء
            </button>
          )}
        </div>
      </div>

      {/* Part fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="academic-label">عنوان الجزء (اختياري)</label>
          <input
            type="text"
            className="academic-input bg-paper"
            value={part.title}
            onChange={(e) => onChange({ ...part, title: e.target.value })}
            placeholder={`مثال: الجزء ${partOrdinal} — الفهم والتحليل`}
          />
        </div>
        <div>
          <label className="academic-label">تعليمة الجزء (اختياري)</label>
          <input
            type="text"
            className="academic-input bg-paper"
            value={part.instructions}
            onChange={(e) => onChange({ ...part, instructions: e.target.value })}
            placeholder="مثال: أكمل الجدول التالي."
          />
        </div>
      </div>

      {/* Independent Per-Part Sanad Toggle & Table Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper border border-border/80 px-3 py-2 rounded-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-forest">سند شرعي لهذا الجزء:</span>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(part.hasReligiousText)}
            onClick={toggleReligiousText}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
              part.hasReligiousText
                ? 'bg-forest text-ivory'
                : 'bg-ivory border border-border text-muted hover:text-charcoal'
            }`}
          >
            <span>{part.hasReligiousText ? 'مُفعَّل (ON)' : 'مُعطَّل (OFF)'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={toggleTable}
          className="text-xs font-medium text-olive hover:text-forest inline-flex items-center gap-1 cursor-pointer"
        >
          <span>{part.hasTable ? '− إزالة الجدول' : '+ إضافة جدول (examtable)'}</span>
        </button>
      </div>

      {/* Part's Independent Sanad Editor */}
      {part.hasReligiousText && (
        <div className="p-3 bg-gold-light/30 border border-gold/40 rounded-sm space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex border border-border rounded-sm bg-paper p-0.5">
              {RELIGIOUS_TEXT_TYPES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...part,
                      religiousText: { ...part.religiousText, type: opt.value },
                    })
                  }
                  className={`px-2.5 py-1 text-xs font-medium rounded-xs cursor-pointer ${
                    (part.religiousText?.type || 'quran') === opt.value
                      ? 'bg-forest text-ivory'
                      : 'text-muted hover:text-charcoal'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-muted">
              يُحفَظ النص والتشكيل كما هو دون تعديل تلقائي
            </span>
          </div>

          <textarea
            rows={3}
            dir="rtl"
            className="academic-input bg-paper font-religious text-base leading-loose"
            value={part.religiousText?.text || ''}
            onChange={updateReligiousField('text')}
            placeholder={
              isQuran
                ? 'أدخل نص الآية أو الآيات الكريمة بالرسم والتشكيل المطلوب...'
                : 'أدخل نص الحديث الشريف بالتشكيل المطلوب...'
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              className="academic-input bg-paper text-xs"
              value={part.religiousText?.source || ''}
              onChange={updateReligiousField('source')}
              placeholder={isQuran ? 'المصدر (مثال: سورة البقرة، الآية: 286)' : 'التخريج (مثال: رواه مسلم)'}
            />
            <input
              type="text"
              className="academic-input bg-paper text-xs"
              value={part.religiousText?.vocab || ''}
              onChange={updateReligiousField('vocab')}
              placeholder="شرح الكلمات (اختياري — \vocabbox)"
            />
          </div>

          <input
            type="text"
            className="academic-input bg-paper text-xs"
            value={part.religiousText?.note || ''}
            onChange={updateReligiousField('note')}
            placeholder="ملاحظة أو توجيه إضافي (اختياري)"
          />
        </div>
      )}

      {/* Optional Exam Table Editor */}
      {part.hasTable && (
        <TableEditor table={table} onChange={updateTable} />
      )}

      {/* Questions list */}
      <div className="space-y-2.5">
        {questions.length === 0 ? (
          !part.hasTable && (
            <div className="text-center py-4 border border-dashed border-border rounded-sm bg-paper/60">
              <p className="text-xs text-muted mb-2">لا توجد أسئلة في هذا الجزء بعد.</p>
              <button type="button" onClick={handleAddQuestion} className="btn-secondary text-xs">
                + إضافة أول سؤال
              </button>
            </div>
          )
        ) : (
          questions.map((q, qIdx) => (
            <QuestionEditor
              key={q.id}
              question={q}
              index={qIdx}
              total={questions.length}
              onChange={(updated) => handleUpdateQuestion(q.id, updated)}
              onDelete={() => handleDeleteQuestion(q.id)}
              onMoveUp={() => handleMoveQuestion(qIdx, -1)}
              onMoveDown={() => handleMoveQuestion(qIdx, 1)}
            />
          ))
        )}
      </div>

      <div>
        <button type="button" onClick={handleAddQuestion} className="btn-secondary text-xs">
          <span>+ إضافة سؤال</span>
        </button>
      </div>
    </div>
  );
}
