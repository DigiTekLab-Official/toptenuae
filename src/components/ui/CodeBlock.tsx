import { lazy, Suspense } from 'react';

// 1. Tell TypeScript exactly what props this lazy component accepts
interface SyntaxHighlighterProps {
  children: React.ReactNode;
  language?: string;
  style?: any;
  customStyle?: React.CSSProperties;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
}

// 2. Light build: only includes registered languages (~50KB vs ~1.6MB)
const SyntaxHighlighter = lazy(
  // @ts-ignore - Bypassing missing TS definitions for this deep CJS path
  () => import('react-syntax-highlighter/dist/cjs/prism-light').then(mod => ({ 
    default: mod.default as React.ComponentType<SyntaxHighlighterProps> 
  }))
);

// Register only the languages actually used on the site
const registerLanguages = async () => {
  const [{ default: SHL }, js, ts, css, bash, json, html] = await Promise.all([
    // @ts-ignore
    import('react-syntax-highlighter/dist/cjs/prism-light'),
    // @ts-ignore
    import('react-syntax-highlighter/dist/cjs/languages/prism/javascript'),
    // @ts-ignore
    import('react-syntax-highlighter/dist/cjs/languages/prism/typescript'),
    // @ts-ignore
    import('react-syntax-highlighter/dist/cjs/languages/prism/css'),
    // @ts-ignore
    import('react-syntax-highlighter/dist/cjs/languages/prism/bash'),
    // @ts-ignore
    import('react-syntax-highlighter/dist/cjs/languages/prism/json'),
    // @ts-ignore
    import('react-syntax-highlighter/dist/cjs/languages/prism/markup'),
  ]);
  
  SHL.registerLanguage('javascript', js.default);
  SHL.registerLanguage('js', js.default);
  SHL.registerLanguage('typescript', ts.default);
  SHL.registerLanguage('ts', ts.default);
  SHL.registerLanguage('css', css.default);
  SHL.registerLanguage('bash', bash.default);
  SHL.registerLanguage('shell', bash.default);
  SHL.registerLanguage('json', json.default);
  SHL.registerLanguage('html', html.default);
  SHL.registerLanguage('xml', html.default);
};
registerLanguages();

const vscDarkPlus = {
  'hljs': {
    'display': 'block',
    'overflowX': 'auto',
    'padding': '0.5em',
    'background': '#1e1e1e',
    'color': '#d4d4d4'
  }
} as const;

interface CodeBlockProps {
  value: {
    code: string;
    language?: string;
    filename?: string;
  };
}

export default function CodeBlock({ value }: CodeBlockProps) {
  if (!value?.code) return null;

  return (
    <div className="my-8 rounded-lg overflow-hidden shadow-xl text-sm bg-[#1e1e1e] border border-[#333]">
      {/* Mac-style Window Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        {value.filename && (
          <span className="ml-2 font-mono text-xs text-gray-400 select-none">
            {value.filename}
          </span>
        )}
      </div>

      {/* The Highlighter */}
      <Suspense fallback={<div className="p-6 text-gray-400 text-sm">Loading code block...</div>}>
        <SyntaxHighlighter
          language={value.language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            backgroundColor: '#1e1e1e',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {value.code}
        </SyntaxHighlighter>
      </Suspense>
    </div>
  );
}