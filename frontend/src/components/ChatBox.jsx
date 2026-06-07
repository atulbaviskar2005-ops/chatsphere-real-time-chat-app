import { Image, Mic, Paperclip, Send, Smile, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import Avatar from './Avatar';

const quickEmoji = [':)', ':fire:', ':ok:', ':thanks:', ':idea:', ':rocket:'];

export default function ChatBox({ title, subtitle, avatar, online, messages, currentEmail, typing, onSend, onUpload, onEdit, onDelete }) {
  const [content, setContent] = useState('');
  const [reply, setReply] = useState(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, typing]);

  const submit = (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    onSend?.({ content: content.trim(), replyToMessageId: reply?.id });
    setContent('');
    setReply(null);
  };

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      await onUpload?.(file);
    } catch (error) {
      setUploadError(error?.response?.data?.error || error?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="glass flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-none md:rounded-2xl">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={title} image={avatar} online={online} />
          <div className="min-w-0">
            <h1 className="truncate text-base font-black md:text-lg">{title || 'Select a conversation'}</h1>
            <p className="truncate text-xs text-slate-400">{online ? 'Online' : subtitle || 'Messages stay in sync across devices'}</p>
          </div>
        </div>
      </header>
      <div className="scrollbar-soft flex-1 overflow-y-auto py-4">
        {messages?.length ? messages.map((message) => (
          <MessageBubble
            key={message.id || `${message.createdAt}-${message.content}`}
            message={message}
            mine={message.senderEmail === currentEmail}
            onReply={setReply}
            onEdit={(item) => {
              const next = window.prompt('Edit message', item.content || '');
              if (next !== null) onEdit?.(item.id, next);
            }}
            onDelete={(item) => onDelete?.(item.id)}
          />
        )) : (
          <div className="grid h-full place-items-center px-8 text-center text-slate-400">
            <div>
              <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-teal-400/10 text-teal-200"><Image size={32} /></div>
              <h2 className="text-lg font-black text-white">No messages yet</h2>
              <p className="mt-1 text-sm">Start the conversation with a quick note, file, or voice update.</p>
            </div>
          </div>
        )}
        {typing && <TypingIndicator label={typing} />}
        <div ref={bottomRef} />
      </div>
      {reply && (
        <div className="mx-4 mb-2 flex items-center justify-between rounded-xl border-l-2 border-teal-300 bg-slate-900/80 px-3 py-2 text-sm">
          <span className="truncate text-slate-300">Replying to {reply.content || reply.fileName}</span>
          <button type="button" onClick={() => setReply(null)}><X size={16} /></button>
        </div>
      )}
      {(uploading || uploadError) && (
        <div className={`mx-4 mb-2 rounded-xl px-3 py-2 text-sm ${uploadError ? 'bg-rose-500/15 text-rose-100' : 'bg-teal-500/15 text-teal-100'}`}>
          {uploadError || 'Uploading file...'}
        </div>
      )}
      <form onSubmit={submit} className="relative flex items-end gap-2 border-t border-white/10 p-3">
        <label title="Attach file" className="btn btn-ghost h-11 w-11 cursor-pointer p-0">
          <Paperclip size={18} />
          <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={(event) => uploadFile(event.target.files?.[0])} />
        </label>
        <button type="button" title="Emoji" onClick={() => setEmojiOpen((value) => !value)} className="btn btn-ghost h-11 w-11 p-0"><Smile size={18} /></button>
        {emojiOpen && (
          <div className="absolute bottom-16 left-16 flex gap-1 rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl">
            {quickEmoji.map((emoji) => <button type="button" key={emoji} className="h-9 rounded-xl px-2 text-xs hover:bg-white/10" onClick={() => setContent((value) => `${value}${emoji}`)}>{emoji}</button>)}
          </div>
        )}
        <textarea rows={1} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Message ChatSphere..." className="input max-h-32 min-h-11 flex-1 resize-none" />
        <button type="button" title="Voice note" className="btn btn-ghost h-11 w-11 p-0"><Mic size={18} /></button>
        <button title="Send" className="btn btn-primary h-11 w-11 p-0"><Send size={18} /></button>
      </form>
    </section>
  );
}
