export default function TypingIndicator({ label = 'Typing' }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-teal-200">
      <span>{label}</span>
      <span className="flex gap-1">
        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300" />
        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300 [animation-delay:120ms]" />
        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300 [animation-delay:240ms]" />
      </span>
    </div>
  );
}
