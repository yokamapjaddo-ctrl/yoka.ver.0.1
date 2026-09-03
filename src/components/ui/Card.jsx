export default function Card({ children, pad = true, style }) {
  return <section className={pad ? 'card card--pad' : 'card'} style={style}>{children}</section>;
}
