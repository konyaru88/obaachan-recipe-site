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
