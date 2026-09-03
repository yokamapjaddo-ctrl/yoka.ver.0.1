export default function ImagePlaceholder({ label = '写真', height = 92, width = '100%', radius = 12 }) {
  return (
    <div className="ph" style={{ height, width, borderRadius: radius, flex: 'none' }}>
      <span>{label}</span>
    </div>
  );
}
