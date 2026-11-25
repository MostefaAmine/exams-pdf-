import { useState } from 'react';
import { createEmptyPart } from '../data/initialExam';
import { getArabicOrdinal } from '../utils/latexGenerator';
import PartEditor from './PartEditor';

export default function ExerciseEditor({
  exercise,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const exOrdinal = getArabicOrdinal(index);
  const parts = exercise.parts || [];

  const handleAddPart = () => {
    onChange({
      ...exercise,
      parts: [...parts, createEmptyPart()],
    });
  };

  const handleUpdatePart = (partId, updatedPart) => {
    onChange({
      ...exercise,
      parts: parts.map((p) => (p.id === partId ? updatedPart : p)),
    });
  };

  const handleDeletePart = (partId) => {
    onChange({
      ...exercise,
      parts: parts.filter((p) => p.id !== partId),
    });
  };

  const handleMovePart = (partIndex, direction) => {
    const targetIndex = partIndex + direction;
    if (targetIndex < 0 || targetIndex >= parts.length) return;
    const copy = [...parts];
    const [moved] = copy.splice(partIndex, 1);
    copy.splice(targetIndex, 0, moved);
    onChange({ ...exercise, parts: copy });
  };

  return (
    <article className="academic-panel overflow-hidden">
      {/* Exercise Header */}
      <div className="bg-forest/5 border-b border-border px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="bg-forest text-ivory text-xs font-bold px-2.5 py-1 rounded-sm">
            التمرين {exOrdinal}
          </span>
          {exercise.title?.trim() && (
            <h3 className="text-sm font-bold text-charcoal">{exercise.title}</h3>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="btn-ghost"
            title="تحريك التمرين لأعلى"
          >
            ↑ أعلى
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="btn-ghost"
            title="تحريك التمرين لأسفل"
          >
            ↓ أسفل
          </button>

          {confirmDelete ? (
            <span className="inline-flex items-center gap-1.5 bg-danger-light border border-danger/30 px-2.5 py-1 rounded-sm text-xs">
              <span className="text-danger font-medium">تأكيد حذف التمرين؟</span>
              <button
                type="button"
                onClick={onDelete}
                className="text-danger font-bold hover:underline cursor-pointer"
              >
                حذف
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-muted hover:text-charcoal cursor-pointer"
              >
                إلغاء
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="btn-danger-ghost"
              title="حذف التمرين"
            >
              حذف
            </button>
          )}
        </div>
      </div>

      {/* Exercise Body */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="academic-label">عنوان التمرين (اختياري)</label>
            <input
              type="text"
              className="academic-input"
              value={exercise.title}
              onChange={(e) => onChange({ ...exercise, title: e.target.value })}
              placeholder={`الافتراضي: التمرين ${exOrdinal}:`}
            />
          </div>
          <div>
            <label className="academic-label">تعليمة التمرين (اختياري)</label>
            <input
              type="text"
              className="academic-input"
              value={exercise.instructions}
              onChange={(e) => onChange({ ...exercise, instructions: e.target.value })}
              placeholder="تعليمة عامة للتمرين..."
            />
          </div>
        </div>

        {/* Parts List */}
        <div className="space-y-3">
          {parts.length === 0 ? (
            <div className="text-center py-5 border border-dashed border-border rounded-sm bg-ivory/40">
              <p className="text-xs text-muted mb-2">لا توجد أجزاء في هذا التمرين.</p>
              <button type="button" onClick={handleAddPart} className="btn-secondary text-xs">
                + إضافة جزء
              </button>
            </div>
          ) : (
            parts.map((part, pIdx) => (
              <PartEditor
                key={part.id}
                part={part}
                index={pIdx}
                total={parts.length}
                onChange={(updated) => handleUpdatePart(part.id, updated)}
                onDelete={() => handleDeletePart(part.id)}
                onMoveUp={() => handleMovePart(pIdx, -1)}
                onMoveDown={() => handleMovePart(pIdx, 1)}
              />
            ))
          )}
        </div>

        <div className="pt-1 border-t border-border/60">
          <button type="button" onClick={handleAddPart} className="btn-secondary text-xs">
            <span>+ إضافة جزء جديد للتمرين</span>
          </button>
        </div>
      </div>
    </article>
  );
}
