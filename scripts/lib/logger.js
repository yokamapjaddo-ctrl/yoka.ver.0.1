/**
 * ログ出力。Secrets が万一混ざっても出力しないようにマスクする。
 */
const SECRET_VALUES = [
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  process.env.SUPABASE_ANON_KEY,
].filter(Boolean);

function mask(text) {
  let out = String(text);
  SECRET_VALUES.forEach((v) => { if (v && v.length > 8) out = out.split(v).join('***'); });
  return out;
}

const stamp = () => new Date().toISOString();

export const log = {
  info: (...a) => console.log(`[${stamp()}] ` + a.map(mask).join(' ')),
  warn: (...a) => console.warn(`[${stamp()}] WARN ` + a.map(mask).join(' ')),
  error: (...a) => console.error(`[${stamp()}] ERROR ` + a.map(mask).join(' ')),
  summary: (title, rows) => {
    console.log(`\n===== ${title} =====`);
    Object.entries(rows).forEach(([k, v]) => console.log(`  ${k.padEnd(18)} : ${mask(v)}`));
    console.log('==============================\n');
  },
};
