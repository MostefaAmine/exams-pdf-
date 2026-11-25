/**
 * Escapes LaTeX special characters in plain text while preserving
 * Arabic letters, diacritics (tashkeel), punctuation, and line breaks.
 *
 * @param {string} text
 * @returns {string}
 */
export function escapeLatex(text) {
  if (!text) return '';

  return String(text)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([{}#$&_ %])/g, (match) => {
      if (match === ' ') return ' ';
      return `\\${match}`;
    })
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/~/g, '\\textasciitilde{}');
}

/**
 * Escapes LaTeX special characters and wraps contiguous Latin/digit runs
 * in \lat{...} for proper babel English/LTR rendering inside Arabic text.
 * Never modifies Arabic characters or diacritics.
 *
 * @param {string} text
 * @returns {string}
 */
export function formatMixedLatex(text) {
  if (!text) return '';
  const escaped = escapeLatex(text);
  // Wrap standalone ASCII/digit sequences (e.g., 23/12/04, 01, 2AS) in \lat{...}
  return escaped.replace(/[A-Za-z0-9]+(?:[/:.-][A-Za-z0-9]+)*/g, (match) => `\\lat{${match}}`);
}

/**
 * Normalizes line breaks for LaTeX output without altering Arabic text or diacritics.
 *
 * @param {string} text
 * @returns {string}
 */
export function formatMultilineLatex(text) {
  if (!text) return '';
  return formatMixedLatex(text).replace(/\r?\n/g, ' \\\\\n');
}
