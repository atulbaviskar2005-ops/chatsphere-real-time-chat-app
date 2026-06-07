import { Check, CheckCheck, FileText, Pencil, Reply, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { timeLabel } from '../utils/date';

export default function MessageBubble({ message, mine, onReply, onEdit, onDelete }) {
  const statusIcon = message.status === 'SEEN' ? <CheckCheck size={14} className="text-sky-200" /> : message.status === 'DELIVERED' ? <CheckCheck size={14} /> : <Check size={14} />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`group flex ${mine ? 'justify-end' : 'justify-start'} px-3 py-1`}>
      <div className={`max-w-[82%] rounded-2xl px-3.5 py-2 shadow-lg md:max-w-[62%] ${mine ? 'bubble-me rounded-br-md' : 'bubble-other rounded-bl-md'}`}>
        {message.replyToMessageId && <div className="mb-2 rounded-lg border-l-2 border-teal-300 bg-black/20 px-2 py-1 text-xs text-slate-200">Replying to a message</div>}
        {message.deleted ? (
          <p className="text-sm italic text-slate-300">This message was deleted</p>
        ) : (
          <>
            {message.fileUrl && (
              <a className="mb-2 flex items-center gap-2 rounded-xl bg-black/20 p-2 text-sm hover:bg-black/30" href={message.fileUrl} target="_blank" rel="noreferrer">
                {message.messageType === 'IMAGE' ? <img src={message.fileUrl} alt={message.fileName || 'attachment'} className="h-28 w-40 rounded-lg object-cover" /> : <FileText size={18} />}
                <span className="truncate">{message.fileName || 'Attachment'}</span>
              </a>
            )}
            {message.content && <p className="whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed">{message.content}</p>}
          </>
        )}
        <div className="mt-1 flex items-center justify-end gap-1.5 text-[0.68rem] text-white/70">
          {message.edited && <span>edited</span>}
          <span>{timeLabel(message.createdAt)}</span>
          {mine && statusIcon}
        </div>
        {mine && !message.deleted && (
          <div className="mt-1 hidden justify-end gap-1 group-hover:flex">
            <button title="Reply" onClick={() => onReply?.(message)}><Reply size={13} /></button>
            <button title="Edit" onClick={() => onEdit?.(message)}><Pencil size={13} /></button>
            <button title="Delete" onClick={() => onDelete?.(message)}><Trash2 size={13} /></button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
