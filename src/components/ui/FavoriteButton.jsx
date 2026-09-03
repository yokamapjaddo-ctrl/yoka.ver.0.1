import Icon from './Icon.jsx';

export default function FavoriteButton({ active, onClick, size = 21 }) {
  return (
    <button onClick={onClick} aria-pressed={active} aria-label="お気に入り"
      style={{ width: 44, height: 44, display: 'grid', placeItems: 'center' }}>
      <Icon name="bookmark" size={size} color="var(--navy)" fill={active ? 'var(--navy)' : 'none'} />
    </button>
  );
}
