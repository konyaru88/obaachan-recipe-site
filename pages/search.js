/**
 * 検索結果ページ
 */
import { setPage } from '../app.js';
import { searchRecipes } from '../utils/store.js';
import renderRecipeCard from '../components/recipe-card.js';
import { escapeHtml } from '../utils/helpers.js';

/** 別のキーワード提案 */
const SUGGESTION_KEYWORDS = [
  '煮物', '漬物', 'お正月', '保存食', 'お味噌汁',
  '炊き込みご飯', 'おひたし', '郷土料理', 'きんぴら', 'お雑煮',
];

/**
 * 検索結果ページを描画する
 * @param {{ params: Object, query: Object }} ctx
 * @param {import('../utils/router.js').default} router
 */
export default async function renderSearch({ params = {}, query = {} } = {}, router) {
  const q = (query.q ?? '').trim();

  let recipes = [];
  if (q) {
    recipes = await searchRecipes(q);
  }

  // 件数ラベル
  const countLabel = q
    ? `「<strong>${escapeHtml(q)}</strong>」の検索結果: <strong>${recipes.length}</strong> 件`
    : 'キーワードを入力してレシピを検索してください。';

  // グリッド or 空状態
  let contentHtml;
  if (!q) {
    // 検索クエリなし
    contentHtml = `
      <div class="empty-state">
        <p class="empty-state__icon" aria-hidden="true">🔍</p>
        <p class="empty-state__msg">料理名・食材・地域名などで検索してみましょう。</p>
      </div>
    `;
  } else if (recipes.length === 0) {
    // 0件
    const suggestions = SUGGESTION_KEYWORDS.slice(0, 8)
      .map((kw) => `<a href="/search?q=${encodeURIComponent(kw)}" class="suggestion-chip">${escapeHtml(kw)}</a>`)
      .join('');

    contentHtml = `
      <div class="empty-state">
        <p class="empty-state__icon" aria-hidden="true">😢</p>
        <p class="empty-state__msg">「${escapeHtml(q)}」に一致するレシピが見つかりませんでした。</p>
        <p class="empty-state__sub">別のキーワードで試してみましょう。</p>
        <div class="suggestion-chips" aria-label="キーワード提案">
          ${suggestions}
        </div>
        <a href="/recipes" class="btn btn--outline" style="margin-top:1.5rem;">すべてのレシピを見る</a>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="recipe-grid recipe-grid--3">
        ${recipes.map(renderRecipeCard).join('')}
      </div>
    `;
  }

  const html = `
<main id="main" class="search-page">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">レシピ検索</h1>
    </div>

    <!-- 検索フォーム（ページ内） -->
    <form class="search-page__form" id="inline-search-form" role="search" aria-label="レシピを検索">
      <input
        type="search"
        id="inline-search-input"
        class="search-page__input"
        value="${escapeHtml(q)}"
        placeholder="料理名・地域・食材で検索…"
        autocomplete="off"
        aria-label="レシピを検索"
        autofocus
      />
      <button type="submit" class="btn btn--primary" aria-label="検索">
        <span aria-hidden="true">🔍</span> 検索
      </button>
    </form>

    <!-- 件数 -->
    ${q ? `<p class="result-count" aria-live="polite">${countLabel}</p>` : ''}

    <!-- 結果 -->
    ${contentHtml}
  </div>
</main>
`;

  setPage(html);

  // 検索フォームのイベント
  const inlineForm = document.getElementById('inline-search-form');
  if (inlineForm) {
    inlineForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('inline-search-input').value.trim();
      if (val) {
        router.navigate(`/search?q=${encodeURIComponent(val)}`);
      }
    });
  }
}
