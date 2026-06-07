export default function Avatar({ user, name, image, online, size = 'h-11 w-11' }) {
  const displayName = name || user?.name || user?.email || 'CS';
  const photo = image || user?.profileImage;
  return (
    <div className={`relative shrink-0 ${size}`}>
      {photo ? (
        <img src={photo} alt={displayName} className="h-full w-full rounded-2xl object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 font-black text-white">
          {displayName.slice(0, 2).toUpperCase()}
        </div>
      )}
      {online && <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />}
    </div>
  );
}
