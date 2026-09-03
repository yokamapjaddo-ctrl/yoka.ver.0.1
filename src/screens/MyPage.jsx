import { useMunicipality } from '../context/MunicipalityContext.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import ScreenHeader from '../components/layout/ScreenHeader.jsx';
import ListRow from '../components/ui/ListRow.jsx';
import Icon from '../components/ui/Icon.jsx';

export default function MyPage() {
  const { municipality, areaName } = useMunicipality();
  const { count } = useFavorites();

  return (
    <div className="screen">
      <ScreenHeader title="マイページ" right={
        <button aria-label="設定" style={{ width: 44, height: 44, display: 'grid', placeItems: 'center' }}>
          <Icon name="gear" size={20} color="var(--navy)" strokeWidth={1.8} />
        </button>
      } />

      <div style={{ background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '0 16px 20px' }}>
        <div style={{ width: 74, height: 74, borderRadius: '50%', background: '#e3e8f0', display: 'grid', placeItems: 'center' }}>
          <Icon name="user" size={38} color="#98a4b7" strokeWidth={1.6} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>ゲストユーザー</div>
        <div className="sub">{municipality?.name} {areaName}</div>
        <button style={{ minHeight: 38, padding: '0 18px', borderRadius: 19, background: '#f1f4f9', fontSize: 13.5, fontWeight: 600, color: 'var(--navy)' }}>
          プロフィールを編集
        </button>
      </div>

      <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--sub)', margin: '22px 20px 8px' }}>便利な機能</h2>
      <div className="card" style={{ margin: '0 16px', overflow: 'hidden' }}>
        <ListRow label="お気に入り" right={`${count}件`} onClick={() => {}} />
        <ListRow label="閲覧履歴" onClick={() => {}} />
        <ListRow label="お知らせ設定" onClick={() => {}} />
        <ListRow label="ごみ収集エリア設定" right={areaName} onClick={() => {}} />
        <ListRow label="地域を変更" right={municipality?.name} to="/settings/region" />
      </div>

      <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--sub)', margin: '22px 20px 8px' }}>サポート</h2>
      <div className="card" style={{ margin: '0 16px', overflow: 'hidden' }}>
        <ListRow label="使い方ガイド" onClick={() => {}} />
        <ListRow label="お問い合わせ" onClick={() => {}} />
        <ListRow label="このアプリについて" right="v0.1" chevron={false} onClick={() => {}} />
      </div>
    </div>
  );
}
