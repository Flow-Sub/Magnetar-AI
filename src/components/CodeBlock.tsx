import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
  isDark?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = 'javascript',
  value,
  isDark = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(() => {
    const lang = (language || 'javascript').toLowerCase();
    if (lang === 'js' || lang === 'javascript') return 'JS';
    if (lang === 'html') return 'HTML';
    if (lang === 'css') return 'CSS';
    if (lang === 'ts' || lang === 'typescript') return 'TS';
    if (lang === 'py' || lang === 'python') return 'Python';
    if (lang === 'json') return 'JSON';
    return lang.toUpperCase();
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // Determine available tabs based on snippet or default multi-tab format
  const normalizedLang = (language || '').toLowerCase();
  const showTabRow = ['javascript', 'js', 'html', 'css', 'typescript', 'ts', 'jsx', 'tsx', 'py', 'python', 'json', 'bash', 'sql'].includes(normalizedLang) || !normalizedLang;

  const lines = value.trim().split('\n');

  // Syntax colorizer helper for lightweight fast rendering without heavy overhead
  const renderHighlightedLine = (line: string) => {
    if (!line) return <span>&nbsp;</span>;

    // Simple robust tokenizer for visual beauty
    const tokens = line.split(/(\b(?:let|const|var|function|return|import|export|from|if|else|for|while|class|new|async|await|try|catch|document|console|window|addEventListener|getElementById)\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[\s\S]*?`|\/\/.+|[{}()[\];,]|=>|\b\d+\b)/g);

    return tokens.map((token, i) => {
      if (!token) return null;

      // Keywords
      if (/^(let|const|var|function|return|import|export|from|if|else|for|while|class|new|async|await|try|catch)$/.test(token)) {
        return <span key={i} className="text-blue-500 font-medium">{token}</span>;
      }
      // Built-ins / DOM
      if (/^(document|console|window|addEventListener|getElementById)$/.test(token)) {
        return <span key={i} className="text-purple-600 dark:text-purple-400">{token}</span>;
      }
      // Strings
      if (/^["'`].*["'`]$/.test(token)) {
        return <span key={i} className="text-amber-600 dark:text-amber-400">{token}</span>;
      }
      // Comments
      if (/^\/\/.+/.test(token)) {
        return <span key={i} className="text-gray-400 dark:text-gray-500 italic">{token}</span>;
      }
      // Numbers
      if (/^\d+$/.test(token)) {
        return <span key={i} className="text-emerald-600 dark:text-emerald-400 font-mono">{token}</span>;
      }
      // Methods/Functions call
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token) && token.includes('Button')) {
        return <span key={i} className="text-orange-600 dark:text-orange-300">{token}</span>;
      }

      return <span key={i} className={isDark ? 'text-gray-200' : 'text-gray-800'}>{token}</span>;
    });
  };

  return (
    <div
      id="code-block-container"
      className={`relative my-4 rounded-2xl overflow-hidden border shadow-sm transition-all ${
        isDark
          ? 'bg-[#18191f] border-gray-800 text-gray-100'
          : 'bg-white border-gray-200/80 text-gray-900'
      }`}
    >
      {/* Visual subtle warm gradient accent on right border (matching reference image) */}
      <div className="absolute top-0 right-0 bottom-0 w-2.5 bg-gradient-to-b from-amber-300 via-orange-400 to-rose-400 opacity-80 pointer-events-none rounded-r-2xl" />

      {/* Header bar with tabs and copy button */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b select-none ${
          isDark ? 'bg-[#14151a] border-gray-800/80' : 'bg-gray-50/80 border-gray-100'
        }`}
      >
        {/* Language Tabs */}
        {showTabRow ? (
          <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-gray-200/50 dark:bg-gray-800/60 text-xs font-medium">
            {['HTML', 'CSS', 'JS'].includes(activeTab) ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('HTML')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'HTML'
                      ? isDark
                        ? 'bg-gray-700 text-white shadow-xs font-semibold'
                        : 'bg-white text-gray-900 shadow-xs font-semibold'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  HTML
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('CSS')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'CSS'
                      ? isDark
                        ? 'bg-gray-700 text-white shadow-xs font-semibold'
                        : 'bg-white text-gray-900 shadow-xs font-semibold'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  CSS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('JS')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'JS'
                      ? isDark
                        ? 'bg-gray-700 text-white shadow-xs font-semibold'
                        : 'bg-white text-gray-900 shadow-xs font-semibold'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  JS
                </button>
              </>
            ) : (
              <span className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-xs font-semibold uppercase tracking-wider text-[11px]">
                {activeTab}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Code2 className="w-3.5 h-3.5 text-orange-500" />
            <span className="uppercase">{language || 'Code'}</span>
          </div>
        )}

        {/* Copy Code Action Button */}
        <button
          id="copy-code-button"
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer mr-2 ${
            isDark
              ? 'text-gray-300 hover:text-white hover:bg-gray-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/70'
          }`}
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="p-4 overflow-x-auto font-mono text-[13.5px] leading-relaxed select-text">
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-gray-500/5 transition-colors">
                <td className="w-8 pr-4 text-right select-none text-gray-400 dark:text-gray-500 text-xs font-semibold align-top pt-[2px]">
                  {idx + 1}
                </td>
                <td className="whitespace-pre pl-2 font-mono">
                  {renderHighlightedLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
