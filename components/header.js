/**
 * サイト共通ヘッダーコンポーネント
 */

export default function renderHeader(router) {
  const hash = window.location.hash || '#/';

  const isActive = (path) => {
    const current = hash.split('?')[0];
    if (path === '#/') return current === '#/' || current === '#' || hash === '';
    return current.startsWith(path);
  };

  const navClass = (path) => isActive(path) ? 'nav__link nav__link--active is-active' : 'nav__link';

  return `
<!-- β版お知らせバー -->
<div class="beta-bar" role="banner" aria-label="お知らせ">
  <span class="beta-bar__badge">β版公開中</span>
  <span class="beta-bar__text">現在β版公開中・レシピ募集中 ── あなたのおばあちゃんの味を教えてください</span>
  <a href="#/" class="beta-bar__link" onclick="sessionStorage.setItem('scrollTo','recruit')">詳しくはこちら</a>
</div>

<header class="site-header">
  <div class="container site-header__inner">
    <a class="site-header__logo" href="#/">
      <span aria-hidden="true">🍱</span>
      おばあちゃんのレシピ
    </a>

    <nav class="site-header__nav" aria-label="メインナビゲーション">
      <a href="#/" class="${navClass('#/')}">ホーム</a>
      <a href="#/recipes" class="${navClass('#/recipes')}">レシピ一覧</a>
      <a href="#/regions" class="${navClass('#/regions')}">地域で探す</a>
      <a href="#/articles" class="${navClass('#/articles')}">読み物</a>
    </nav>

    <form class="site-header__search" id="search-form" role="search" aria-label="レシピ検索">
      <input
        type="search"
        id="search-input"
        class="site-header__search-input"
        placeholder="レシピを検索…"
        aria-label="レシピを検索"
        autocomplete="off"
      />
      <button type="submit" class="header__search-btn" aria-label="検索">🔍</button>
    </form>
  </div>
</header>
`;
}
