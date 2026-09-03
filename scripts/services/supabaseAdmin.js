import { createClient } from '@supabase/supabase-js';

/**
 * service role キーを使う管理用クライアント。
 * ★ このキーはサーバー/GitHub Actions 専用。フロントエンド（src/）には絶対に置かない。
 */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('環境変数 SUPABASE_URL が未設定です');
  if (!key) throw new Error('環境変数 SUPABASE_SERVICE_ROLE_KEY が未設定です');

  return createClient(url, key, { auth: { persistSession: false } });
}
