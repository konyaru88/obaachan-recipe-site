/**
 * 読み物詳細ページ
 */
import { setPage } from '../app.js';
import { escapeHtml } from '../utils/helpers.js';
import { fetchArticles } from './articles.js';

export default async function renderArticleDetail({ params = {} } = {}, router) {
  const { id } = params;
  const articles = await fetchArticles();
  const article = articles.find(a => a.id === id);

  if (!article) {
    setPage(`
      <main id="main" class="container" style="padding:4rem 1rem;text-align:center">
        <p style="font-size:3rem">📭</p>
        <h1>記事が見つかりませんでした</h1>
        <a href="#/articles" class="btn btn--outline" style="margin-top:1.5rem;display:inline-block">読み物一覧へ戻る</a>
      </main>
    `);
    return;
  }

  const date = article.published_at.replace(/-/g, '.').slice(2);

  // 本文を段落に変換（空行区切り）
  const bodyHtml = article.body
    .split('\n\n')
    .map(para => `<p>${escapeHtml(para.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');

  // 関連レシピリンク
  const relatedHtml = article.related_recipe_id
    ? `<div class="article-related">
        <p class="article-related__label">📌 関連レシピ</p>
        <a href="#/recipe/${escapeHtml(article.related_recipe_id)}" class="btn btn--primary">このレシピを見る →</a>
      </div>`
    : '';

  // タグ
  const tagsHtml = article.tags.map(tag =>
    `<a href="#/articles" class="article-tag">${escapeHtml(tag)}</a>`
  ).join('');

  const html = `
<main id="main" class="article-detail-page">
  <div class="container container--narrow">

    <!-- パンくず -->
    <nav class="breadcrumb" aria-label="パンくずリスト">
      <a href="#/">ホーム</a>
      <span aria-hidden="true"> › </span>
      <a href="#/articles">読み物</a>
      <span aria-hidden="true"> › </span>
      <span aria-current="page">${escapeHtml(article.title)}</span>
    </nav>

    <article class="article-body">
      <!-- ヘッダー -->
      <header class="article-header">
        <span class="article-card__category">${escapeHtml(article.category)}</span>
        <h1 class="article-header__title">${escapeHtml(article.title)}</h1>
        <div class="article-header__meta">
          <time datetime="${escapeHtml(article.published_at)}">${escapeHtml(date)}</time>
          <span>約${article.reading_time}分で読める</span>
        </div>
        <div class="article-header__thumb" aria-hidden="true">${escapeHtml(article.thumbnail_emoji)}</div>
        <p class="article-header__lead">${escapeHtml(article.lead)}</p>
      </header>

      <!-- 本文 -->
      <div class="article-content">
        ${bodyHtml}
      </div>

      <!-- 関連レシピ -->
      ${relatedHtml}

      <!-- タグ -->
      <div class="article-tags">${tagsHtml}</div>
    </article>

    <!-- 戻るリンク -->
    <div style="text-align:center; margin: var(--space-2xl) 0">
      <a href="#/articles" class="btn btn--outline">← 読み物一覧へ戻る</a>
    </div>

  </div>
</main>
`;

  setPage(html);
}
