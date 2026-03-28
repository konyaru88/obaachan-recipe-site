/**
 * 読み物一覧ページ
 */
import { setPage } from '../app.js';
import { escapeHtml } from '../utils/helpers.js';

let articlesCache = null;

async function fetchArticles() {
  if (articlesCache) return articlesCache;
  const res = await fetch('./data/articles.json');
  articlesCache = await res.json();
  return articlesCache;
}

const CATEGORY_LABELS = {
  story:  'おばあちゃんのストーリー',
  column: '食文化コラム',
};

export { fetchArticles };

/**
 * 読み物一覧ページを描画する
 */
export default async function renderArticles({ query = {} } = {}) {
  const { category = '' } = query;
  let articles = await fetchArticles();

  if (category) {
    articles = articles.filter(a => a.category_slug === category);
  }

  // カテゴリータブ
  const tabs = [
    { slug: '', label: 'すべて' },
    { slug: 'story', label: 'おばあちゃんのストーリー' },
    { slug: 'column', label: '食文化コラム' },
  ].map(tab => {
    const isActive = category === tab.slug;
    const href = tab.slug ? `/articles?category=${tab.slug}` : '/articles';
    return `<a href="${href}" class="article-tab${isActive ? ' article-tab--active' : ''}" aria-pressed="${isActive}">${escapeHtml(tab.label)}</a>`;
  }).join('');

  // 記事カード
  const cardsHtml = articles.length > 0
    ? articles.map(article => {
        const date = article.published_at.replace(/-/g, '.').slice(2); // 26.03.15
        return `
        <a href="/article/${escapeHtml(article.id)}" class="article-card">
          <div class="article-card__thumb" aria-hidden="true">${escapeHtml(article.thumbnail_emoji)}</div>
          <div class="article-card__body">
            <div class="article-card__header-row">
              <span class="article-card__category">${escapeHtml(article.category)}</span>
            </div>
            <h2 class="article-card__title">${escapeHtml(article.title)}</h2>
            <p class="article-card__lead">${escapeHtml(article.lead)}</p>
            <div class="article-card__meta">
              <time datetime="${escapeHtml(article.published_at)}">${escapeHtml(date)}</time>
              <span class="article-card__read">約${article.reading_time}分で読める</span>
            </div>
          </div>
        </a>`;
      }).join('')
    : `<div class="empty-state">
        <p class="empty-state__icon" aria-hidden="true">📖</p>
        <p class="empty-state__msg">まだ記事がありません。</p>
      </div>`;

  const html = `
<main id="main" class="articles-page">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">読み物</h1>
      <p class="page-subtitle">おばあちゃんのストーリーと、食文化のコラム</p>
    </div>

    <!-- カテゴリータブ -->
    <div class="article-tabs" role="tablist" aria-label="カテゴリー">
      ${tabs}
    </div>

    <!-- 記事一覧 -->
    <div class="article-list">
      ${cardsHtml}
    </div>
  </div>
</main>
`;

  setPage(html);
}
