
import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Image as ImageIcon, 
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Quote, Link as LinkIcon,
  Undo, Redo, Type, Palette, Table, Code, Minus, Eraser
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageRequest: () => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, onImageRequest }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showSource, setShowSource] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  // Sync initial value
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value && !showSource) {
      if (value === '' || Math.abs(value.length - contentRef.current.innerHTML.length) > 5) {
         contentRef.current.innerHTML = value;
      }
    }
  }, [value, showSource]);

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
  }

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (contentRef.current) onChange(contentRef.current.innerHTML);
    contentRef.current?.focus();
    checkActiveFormats();
  };

  const checkActiveFormats = () => {
      const formats = [];
      if (document.queryCommandState('bold')) formats.push('bold');
      if (document.queryCommandState('italic')) formats.push('italic');
      if (document.queryCommandState('underline')) formats.push('underline');
      if (document.queryCommandState('insertUnorderedList')) formats.push('ul');
      if (document.queryCommandState('insertOrderedList')) formats.push('ol');
      setActiveFormats(formats);
  }

  const insertTable = () => {
      const html = `
        <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Başlık 1</th>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Başlık 2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">Veri 1</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">Veri 2</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">Veri 3</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">Veri 4</td>
                </tr>
            </tbody>
        </table>
        <p><br/></p>
      `;
      document.execCommand('insertHTML', false, html);
      handleInput();
  };

  const isActive = (cmd: string) => activeFormats.includes(cmd) ? 'bg-brand-100 text-brand-700' : 'hover:bg-slate-200 text-slate-700';

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white flex flex-col h-[650px] shadow-sm">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-col gap-2 sticky top-0 z-10 select-none">
        
        {/* Row 1: Main Formatting */}
        <div className="flex flex-wrap gap-1 items-center">
            <div className="flex gap-1 border-r border-slate-300 pr-2 mr-1">
                <select 
                    onChange={(e) => execCommand('formatBlock', e.target.value)} 
                    className="h-8 text-xs border border-slate-300 rounded px-1 outline-none bg-white min-w-[100px]"
                >
                    <option value="P">Paragraf</option>
                    <option value="H2">Başlık 2 (H2)</option>
                    <option value="H3">Başlık 3 (H3)</option>
                    <option value="H4">Başlık 4 (H4)</option>
                    <option value="PRE">Kod Bloğu</option>
                    <option value="BLOCKQUOTE">Alıntı</option>
                </select>
            </div>

            <div className="flex gap-1 border-r border-slate-300 pr-2 mr-1">
                <button onClick={() => execCommand('bold')} title="Kalın (Ctrl+B)" className={`p-1.5 rounded ${isActive('bold')}`}><Bold className="w-4 h-4" /></button>
                <button onClick={() => execCommand('italic')} title="İtalik (Ctrl+I)" className={`p-1.5 rounded ${isActive('italic')}`}><Italic className="w-4 h-4" /></button>
                <button onClick={() => execCommand('underline')} title="Altı Çizili (Ctrl+U)" className={`p-1.5 rounded ${isActive('underline')}`}><Underline className="w-4 h-4" /></button>
                <button onClick={() => execCommand('strikeThrough')} title="Üstü Çizili" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><span className="line-through font-bold text-xs">S</span></button>
            </div>

            <div className="flex gap-1 border-r border-slate-300 pr-2 mr-1">
                <div className="flex items-center gap-1 px-1">
                    <Type className="w-3 h-3 text-slate-500" />
                    <input 
                        type="color" 
                        onChange={(e) => execCommand('foreColor', e.target.value)}
                        className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
                        title="Yazı Rengi"
                    />
                </div>
                 <div className="flex items-center gap-1 px-1">
                    <Palette className="w-3 h-3 text-slate-500" />
                    <input 
                        type="color" 
                        onChange={(e) => execCommand('hiliteColor', e.target.value)}
                        className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
                        title="Arkaplan Rengi"
                        defaultValue="#ffffff"
                    />
                </div>
            </div>

            <div className="flex gap-1 border-r border-slate-300 pr-2 mr-1">
                <button onClick={() => execCommand('justifyLeft')} title="Sola Yasla" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><AlignLeft className="w-4 h-4" /></button>
                <button onClick={() => execCommand('justifyCenter')} title="Ortala" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><AlignCenter className="w-4 h-4" /></button>
                <button onClick={() => execCommand('justifyRight')} title="Sağa Yasla" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><AlignRight className="w-4 h-4" /></button>
            </div>
            
            <button 
                onClick={() => setShowSource(!showSource)} 
                className={`ml-auto px-2 py-1 text-xs font-bold rounded flex items-center gap-1 ${showSource ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}
            >
                <Code className="w-3 h-3" /> {showSource ? 'Görsel Editör' : 'HTML Kaynak'}
            </button>
        </div>

        {/* Row 2: Inserts & Lists */}
        <div className="flex flex-wrap gap-1 items-center border-t border-slate-200 pt-1">
             <div className="flex gap-1 border-r border-slate-300 pr-2 mr-1">
                <button onClick={() => execCommand('insertUnorderedList')} title="Madde İşaretli Liste" className={`p-1.5 rounded ${isActive('ul')}`}><List className="w-4 h-4" /></button>
                <button onClick={() => execCommand('insertOrderedList')} title="Sıralı Liste" className={`p-1.5 rounded ${isActive('ol')}`}><ListOrdered className="w-4 h-4" /></button>
            </div>

            <div className="flex gap-1 border-r border-slate-300 pr-2 mr-1">
                <button onClick={() => {
                    const url = prompt('Link adresi (https://...):');
                    if(url) execCommand('createLink', url);
                }} title="Link Ekle" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><LinkIcon className="w-4 h-4" /></button>
                
                <button onClick={() => execCommand('unlink')} title="Linki Kaldır" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 relative">
                    <LinkIcon className="w-4 h-4" />
                    <Minus className="w-3 h-3 absolute top-0 right-0 text-red-500 bg-white rounded-full" />
                </button>
            </div>

            <div className="flex gap-1 border-r border-slate-300 pr-2 mr-1">
                 <button onClick={onImageRequest} title="Medya Ekle (Resim)" className="flex items-center gap-1 px-2 py-1 hover:bg-brand-100 text-brand-700 rounded bg-brand-50 text-xs font-bold">
                    <ImageIcon className="w-4 h-4" /> Medya Ekle
                 </button>
                 <button onClick={insertTable} title="Tablo Ekle" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Table className="w-4 h-4" /></button>
                 <button onClick={() => execCommand('insertHorizontalRule')} title="Yatay Çizgi" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Minus className="w-4 h-4" /></button>
            </div>

            <div className="flex gap-1">
                <button onClick={() => execCommand('removeFormat')} title="Biçimlendirmeyi Temizle" className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded"><Eraser className="w-4 h-4" /></button>
                <button onClick={() => execCommand('undo')} title="Geri Al" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Undo className="w-4 h-4" /></button>
                <button onClick={() => execCommand('redo')} title="İleri Al" className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Redo className="w-4 h-4" /></button>
            </div>
        </div>
      </div>

      {/* Editor Content Area */}
      {showSource ? (
           <textarea 
                value={value} 
                onChange={handleSourceChange}
                className="flex-1 p-4 font-mono text-sm bg-slate-900 text-green-400 outline-none resize-none"
           />
      ) : (
          <div 
            ref={contentRef}
            className="editor-content flex-1 p-8 outline-none overflow-y-auto text-slate-800 text-lg leading-relaxed bg-white"
            contentEditable
            onInput={handleInput}
            onKeyUp={checkActiveFormats}
            onMouseUp={checkActiveFormats}
            suppressContentEditableWarning
            style={{ minHeight: '400px' }}
          >
          </div>
      )}
      
      <div className="bg-slate-50 px-4 py-2 text-xs text-slate-500 border-t border-slate-200 flex justify-between">
         <span>Kelime: {value.replace(/<[^>]*>/g, '').trim().split(/\s+/).length}</span>
         <span>{showSource ? 'HTML Modu' : 'Görsel Mod'}</span>
      </div>
    </div>
  );
};
