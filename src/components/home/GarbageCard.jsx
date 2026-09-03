import { Link } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import ImagePlaceholder from '../ui/ImagePlaceholder.jsx';
import { formatMonthDay, weekdayJa } from '../../utils/date.js';

export default function GarbageCard({ today, next }) {
  return (
    <Card style={{ margin: '14px 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>今日のごみ</h2>
        <Link to="/calendar" style={{ fontSize: 13, fontWeight: 500 }}>詳しく見る 〉</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 14 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{today ? today.type : '収集はありません'}</div>
          {next && (
            <>
              <div className="sub" style={{ marginTop: 16 }}>次回の収集日</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--navy)' }}>
                {formatMonthDay(next.date)} <span style={{ fontSize: 19 }}>({weekdayJa(next.date)})</span>
              </div>
              <div className="sub" style={{ marginTop: 4 }}>{next.type}</div>
            </>
          )}
        </div>
        <ImagePlaceholder label="ごみ袋 図版" height={96} width={96} radius={16} />
      </div>
    </Card>
  );
}
