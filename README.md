# YOKA v0.1 — React + Vite → Capacitor(iOS)

「その街に住んでいる年数や家族構成に左右されず、生活に必要な地域情報へ同じようにアクセスできる状態をつくる」

## 開発
```bash
npm install
cp .env.example .env
npm run dev
```

## iOS 化（Capacitor）
```bash
npm run build
npx cap add ios
npm run cap:sync
npm run cap:open   # Xcode で実機/シミュレータ実行
```

## 設計方針
- **画面は表示のみ**。データは `src/services/*` 経由でのみ取得（`useAsync` フック層まで）。
- `src/services/dataSource.js` が `VITE_DATA_SOURCE=mock|supabase` を見て実装を差し替える。
  `mockSource` と `supabaseSource` は同じ `list()/get()` シグネチャ。
- 全レコードに `municipality_id`。自治体は `data/mock/municipalities.js`（将来 `municipalities` テーブル）から取得し、
  画面側に市区町村名をハードコードしない。
- APIキーはフロントに埋め込まない。外部自治体API・気象APIは Supabase Edge Function 経由で呼ぶ（`weatherService` のコメント参照）。
- safe area は `--safe-top / --safe-bottom`（`env(safe-area-inset-*)`）を CSS 変数化して各画面で使用。

## ディレクトリ
```
src/
  components/   ui/ layout/ home/ news/ map/   再利用UI
  context/      MunicipalityContext（選択地域の保存・復元）
  data/mock/    events garbage disaster facilities transport shops notices municipalities
  hooks/        useAsync useFavorites
  lib/          supabaseClient
  screens/      7画面
  services/     カテゴリ別サービス層 + sources/(mock|supabase)
  styles/       global.css（デザイントークン）
  utils/        date
```
