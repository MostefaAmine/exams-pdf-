import { EDUCATIONAL_LEVELS } from '../data/initialExam';

export default function ExamInformation({ info, onChange }) {
  const handleField = (field) => (e) => {
    onChange({ ...info, [field]: e.target.value });
  };

  return (
    <section className="academic-panel p-4 sm:p-5" aria-labelledby="exam-info-heading">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 bg-forest rounded-xs inline-block" />
          <h2 id="exam-info-heading" className="text-base font-bold text-forest">
            المعلومات العامة للاختبار
          </h2>
        </div>
        <span className="text-[11px] font-mono text-muted">01 / HEADER</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Directorate */}
        <div>
          <label htmlFor="directorate" className="academic-label">
            مديرية التربية
          </label>
          <input
            id="directorate"
            type="text"
            className="academic-input"
            value={info.directorate || ''}
            onChange={handleField('directorate')}
            placeholder="مثال: الجزائر غرب"
          />
        </div>

        {/* School Name */}
        <div>
          <label htmlFor="schoolName" className="academic-label">
            اسم المؤسسة (اتركه فارغًا لنقاط التعبئة)
          </label>
          <input
            id="schoolName"
            type="text"
            className="academic-input"
            value={info.schoolName}
            onChange={handleField('schoolName')}
            placeholder="مثال: ثانوية عبد الحميد بن باديس"
          />
        </div>

        {/* Educational Level */}
        <div>
          <label htmlFor="level" className="academic-label">
            المستوى الدراسي
          </label>
          <select
            id="level"
            className="academic-input"
            value={info.level}
            onChange={handleField('level')}
          >
            {EDUCATIONAL_LEVELS.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lvl.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="academic-label">
            المادة
          </label>
          <input
            id="subject"
            type="text"
            className="academic-input"
            value={info.subject}
            onChange={handleField('subject')}
            placeholder="العلوم الإسلامية"
          />
        </div>

        {/* Exam Type */}
        <div>
          <label htmlFor="examType" className="academic-label">
            نوع التقويم / الاختبار
          </label>
          <input
            id="examType"
            type="text"
            list="exam-type-suggestions"
            className="academic-input"
            value={info.examType}
            onChange={handleField('examType')}
            placeholder="اختبار الفصل الأول"
          />
          <datalist id="exam-type-suggestions">
            <option value="فرض محروس رقم 01" />
            <option value="فرض محروس رقم 02" />
            <option value="اختبار الفصل الأول" />
            <option value="اختبار الفصل الثاني" />
            <option value="اختبار الفصل الثالث" />
            <option value="اختبار بكالوريا تجريبي" />
          </datalist>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="academic-label">
            المدة الزمنية
          </label>
          <input
            id="duration"
            type="text"
            dir="auto"
            className="academic-input"
            value={info.duration}
            onChange={handleField('duration')}
            placeholder="مثال: 01 سا"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="examDate" className="academic-label">
            التاريخ
          </label>
          <input
            id="examDate"
            type="text"
            dir="auto"
            className="academic-input"
            value={info.date || ''}
            onChange={handleField('date')}
            placeholder="مثال: 23/12/04"
          />
        </div>

        {/* Academic Year */}
        <div>
          <label htmlFor="academicYear" className="academic-label">
            السنة الدراسية
          </label>
          <input
            id="academicYear"
            type="text"
            dir="auto"
            className="academic-input"
            value={info.academicYear}
            onChange={handleField('academicYear')}
            placeholder="2025 / 2026"
          />
        </div>

        {/* Optional Exam Title */}
        <div className="sm:col-span-2">
          <label htmlFor="examTitle" className="academic-label">
            عنوان إضافي للموضوع (اختياري)
          </label>
          <input
            id="examTitle"
            type="text"
            className="academic-input"
            value={info.title}
            onChange={handleField('title')}
            placeholder="اتركه فارغًا للاكتفاء بالإطار الرسمي لنوع الاختبار"
          />
        </div>
      </div>
    </section>
  );
}
