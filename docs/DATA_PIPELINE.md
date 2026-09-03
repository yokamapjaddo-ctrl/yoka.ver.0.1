# データ連携パイプライン v0.1（大和市 ごみデータ）

## 1. 全体構成
```
大和市の公開データ(CSV/JSON)
      │  ① GitHub Actions が毎日1回 + 手動で起動
      ▼
scripts/collectors/httpCollector.js   … 取得（HTTPエラー検知・文字コード対応）
      ▼
scripts/transformers/garbageTransformer.js … YOKA内部形式へ整形 + content_hash 計算
      ▼
scripts/services/ingestService.js     … 前回データと差分比較 → 必要な行だけ INSERT / UPDATE
      ▼
Supabase  public.source_records（status: pending / published / inactive）
      ▼
YOKAアプリ（anonキーで status='published' のみ読める）
```

役割分担を1行でいうと、**取得・整形・DB処理をファイルごとに分けてある**ので、
イベントや防災を追加するときは「transformer を1つ足して、config に1行足す」だけで済みます。

## 2. データが流れる順番
1. GitHub Actions がスケジュール（または手動実行）で `scripts/ingest.js` を起動
2. `config/sources.js` が環境変数から SOURCE_URL を解決（URLはコードに書かない）
3. `collectors/httpCollector.js` が HTTP 取得。ステータス異常・ネットワーク異常はここでエラー
4. `transformers/garbageTransformer.js` が行を YOKA 形式へ変換し、中身のハッシュを計算
5. `services/ingestService.js` が Supabase の既存行を読み、差分だけを書き込む
6. 変更がない行は**何も書かない**。今回のデータに無くなった行は `status='inactive'`
7. 件数（取得 / 新規 / 更新 / 変更なし / 非表示化 / 取り込めず）を Actions のログに出力
8. 実行履歴を `public.ingest_runs` にも保存

## 3. 作成したファイル一覧
| ファイル | 役割 |
|---|---|
| `supabase/migrations/0001_source_records.sql` | テーブル定義・RLS・実行ログ表 |
| `scripts/package.json` | 取り込み用の依存（supabase-js, csv-parse） |
| `scripts/.env.example` | ローカル実行用の環境変数見本（値は空） |
| `scripts/config/municipalities.js` | 自治体定義（`yamato_kanagawa` はここだけ） |
| `scripts/config/sources.js` | データ種別と SOURCE_URL の環境変数名 |
| `scripts/collectors/httpCollector.js` | HTTP取得・CSV/JSON判定・Shift_JIS対応 |
| `scripts/transformers/garbageTransformer.js` | **実データ確認後に列名を差し替える箇所** |
| `scripts/services/supabaseAdmin.js` | service role キーでの接続 |
| `scripts/services/ingestService.js` | 差分判定・upsert・inactive化 |
| `scripts/ingest.js` | 実行の入口・ログ出力・終了コード |
| `.github/workflows/ingest-yamato-garbage.yml` | 毎日1回 + 手動実行 |

## 4. Supabase に作るテーブル
- **source_records**（本体）: id, municipality_id, category, title, description, source_url, source_type, license, source_record_id, source_updated_at, fetched_at, verified_at, status, content_hash, payload, raw, created_at, updated_at
  - `unique (municipality_id, category, source_record_id)` … 重複INSERTを防ぐキー
  - `status` は `pending` / `published` / `inactive` の3つだけ許可
  - RLS: アプリからは `published` のみ読める。書き込みは service role だけ
- **ingest_runs**（実行履歴）: 件数とエラー内容。一般ユーザーには非公開

## 5. GitHub Secrets に登録する項目
| 名前 | 内容 |
|---|---|
| `SUPABASE_URL` | Supabase の Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role キー（**フロントには絶対置かない**） |
| `SOURCE_URL_YAMATO_KANAGAWA_GARBAGE` | 大和市ごみデータの配布URL |

（任意）Variables に `SOURCE_TYPE_YAMATO_KANAGAWA_GARBAGE` = `csv` または `json`。未設定なら自動判定。

## 6. あなたが手動でやる必要がある作業
1. Supabase プロジェクトを作り、SQL を実行してテーブルを作る
2. 大和市のオープンデータページで**実際の配布URLとライセンス表記**を確認する
3. GitHub Secrets に3つの値を登録する
4. 実データのCSVヘッダーを見て `garbageTransformer.js` の `FIELD_CANDIDATES` を実列名に直す
5. Actions から手動実行して件数を確認する
6. 内容を確認できたら `status` を `pending` → `published` に変更する（当面は Supabase の表を直接編集）

## 対象データ（v0.1）
大和市の「資源・ごみ関連情報データ（オープンデータ）」ページで公開されている **CSV** を対象にします。
http://www.city.yamato.lg.jp/web/shuushu/opendatagomi.html （ライセンス: CC BY 4.0）

- 第1弾は **資源とごみの分別一覧CSV**（1行1品目 → 区分）。
- **収集日カレンダーはCSV公開が無く PDF のみ**のため、アプリの「今日のごみ／次回収集日」は
  当面モックのままです。将来は PDF 解析または市への提供依頼で対応します。

## 未確定・要差し替え
- 分別一覧CSVの**列名**は未確認です。1回実行すると、取り込めなかった行のヘッダー一覧がログに出るので、
  `garbageTransformer.js` の `FIELD_CANDIDATES` を実列名に合わせてください。
- CSV の直リンクURLはページ上のリンクをコピーして `SOURCE_URL_YAMATO_KANAGAWA_GARBAGE` に入れてください。
- `source_record_id` は元データにID列がある場合それを使い、無い場合は「地区_日付_種別」で組み立てています。実データにID列があれば `FIELD_CANDIDATES.recordId` を絞ってください。
