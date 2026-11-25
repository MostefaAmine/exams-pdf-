import { useState } from 'react';
import { TEMPLATE_STATUS } from '../utils/latexGenerator';

function highlightLatexLine(line) {
  if (line.trimStart().startsWith('%')) {
    return <span className="text-olive/80">{line}</span>;
  }

  // Highlight LaTeX commands (\command) and braces
  const parts = line.split(/(\\[a-zA-Z@]+|[{}])/g);
  return parts.map((part, i) => {
    if (part.startsWith('\\')) {
      return (
        <span key={i} className="text-forest font-semibold">
          {part}
        </span>
      );
    }
    if (part === '{' || part === '}') {
      return (
        <span key={i} className="text-gold font-bold">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function LatexOutput({ latexCode, onDownload }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const lines = latexCode.split('\n');

  return (
    <div className="space-y-3">
      {TEMPLATE_STATUS === 'custom-template-active' && (
        <div className="bg-olive-light/60 border border-olive/30 rounded-sm px-3 py-2 text-xs text-forest flex items-center justify-between gap-2">
          <span className="font-semibold">
            ✓ متوافق مع القالب المخصّص (XeLaTeX / LuaLaTeX)
          </span>
          <span className="font-mono text-[11px] text-muted" dir="ltr">
            babel + Noto Naskh Arabic
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-mono text-muted" dir="ltr">
          {lines.length} lines • UTF-8
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary text-xs"
          >
            {copied ? '✓ تم النسخ' : 'نسخ الكود'}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="btn-primary text-xs py-1.5 px-3"
          >
            تنزيل .tex
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div
        dir="ltr"
        className="bg-paper border border-border rounded-sm overflow-x-auto max-h-[70vh] overflow-y-auto font-mono text-xs leading-relaxed"
      >
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-ivory/80">
                <td className="select-none text-right pr-3 pl-2.5 py-0.5 text-[11px] text-muted/60 border-r border-border/70 bg-ivory/40 w-10 align-top">
                  {idx + 1}
                </td>
                <td className="px-3 py-0.5 whitespace-pre-wrap break-words text-charcoal">
                  {line === '' ? ' ' : highlightLatexLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
