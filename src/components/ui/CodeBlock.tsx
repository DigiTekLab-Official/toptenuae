import type { ComponentType, CSSProperties, ReactNode } from 'react';
// @ts-ignore - react-syntax-highlighter does not publish types for deep CJS paths
import prismLightModule from 'react-syntax-highlighter/dist/cjs/prism-light.js';
// @ts-ignore
import javascriptModule from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript.js';
// @ts-ignore
import typescriptModule from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript.js';
// @ts-ignore
import cssModule from 'react-syntax-highlighter/dist/cjs/languages/prism/css.js';
// @ts-ignore
import bashModule from 'react-syntax-highlighter/dist/cjs/languages/prism/bash.js';
// @ts-ignore
import jsonModule from 'react-syntax-highlighter/dist/cjs/languages/prism/json.js';
// @ts-ignore
import markupModule from 'react-syntax-highlighter/dist/cjs/languages/prism/markup.js';

// Tell TypeScript exactly what props the deep-imported component accepts.
interface SyntaxHighlighterProps {
  children: ReactNode;
  language?: string;
  style?: any;
  customStyle?: CSSProperties;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
}

type SyntaxHighlighterComponent = ComponentType<SyntaxHighlighterProps> & {
  registerLanguage: (name: string, language: unknown) => void;
};

// Vite's SSR loader and native ESM wrap these CJS modules differently. Unwrap
// either shape instead of assuming the first `default` is the component.
const unwrapDefault = <T,>(module: unknown): T => {
  let value = module as any;
  while (value && typeof value === 'object' && 'default' in value) {
    value = value.default;
  }
  return value as T;
};

// Light build: register only the languages used on the site. Synchronous
// imports are intentional: Astro renders this React tree on the server without
// client hydration, so React.lazy would leave the Suspense fallback in HTML.
const SyntaxHighlighter = unwrapDefault<SyntaxHighlighterComponent>(prismLightModule);
const javascript = unwrapDefault<unknown>(javascriptModule);
const typescript = unwrapDefault<unknown>(typescriptModule);
const stylesheet = unwrapDefault<unknown>(cssModule);
const shell = unwrapDefault<unknown>(bashModule);
const jsonLanguage = unwrapDefault<unknown>(jsonModule);
const markup = unwrapDefault<unknown>(markupModule);

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('css', stylesheet);
SyntaxHighlighter.registerLanguage('bash', shell);
SyntaxHighlighter.registerLanguage('shell', shell);
SyntaxHighlighter.registerLanguage('json', jsonLanguage);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('xml', markup);

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
    </div>
  );
}
