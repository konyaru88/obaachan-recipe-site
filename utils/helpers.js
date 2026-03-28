/**
 * ユーティリティ関数群
 */

/**
 * 分数を日本語の時間表記に変換する
 * @param {number} minutes
 * @returns {string} 例: 90 → "1時間30分", 45 → "45分", 60 → "1時間"
 */
export function formatTime(minutes) {
  if (!minutes || isNaN(minutes)) return '-';
  const m = Number(minutes);
  if (m < 60) return `${m}分`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (rem === 0) return `${h}時間`;
  return `${h}時間${rem}分`;
}

/**
 * 難易度をstar文字列に変換する（最大3）
 * @param {number} n
 * @returns {string} 例: 2 → "★★☆"
 */
export function difficultyStars(n) {
  const level = Math.min(Math.max(Math.round(Number(n)) || 0, 0), 3);
  return '★'.repeat(level) + '☆'.repeat(3 - level);
}

/** 地方コード → 地方名のマッピング */
const AREA_NAMES = {
  hokkaido: '北海道',
  tohoku: '東北',
  kanto: '関東',
  hokuriku: '北陸',
  koshinetsu: '甲信越',
  tokai: '東海',
  kinki: '近畿',
  chugoku: '中国',
  shikoku: '四国',
  kyushu: '九州・沖縄',
};

/**
 * 地方コードから地方名を返す
 * @param {string} code
 * @returns {string}
 */
export function areaName(code) {
  return AREA_NAMES[code] ?? code ?? '';
}

/**
 * 季節に対応する絵文字を返す
 * @param {string} season - 'spring' | 'summer' | 'autumn' | 'winter'
 * @returns {string}
 */
export function seasonEmoji(season) {
  const map = {
    spring: '🌸',
    summer: '🌻',
    autumn: '🍁',
    fall: '🍁',
    winter: '❄️',
    春: '🌸',
    夏: '🌻',
    秋: '🍁',
    冬: '❄️',
  };
  return map[season] ?? '';
}

/**
 * HTML特殊文字をエスケープする
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 文字列を指定の長さで切り詰めて末尾に「…」を付ける
 * @param {string} str
 * @param {number} len - 最大文字数
 * @returns {string}
 */
export function truncate(str, len) {
  if (str == null) return '';
  const s = String(str);
  if (s.length <= len) return s;
  return s.slice(0, len) + '…';
}
