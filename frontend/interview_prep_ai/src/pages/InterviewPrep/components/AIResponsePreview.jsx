import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LuCopy, LuCheck, LuCode } from 'react-icons/lu';

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg overflow-hidden border border-gray-700 bg-zinc-900 text-white">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-800 text-xs font-semibold uppercase tracking-wide text-gray-400">
        <div className="flex items-center gap-2">
          <LuCode size={16} />
          {language || 'Code'}
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition"
        >
          {copied ? <LuCheck size={16} className="text-green-400" /> : <LuCopy size={16} />}
          <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: 12.5 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const AIResponsePreview = ({ content }) => {
  if (!content || !content.explanation) return null;

  return (
    <div className="prose dark:prose-invert prose-sm max-w-none text-gray-100">
      <ReactMarkdown
        children={content.explanation}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock code={String(children).replace(/\n$/, '')} language={match[1]} />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      />
    </div>
  );
};

export default AIResponsePreview;
