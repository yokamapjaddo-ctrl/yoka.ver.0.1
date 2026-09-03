-- YOKA v0.1 : 自治体オープンデータの取り込み先テーブル
-- Supabase ダッシュボード > SQL Editor にこのファイルの中身を貼って Run する。

create table if not exists public.source_records (
  id                uuid primary key default gen_random_uuid(),
  municipality_id   text not null,                 -- 例: 'yamato_kanagawa'
  category          text not null,                 -- garbage | events | disaster | facilities | transport | shops | notices
  title             text not null,
  description       text,
  source_url        text not null,
  source_type       text not null,                 -- csv | json | api | html
  license           text,
  source_record_id  text not null,                 -- 元データ側の一意キー（重複INSERT防止に使う）
  source_updated_at timestamptz,                   -- 元データの更新日時（取れる場合のみ）
  fetched_at        timestamptz not null default now(),
  verified_at       timestamptz,                   -- 人が確認した日時（管理画面から更新）
  status            text not null default 'pending'
                    check (status in ('pending', 'published', 'inactive')),
  content_hash      text not null,                 -- 差分判定用（中身が変わった時だけUPDATE）
  payload           jsonb not null default '{}',   -- 整形後のカテゴリ固有データ
  raw               jsonb,                         -- 元データ1行をそのまま保存（デバッグ用）
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- 同じ自治体・同じカテゴリ・同じ元ID は1行だけ（upsertのキー）
  unique (municipality_id, category, source_record_id)
);

create index if not exists source_records_lookup_idx
  on public.source_records (municipality_id, category, status);

-- updated_at を自動更新
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists source_records_touch on public.source_records;
create trigger source_records_touch before update on public.source_records
  for each row execute function public.touch_updated_at();

-- RLS: アプリ（anonキー）からは published のみ読める。書き込みは service role だけ。
alter table public.source_records enable row level security;

drop policy if exists "read published" on public.source_records;
create policy "read published" on public.source_records
  for select to anon, authenticated using (status = 'published');

-- 取り込みログ（実行履歴。GitHub Actions のログと合わせて確認する）
create table if not exists public.ingest_runs (
  id              uuid primary key default gen_random_uuid(),
  municipality_id text not null,
  category        text not null,
  source_url      text,
  fetched_count   int  not null default 0,
  inserted_count  int  not null default 0,
  updated_count   int  not null default 0,
  unchanged_count int  not null default 0,
  inactivated_count int not null default 0,
  skipped_count   int  not null default 0,
  status          text not null,               -- success | error
  error_message   text,
  started_at      timestamptz not null,
  finished_at     timestamptz not null default now()
);

alter table public.ingest_runs enable row level security;
-- 一般ユーザーには公開しない（ポリシーを作らない = 読めない）
