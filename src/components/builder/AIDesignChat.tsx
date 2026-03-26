import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, X, Sparkles, Loader2, ImagePlus } from 'lucide-react';
import type { BuilderPage } from '@/types/builder';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string | MessageContent[];
  displayContent?: string; // human-readable version for display
  isPageJson?: boolean;
}

type MessageContent = 
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

interface Props {
  page: BuilderPage;
  onApplyPageUpdate: (page: BuilderPage) => void;
}

function isLikelyPageJson(text: string): boolean {
  const trimmed = text.trim();
  let json = trimmed;
  if (json.startsWith('```')) {
    json = json.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
  }
  try {
    const parsed = JSON.parse(json);
    return parsed && Array.isArray(parsed.sections);
  } catch {
    return false;
  }
}

export function AIDesignChat({ page, onApplyPageUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamingJson, setIsStreamingJson] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
      setAttachedImageName(file.name);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Build message content
    let userContent: string | MessageContent[];
    let displayContent = trimmed;

    if (attachedImage) {
      userContent = [
        { type: 'text', text: trimmed },
        { type: 'image_url', image_url: { url: attachedImage } },
      ];
      displayContent = `📎 ${attachedImageName}\n${trimmed}`;
    } else {
      userContent = trimmed;
    }

    const userMsg: Message = { role: 'user', content: userContent, displayContent };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setAttachedImage(null);
    setAttachedImageName('');
    setIsLoading(true);
    setIsStreamingJson(false);

    let assistantContent = '';

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/design-assistant`;
      
      // Serialize messages for the API - convert content arrays to the format the edge function expects
      const apiMessages = newMessages.map(m => {
        if (Array.isArray(m.content)) {
          return { role: m.role, content: m.content };
        }
        return { role: m.role, content: m.content };
      });

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          pageState: page,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error('No response stream');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              
              // Detect if this looks like JSON being streamed — show a thinking indicator instead
              const trimmedSoFar = assistantContent.trim();
              const looksLikeJson = trimmedSoFar.startsWith('{') || trimmedSoFar.startsWith('```');
              setIsStreamingJson(looksLikeJson);

              if (!looksLikeJson) {
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last?.role === 'assistant' && !last.isPageJson) {
                    return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                  }
                  return [...prev, { role: 'assistant', content: assistantContent }];
                });
              }
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Try to apply as page JSON
      const applied = tryApplyUpdate(assistantContent);
      setIsStreamingJson(false);
      
      if (!applied) {
        // It was regular text — make sure final content is shown
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && !last.isPageJson) {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
          }
          return [...prev, { role: 'assistant', content: assistantContent }];
        });
      }
    } catch (err: any) {
      setIsStreamingJson(false);
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, page, onApplyPageUpdate]);

  const tryApplyUpdate = (content: string): boolean => {
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
      }
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.sections && Array.isArray(parsed.sections)) {
        onApplyPageUpdate(parsed);
        setMessages(prev => [...prev, { role: 'assistant', content: '✅ Design updated! Check the canvas.' }]);
        return true;
      }
    } catch {
      // Not valid page JSON
    }
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    'Change the hero background to dark',
    'Add a new section with 3 feature cards',
    'Make the navbar links uppercase',
    'Change all button colors to gold',
  ];

  // Filter out messages marked as page JSON
  const visibleMessages = messages.filter(m => !m.isPageJson);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[560px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI Design Assistant</h3>
                <p className="text-[10px] text-muted-foreground">Describe changes to your design</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {visibleMessages.length === 0 && !isStreamingJson && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">How can I help?</p>
                  <p className="text-xs text-muted-foreground mt-1">Describe design changes and I'll update your page</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(s); inputRef.current?.focus(); }}
                      className="text-[11px] px-3 py-1.5 bg-muted hover:bg-accent border border-border rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {visibleMessages.map((msg, i) => {
              const displayText = msg.displayContent || (typeof msg.content === 'string' ? msg.content : 
                (msg.content as MessageContent[]).filter(c => c.type === 'text').map(c => (c as any).text).join(''));
              const hasImage = Array.isArray(msg.content) && msg.content.some(c => c.type === 'image_url');
              
              return (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:m-0">
                        <ReactMarkdown>{displayText}</ReactMarkdown>
                      </div>
                    ) : (
                      <div>
                        {hasImage && (
                          <div className="mb-1.5 flex items-center gap-1 text-[10px] opacity-80">
                            <ImagePlus className="w-3 h-3" /> Image attached
                          </div>
                        )}
                        <span className="whitespace-pre-wrap">{displayText}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Show thinking indicator when streaming JSON */}
            {(isLoading && (isStreamingJson || visibleMessages[visibleMessages.length - 1]?.role !== 'assistant')) && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl px-4 py-3 rounded-bl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {isStreamingJson ? 'Generating design...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-3 bg-muted/20">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your design changes..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-24"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
