/**
 * メインエントリポイント
 */
import Router from './utils/router.js';
import renderHome from './pages/home.js';
import renderList from './pages/list.js';
import renderDetail from './pages/detail.js';
import renderRegion from './pages/region.js';
import renderSearch from './pages/search.js';
import renderArticles from './pages/articles.js';
import renderArticleDetail from './pages/article-detail.js';
import renderHeader from './components/header.js';
import renderFooter from './components/footer.js';

const app = document.getElementById('app');
const loading = document.getElementById('loading');

// ルーター設定
const router = new Router();
router.add('/', () => renderHome(router));
router.add('/recipes', (ctx) => renderList(ctx, router));
router.add('/recipe/:id', (ctx) => renderDetail(ctx, router));
router.add('/regions', (ctx) => renderRegion(ctx, router));
router.add('/region/:code', (ctx) => renderRegion(ctx, router));
router.add('/search', (ctx) => renderSearch(ctx, router));
router.add('/articles', (ctx) => renderArticles(ctx));
router.add('/article/:id', (ctx) => renderArticleDetail(ctx, router));

/**
 * ページのHTMLをヘッダー・フッターと共にセットする
 * 各ページコンポーネントからエクスポートされたこの関数を呼ぶ。
 * @param {string} html - メインコンテンツのHTML文字列
 */
export function setPage(html) {
  if (loading) loading.style.display = 'none';
  if (app) {
    app.innerHTML = renderHeader(router) + html + renderFooter();
  }

  // スクロールをトップに戻す
  window.scrollTo(0, 0);

  // ヘッダー検索フォームのイベントを再付与
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('search-input').value.trim();
      if (q) router.navigate(`#/search?q=${encodeURIComponent(q)}`);
    });
  }

  // モバイルメニューのイベントを再付与
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileNav.setAttribute('aria-hidden', String(expanded));
      mobileNav.classList.toggle('header__mobile-nav--open', !expanded);
    });
  }

  // モバイル検索フォームのイベントを再付与
  const mobileSearchForm = document.getElementById('mobile-search-form');
  if (mobileSearchForm) {
    mobileSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('mobile-search-input').value.trim();
      if (q) router.navigate(`#/search?q=${encodeURIComponent(q)}`);
    });
  }
}

// ルーター開始
router.start();
