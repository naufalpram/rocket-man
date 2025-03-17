import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';

type MarkdownProps = {
  content: string
  id?: string
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
    const tokens = marked.lexer(markdown);
    return tokens.map(token => token.raw);
  }
  

const MemoizedMarkdownBlock = memo(({ content }: MarkdownProps) => {
  return (
    <ReactMarkdown>
      {content}
    </ReactMarkdown>
  );
}, (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
});

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

const MemoizedMarkdown = ({ content, id }: MarkdownProps) => {
  const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);
  return (
    <div className="prose dark:prose-invert max-w-none">
      {blocks.map((block, index) => (
        <MemoizedMarkdownBlock key={`${id}-block_${index}`} content={block} />
      ))}
    </div>
  );
};

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

export default MemoizedMarkdown;
