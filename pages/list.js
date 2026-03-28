/**
 * レシピ一覧ページ
 */
import { setPage } from '../app.js';
import {
  fetchRecipes,
  getRecipesByRegion,
  getRecipesByTag,
  getEndangeredRecipes,
} from '../utils/store.js';
import renderRecipeCard from '../components/recipe-card.js';
import { escapeHtml, areaName } from '../utils/helpers.js';

/** 地方コード一覧 */
const AREA_CODES = [
  'hokkaido', 'tohoku', 'kanto', 'hokuriku',
  'koshinetsu', 'tokai', 'kinki', 'chugoku',
  'shikoku', 'kyushu',
];

/** 代表的なタグ一覧 */
const COMMON_TAGS = [
  '煮物', '漬物', '汁物', '焼き物', '蒸し物',
  'お正月', 'お祭り', '保存食', '郷土料理', '精進料理',
];

/**
 * レシピ一覧ページを描画する
 * @param {{ params: Object, query: Object }} ctx
 * @param {import('../utils/router.js').default} router
 */
export default async function renderList({ params = {}, query = {} } = {}, router) {
  const { region = '', tag = '', sort = 'newest', filter = '' } = query;

  // データ取得
  let recipes;
  if (filter === 'endangered') {
    recipes = await getEndangeredRecipes();
  } else if (region) {
    recipes = await getRecipesByRegion(region);
  } else if (tag) {
    recipes = await getRecipesByTag(tag);
  } else {
    recipes = await fetchRecipes();
  }

  // ソート
  if (sort === 'popular') {
    recipes = [...recipes].sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0));
  } else {
    // デフォルト: 新着順（created_atの降順）
    recipes = [...recipes].sort((a, b) => {
      const dateA = new Date(a.meta?.created_at ?? 0);
      const dateB = new Date(b.meta?.created_at ?? 0);
      return dateB - dateA;
    });
  }

  // ページタイトル
  let pageTitle = 'レシピ一覧';
  if (filter === 'endangered') pageTitle = '消えゆくレシピ一覧';
  else if (region) pageTitle = `${areaName(region)}のレシピ`;
  else if (tag) pageTitle = `「${tag}」のレシピ`;

  // フィルターバー: 地方ボタン
  const regionButtons = AREA_CODES.map((code) => {
    const isActive = region === code;
    const newQuery = buildQuery({ region: isActive ? '' : code, tag, sort });
    return `<a href="/recipes${newQuery}" class="filter-btn${isActive ? ' filter-btn--active' : ''}" aria-pressed="${isActive}">
      ${escapeHtml(areaName(code))}
    </a>`;
  }).join('');

  // フィルターバー: タグボタン
  const tagButtons = COMMON_TAGS.map((t) => {
    const isActive = tag === t;
    const newQuery = buildQuery({ region, tag: isActive ? '' : t, sort });
    return `<a href="/recipes${newQuery}" class="filter-btn filter-btn--tag${isActive ? ' filter-btn--active' : ''}" aria-pressed="${isActive}">
      ${escapeHtml(t)}
    </a>`;
  }).join('');

  // ソートボタン
  const sortNewestQuery = buildQuery({ region, tag, sort: 'newest' });
  const sortPopularQuery = buildQuery({ region, tag, sort: 'popular' });

  // リセットリンク
  const hasFilter = region || tag || filter;
  const resetLink = hasFilter
    ? `<a href="/recipes" class="filter-reset">フィルターをリセット ×</a>`
    : '';

  // レシピグリッド
  const gridHtml = recipes.length > 0
    ? `<div class="recipe-grid recipe-grid--3">${recipes.map(renderRecipeCard).join('')}</div>`
    : `<div class="empty-state">
        <p class="empty-state__icon" aria-hidden="true">🍳</p>
        <p class="empty-state__msg">該当するレシピが見つかりませんでした。</p>
        <a href="/recipes" class="btn btn--outline">すべてのレシピを見る</a>
      </div>`;

  const html = `
<main id="main" class="list-page">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">${escapeHtml(pageTitle)}</h1>
    </div>

    <!-- フィルターバー -->
    <aside class="filter-bar" aria-label="絞り込み">
      <div class="filter-bar__section">
        <p class="filter-bar__label">地方で絞り込む</p>
        <div class="filter-bar__buttons">
          ${regionButtons}
        </div>
      </div>
      <div class="filter-bar__row">
        <div class="filter-bar__section">
          <p class="filter-bar__label">タグで絞り込む</p>
          <div class="filter-bar__buttons">
            ${tagButtons}
          </div>
        </div>
        <div class="filter-bar__sort">
          <span class="filter-bar__label">並び替え:</span>
          <a href="/recipes${sortNewestQuery}" class="filter-btn filter-btn--sort${sort !== 'popular' ? ' filter-btn--active' : ''}" aria-pressed="${sort !== 'popular'}">新着順</a>
          <a href="/recipes${sortPopularQuery}" class="filter-btn filter-btn--sort${sort === 'popular' ? ' filter-btn--active' : ''}" aria-pressed="${sort === 'popular'}">人気順</a>
        </div>
      </div>
      <div class="filter-bar__footer">
        ${resetLink}
      </div>
    </aside>

    <!-- ヒット数 -->
    <p class="result-count" aria-live="polite">
      <strong>${recipes.length}</strong> 件のレシピが見つかりました
    </p>

    <!-- レシピグリッド -->
    ${gridHtml}
  </div>
</main>
`;

  setPage(html);
}

/**
 * クエリパラメータ文字列を構築する
 * @param {{ region?: string, tag?: string, sort?: string, filter?: string }} params
 * @returns {string} 例: '?region=kanto&sort=popular'
 */
function buildQuery(params) {
  const entries = Object.entries(params).filter(([, v]) => v && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}
