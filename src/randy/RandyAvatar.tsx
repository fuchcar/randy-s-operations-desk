export function RandyAvatar({
  size = 28,
  className = "",
  ring = false,
}: {
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span
      className={
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--surface-2)] " +
        (ring ? "ring-1 ring-[color:var(--gold-soft)]/40 " : "") +
        className
      }
      style={{ width: size, height: size }}
      aria-label="Randy"
    >
      <img
        src="/randy.png"
        alt="Randy"
        width={size}
        height={size}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </span>
  );
}
