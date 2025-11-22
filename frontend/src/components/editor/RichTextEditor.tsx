'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] max-w-none prose-invert',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors ${
        isActive
          ? 'bg-cyan-600/30 text-cyan-400'
          : 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className={`border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex flex-wrap gap-1">
        {/* Text Style */}
        <div className="flex gap-1 border-r border-gray-700 pr-2 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-700 pr-2 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-700 pr-2 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Other */}
        <div className="flex gap-1 border-r border-gray-700 pr-2 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            isActive={false}
            title="Horizontal Rule"
          >
            <Minus className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* History */}
        <div className="flex gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            isActive={false}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            isActive={false}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </MenuButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4 bg-gray-900/50">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror {
          padding: 1rem;
          min-height: 200px;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #06b6d4;
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: #9ca3af;
        }

        .ProseMirror code {
          background-color: #1f2937;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
          color: #06b6d4;
        }

        .ProseMirror pre {
          background-color: #1f2937;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }

        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: #e5e7eb;
        }

        .ProseMirror hr {
          border: none;
          border-top: 1px solid #374151;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}