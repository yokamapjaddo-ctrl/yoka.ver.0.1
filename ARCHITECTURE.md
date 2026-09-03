# YOKA v0.1 設計メモ

## 1. ディレクトリ構成
```
yoka-app/
├─ index.html               viewport-fit=cover（safe area 対応）
├─ vite.config.js           base:'./'（Capacitor の file:// 対応）
├─ capacitor.config.ts      appId / webDir=dist
├─ .env.example             VITE_DATA_SOURCE=mock|supabase など
└─ src/
   ├─ main.jsx / App.jsx / routes.jsx
   ├─ context/MunicipalityContext.jsx   選択地域の保存・復元
   ├─ screens/                          7画面（表示のみ）
   ├─ components/ ui/ layout/ home/ news/ map/
   ├─ hooks/      useAsync / useFavorites
   ├─ services/   カテゴリ別サービス + sources/(mock|supabase)
   ├─ data/mock/  8カテゴリのモック
   ├─ lib/        supabaseClient
   ├─ utils/      date
   └─ styles/     global.css（デザイントークン）
```

## 2. 主要ライブラリ
- react / react-dom 18
- react-router-dom 6（画面遷移）
- @supabase/supabase-js（差し替え先。mock 運用中は未使用でも動く）
- @capacitor/core, @capacitor/cli, @capacitor/ios
- 地図は将来 MapKit JS / Mapbox GL を `components/map/MapCanvas.jsx` にのみ導入

## 3. 画面構成
| 画面 | パス | ファイル |
|---|---|---|
| 初回地域選択 | /onboarding/region, /settings/region | screens/RegionSelect.jsx |
| ホーム | / | screens/Home.jsx |
| マップ | /map | screens/MapScreen.jsx |
| カレンダー | /calendar | screens/CalendarScreen.jsx |
| イベント詳細 | /events/:eventId | screens/EventDetail.jsx |
| 防災・災害情報 | /disaster | screens/Disaster.jsx |
| お知らせ | /notices | screens/Notices.jsx |
| マイページ | /mypage | screens/MyPage.jsx |

下部タブ = ホーム / マップ / カレンダー / お知らせ / マイページ（AppShell + TabBar）。

## 4. コンポーネント設計
- **ui/**: Card, SectionHeader, ListRow, Chip, Badge, ImagePlaceholder, FavoriteButton, CategoryShortcut, Icon
- **layout/**: AppShell（Outlet + TabBar）, TabBar, ScreenHeader
- **home/**: GarbageCard, WeatherPill, DisasterBanner
- **map/**: MapCanvas（地図実装の差し替え点）
- 画面は「サービス呼び出し（useAsync）＋ UI 組み立て」だけを担当。

## 5. データ構造案（全テーブル municipality_id を持つ）
- **municipalities**: id, prefecture, name, status, center{lat,lng}, garbage_areas[], contact
- **garbage**: id, municipality_id, area_id, date, type, color
- **events**: id, municipality_id, title, category, date, start_time, end_time, place, address, lat, lng, description, organizer, contact
- **disaster**: id, municipality_id, kind(alert|evacuation|weather), level, active, title, body, published_at, source
- **facilities**: id, municipality_id, category(public|hospital|park|shelter), name, meta, hours, capacity, lat, lng
- **shops**: id, municipality_id, category(food|super), name, meta, hours, open_now, rating, reviews, lat, lng
- **notices**: id, municipality_id, category, title, published_at, link
- **transport**: id, municipality_id, type, line, station, status, updated_at

## 6. ルーティング設計
- `municipalityId` 未設定なら全パスを `/onboarding/region` にリダイレクト。
- タブ配下の 5 画面は `AppShell` の子ルート（TabBar 常設）。
- 詳細画面（イベント・防災）はタブ外のフルスクリーンで戻るボタン付き。
- Capacitor では `BrowserRouter` のままで可（`base:'./'` + WebView のルートが / になる）。
  もし file:// で 404 になる場合のみ `HashRouter` に切替。

## 7. Capacitor 移行時の注意点
1. `vite.config.js` の `base: './'` は必須（絶対パスはビルド後に壊れる）。
2. `index.html` に `viewport-fit=cover`、CSS は `env(safe-area-inset-*)` を `--safe-top/--safe-bottom` で参照。TabBar は `padding-bottom: var(--safe-bottom)`。
3. `localStorage` は WebView 間で保持されるが、確実性が必要になったら `@capacitor/preferences` に置換（`MunicipalityContext` の 3 行のみ変更）。
4. 位置情報・通知は `@capacitor/geolocation` / `@capacitor/push-notifications` を後付け。呼び出しは services 層に閉じる。
5. 外部 API は CORS と APIキーの問題があるためフロントから直接叩かない。Supabase Edge Function 経由（`weatherService` のコメント参照）。
6. `overscroll-behavior-y: none` とネイティブのバウンス無効化（`ios.contentInset:'never'`）で iOS らしい挙動に。
7. 画面遷移アニメーションが必要になったら `@ionic/react` ではなく CSS transition で足りる範囲に留める（依存を増やさない）。
