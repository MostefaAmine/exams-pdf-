import { createEmptyExercise } from '../data/initialExam';
import ExerciseEditor from './ExerciseEditor';

export default function ExamBuilder({ exercises, onChange }) {
  const handleAddExercise = () => {
    onChange([...exercises, createEmptyExercise()]);
  };

  const handleUpdateExercise = (exId, updatedExercise) => {
    onChange(exercises.map((ex) => (ex.id === exId ? updatedExercise : ex)));
  };

  const handleDeleteExercise = (exId) => {
    onChange(exercises.filter((ex) => ex.id !== exId));
  };

  const handleMoveExercise = (exIndex, direction) => {
    const targetIndex = exIndex + direction;
    if (targetIndex < 0 || targetIndex >= exercises.length) return;
    const copy = [...exercises];
    const [moved] = copy.splice(exIndex, 1);
    copy.splice(targetIndex, 0, moved);
    onChange(copy);
  };

  return (
    <section className="space-y-4" aria-labelledby="exam-builder-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 bg-forest rounded-xs inline-block" />
          <h2 id="exam-builder-heading" className="text-base font-bold text-forest">
            هيكلة الاختبار والتمارين
          </h2>
          <span className="text-xs text-muted">({exercises.length})</span>
        </div>

        <button
          type="button"
          onClick={handleAddExercise}
          className="btn-primary text-xs py-1.5 px-3"
        >
          + إضافة تمرين
        </button>
      </div>

      {exercises.length === 0 ? (
        <div className="academic-panel p-8 text-center">
          <p className="text-sm text-charcoal font-medium mb-1">
            لا توجد تمارين في هذا الاختبار حاليًا
          </p>
          <p className="text-xs text-muted mb-4">
            ابدأ بإضافة التمرين الأول، ثم أضف الأجزاء والأسئلة حسب هيكلة الموضوع.
          </p>
          <button type="button" onClick={handleAddExercise} className="btn-primary">
            + إضافة التمرين الأول
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {exercises.map((ex, idx) => (
            <ExerciseEditor
              key={ex.id}
              exercise={ex}
              index={idx}
              total={exercises.length}
              onChange={(updated) => handleUpdateExercise(ex.id, updated)}
              onDelete={() => handleDeleteExercise(ex.id)}
              onMoveUp={() => handleMoveExercise(idx, -1)}
              onMoveDown={() => handleMoveExercise(idx, 1)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
