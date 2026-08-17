import { Fragment, useMemo, useState, type ReactNode } from 'react';
import styles from './RichTextContent.module.css';

interface RichTextContentProps {
  html: string;
}

const blockedTags = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math']);
const tokenPattern =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Za-z][^>]*>|\b(?:async|await|class|const|else|export|for|from|function|if|import|interface|let|new|return|type|var|while)\b)/g;

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

const highlightCode = (code: string) => {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of code.matchAll(tokenPattern)) {
    const index = match.index ?? 0;
    const token = match[0];
    const tokenClass =
      token.startsWith('//') || token.startsWith('/*')
        ? styles.comment
        : token.startsWith('"') || token.startsWith("'") || token.startsWith('`')
          ? styles.string
          : token.startsWith('<')
            ? styles.jsx
            : styles.keyword;
    if (index > cursor) nodes.push(code.slice(cursor, index));
    nodes.push(
      <span className={tokenClass} key={`${index}-${token}`}>
        {token}
      </span>,
    );
    cursor = index + token.length;
  }

  if (cursor < code.length) nodes.push(code.slice(cursor));
  return nodes;
};

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={styles.codeBlock}>
      <pre>
        <code>{highlightCode(code.trim())}</code>
      </pre>
      <button
        className={styles.copyButton}
        type="button"
        aria-label={copied ? 'Код скопирован' : 'Скопировать код'}
        title={copied ? 'Скопировано' : 'Скопировать'}
        onClick={copy}
      >
        {copied ? (
          <span className={styles.check} aria-hidden="true">
            ✓
          </span>
        ) : (
          <span className={styles.copyIcon} aria-hidden="true">
            <i />
            <i />
          </span>
        )}
      </button>
    </div>
  );
};

const safeHref = (href: string | null) => {
  if (!href) return undefined;

  try {
    const url = new URL(href, window.location.origin);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? href : undefined;
  } catch {
    return undefined;
  }
};

const renderNode = (node: Node, key: string): ReactNode => {
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1) return null;

  const element = node as Element;
  const tag = element.tagName.toLocaleLowerCase();
  if (blockedTags.has(tag)) return null;
  if (tag === 'pre') return <CodeBlock code={element.textContent ?? ''} key={key} />;

  const children = Array.from(element.childNodes).map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );

  switch (tag) {
    case 'p':
      return <p key={key}>{children}</p>;
    case 'strong':
    case 'b':
      return <strong key={key}>{children}</strong>;
    case 'em':
    case 'i':
      return <em key={key}>{children}</em>;
    case 'u':
      return <u key={key}>{children}</u>;
    case 'ul':
      return <ul key={key}>{children}</ul>;
    case 'ol':
      return <ol key={key}>{children}</ol>;
    case 'li':
      return <li key={key}>{children}</li>;
    case 'h2':
      return <h2 key={key}>{children}</h2>;
    case 'h3':
      return <h3 key={key}>{children}</h3>;
    case 'h4':
      return <h4 key={key}>{children}</h4>;
    case 'blockquote':
      return <blockquote key={key}>{children}</blockquote>;
    case 'code':
      return (
        <code className={styles.inlineCode} key={key}>
          {children}
        </code>
      );
    case 'br':
      return <br key={key} />;
    case 'a': {
      const href = safeHref(element.getAttribute('href'));
      return href ? (
        <a href={href} key={key} rel="noreferrer" target="_blank">
          {children}
        </a>
      ) : (
        <Fragment key={key}>{children}</Fragment>
      );
    }
    default:
      return <Fragment key={key}>{children}</Fragment>;
  }
};

const parseHtml = (html: string) => {
  if (typeof DOMParser === 'undefined') return [html];
  const document = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(document.body.childNodes).map((node, index) => renderNode(node, String(index)));
};

export const RichTextContent = ({ html }: RichTextContentProps) => {
  const content = useMemo(() => parseHtml(html), [html]);
  return <div className={styles.content}>{content}</div>;
};
