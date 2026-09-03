export default function Chip({ children, active = false, onClick }) {
  return (
    <button className={active ? 'chip chip--on' : 'chip'} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}
