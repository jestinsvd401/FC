export function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" />
    </svg>
  );
}

export function ScoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h10v16l-5-3-5 3z" />
    </svg>
  );
}

export function EventIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 4v16M6 5h9l-2 3 2 3H6" />
    </svg>
  );
}

export function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 14.2 9H20l-4.6 3.5 1.8 5.5L12 14.8 6.8 18l1.8-5.5L4 9h5.8z" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6h14v9H8l-3 3z" />
    </svg>
  );
}

export function LoginIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 7V5H5v14h5v-2M10 12h9M16 9l3 3-3 3" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 19c1.2-3 3.2-4.5 6-4.5S16.8 16 18 19" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 5.5 18.5 10 8 20.5H3.5V16z" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14M9 7V5h6v2M8 7l1 13h6l1-13" />
    </svg>
  );
}

export function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {direction === "left" ? <path d="M14 6 8 12l6 6" /> : <path d="M10 6l6 6-6 6" />}
    </svg>
  );
}

export function StatusIcon({ status }: { status: string }) {
  if (status === "present") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5 10 17l9-10" />
      </svg>
    );
  }
  if (status === "absent") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7l10 10M17 7 7 17" />
      </svg>
    );
  }
  if (status === "late") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 8v5l3 2" />
      </svg>
    );
  }
  if (status === "excused") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 12h12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
