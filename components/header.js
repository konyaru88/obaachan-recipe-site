/**
 * サイト共通ヘッダーコンポーネント
 */

export default function renderHeader(router) {
  const pathname = window.location.pathname || '/';

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navClass = (path) => isActive(path) ? 'nav__link nav__link--active is-active' : 'nav__link';

  return `
<!-- β版お知らせバー -->
<div class="beta-bar" role="banner" aria-label="お知らせ">
  <span class="beta-bar__badge">β版公開中</span>
  <span class="beta-bar__text">現在β版公開中・レシピ募集中 ── あなたのおばあちゃんの味を教えてください</span>
  <a href="/" class="beta-bar__link" onclick="sessionStorage.setItem('scrollTo','recruit')">詳しくはこちら</a>
</div>

<header class="site-header">
  <div class="container site-header__inner">
    <a class="site-header__logo" href="/">
      <img src="assets/images/grandma-icon.png" alt="" class="site-header__logo-img" aria-hidden="true" />
      おばあちゃんのレシピ
    </a>

    <nav class="site-header__nav" aria-label="メインナビゲーション">
      <a href="/" class="${navClass('/')}">ホーム</a>
      <a href="/recipes" class="${navClass('/recipes')}">レシピ一覧</a>
      <a href="/regions" class="${navClass('/regions')}">地域で探す</a>
      <a href="/articles" class="${navClass('/articles')}">読み物</a>
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

    <button class="mobile-menu-btn" aria-label="メニューを開く" aria-expanded="false">
      <span class="mobile-menu-btn__line"></span>
      <span class="mobile-menu-btn__line"></span>
      <span class="mobile-menu-btn__line"></span>
    </button>
  </div>

  <!-- モバイルメニュー -->
  <div class="mobile-menu" aria-hidden="true">
    <nav class="mobile-menu__nav" aria-label="モバイルナビゲーション">
      <a href="/" class="${navClass('/')}">ホーム</a>
      <a href="/recipes" class="${navClass('/recipes')}">レシピ一覧</a>
      <a href="/regions" class="${navClass('/regions')}">地域で探す</a>
      <a href="/articles" class="${navClass('/articles')}">読み物</a>
    </nav>
    <form class="mobile-menu__search" id="mobile-search-form" role="search" aria-label="レシピ検索">
      <input
        type="search"
        class="mobile-menu__search-input"
        placeholder="料理名・地域・食材で検索…"
        aria-label="レシピを検索"
        autocomplete="off"
      />
      <button type="submit" class="mobile-menu__search-btn" aria-label="検索">🔍 検索</button>
    </form>
  </div>
</header>
`;
}

/**
 * モバイルメニューのイベントリスナーを設定
 */
export function initMobileMenu(router) {
  const btn = document.querySelector('.mobile-menu-btn');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    menu.setAttribute('aria-hidden', !isOpen);
  });

  // メニュー内のリンクをクリックしたら閉じる
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });

  // モバイル検索フォーム
  const mobileSearchForm = document.getElementById('mobile-search-form');
  if (mobileSearchForm) {
    mobileSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = mobileSearchForm.querySelector('input').value.trim();
      if (q) {
        menu.classList.remove('is-open');
        btn.classList.remove('is-open');
        router.navigate(`/search?q=${encodeURIComponent(q)}`);
      }
    });
  }
}
