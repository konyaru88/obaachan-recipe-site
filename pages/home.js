/**
 * ホームページ
 */
import { setPage } from '../app.js';
import {
  fetchRecipes,
  fetchRegions,
} from '../utils/store.js';
import renderRecipeCard from '../components/recipe-card.js';
import { escapeHtml, areaName } from '../utils/helpers.js';

/** 地域ごとの絵文字 */
const regionEmoji = {
  hokkaido: '🦀',
  tohoku: '🍎',
  kanto: '🍜',
  chubu: '⛰️',
  kinki: '🦌',
  chugoku: '🐙',
  shikoku: '🍊',
  kyushu: '🌋',
};

/** カテゴリごとの絵文字 */
const categories = [
  { emoji: '🍲', label: '汁物' },
  { emoji: '🐟', label: '主菜' },
  { emoji: '🥬', label: '副菜' },
  { emoji: '🥒', label: '漬物' },
  { emoji: '🍚', label: 'ごはんもの' },
  { emoji: '🍡', label: 'おやつ' },
];

/**
 * ホームページを描画する
 * @param {import('../utils/router.js').default} router
 */
export default async function renderHome(router) {
  // データを並行取得
  const [allRecipes, regions] = await Promise.all([
    fetchRecipes(),
    fetchRegions(),
  ]);

  // 新着レシピ（最大6件 - IDの降順）
  const latest = [...allRecipes]
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 6);

  // おばあちゃんデータを集約（名前でグループ化）
  const grandmaMap = new Map();
  for (const r of allRecipes) {
    const g = r.grandmother;
    if (!g || !g.name) continue;
    if (!grandmaMap.has(g.name)) {
      grandmaMap.set(g.name, {
        name: g.name,
        prefecture: g.prefecture ?? '',
        city: g.city ?? '',
        count: 0,
      });
    }
    grandmaMap.get(g.name).count++;
  }
  const grandmas = [...grandmaMap.values()].slice(0, 3);

  // おばあちゃんカード HTML
  const grandmaCards = grandmas.map((g) => `
    <a href="#/recipes" class="grandma-card">
      <div class="grandma-card__avatar">👵</div>
      <div class="grandma-card__info">
        <span class="grandma-card__name">${escapeHtml(g.name)}</span>
        <span class="grandma-card__place">${escapeHtml(g.prefecture)}・${escapeHtml(g.city)}</span>
        <span class="grandma-card__count">${g.count}件のレシピ</span>
      </div>
    </a>
  `).join('');

  // カテゴリボタン HTML
  const categoryButtons = categories.map((c) => `
    <a href="#/recipes?category=${encodeURIComponent(c.label)}" class="category-btn animate-on-scroll">
      <span class="category-btn__emoji">${c.emoji}</span>
      <span class="category-btn__label">${escapeHtml(c.label)}</span>
    </a>
  `).join('');

  // 地域マップアイテム HTML
  const regionMapItems = regions.length > 0
    ? regions.map((r) => `
        <a href="#/region/${escapeHtml(r.code)}" class="region-map-item animate-on-scroll"
           data-region="${escapeHtml(r.code)}"
           style="--region-color:${escapeHtml(r.color ?? '#8B4513')}">
          <span class="region-map-item__emoji" aria-hidden="true">${regionEmoji[r.code] ?? '🗾'}</span>
          <span class="region-map-item__name">${escapeHtml(r.name ?? areaName(r.code))}</span>
          ${r.recipe_count != null ? `<span class="region-map-item__count">${escapeHtml(String(r.recipe_count))}件</span>` : ''}
        </a>
      `).join('')
    : Object.keys(regionEmoji).map((code) => `
        <a href="#/region/${code}" class="region-map-item animate-on-scroll" data-region="${code}">
          <span class="region-map-item__emoji" aria-hidden="true">${regionEmoji[code]}</span>
          <span class="region-map-item__name">${escapeHtml(areaName(code))}</span>
        </a>
      `).join('');

  // SVG wave helpers
  const waveCreamToGreen = `
    <div class="wave-divider wave-divider--cream-to-green">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20 L1440,40 L0,40 Z" fill="#F0F5ED"/>
      </svg>
    </div>`;

  const waveGreenToBlue = `
    <div class="wave-divider wave-divider--green-to-blue">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,20 C240,0 480,40 720,20 C960,0 1200,40 1440,20 L1440,40 L0,40 Z" fill="#EDF3F8"/>
      </svg>
    </div>`;

  const waveBlueToWarm = `
    <div class="wave-divider wave-divider--blue-to-warm">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20 L1440,40 L0,40 Z" fill="#E8DCC8"/>
      </svg>
    </div>`;

  const html = `
<main id="main" class="home">

  <!-- ヒーローセクション -->
  <section class="hero" aria-label="キャッチコピーと検索">
    <div class="hero__bg" aria-hidden="true"></div>
    <div class="hero__content">
      <p class="hero__subtitle">全国のおばあちゃんの味を、次の世代へ。</p>
      <h1 class="hero__title">消えゆく味を、<br>あなたの台所へ。</h1>
      <p class="hero__lead">
        日本各地のおばあちゃんが守り続けてきた、<br>
        手仕事の味・郷土の知恵が、ここに集まっています。
      </p>
      <form class="hero__search" id="hero-search-form" role="search" aria-label="レシピを検索">
        <input
          type="search"
          id="hero-search-input"
          class="hero__search-input"
          placeholder="料理名・地域・食材で検索…"
          autocomplete="off"
          aria-label="レシピを検索"
        />
        <button type="submit" class="hero__search-btn btn btn--primary">
          <span aria-hidden="true">🔍</span> 検索
        </button>
      </form>
    </div>
  </section>

  <!-- 新着レシピ -->
  <section class="home__latest" aria-labelledby="latest-heading">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <h2 id="latest-heading" class="section-title">新着レシピ</h2>
        <p class="section-subtitle">おばあちゃんたちから届いたばかりの味</p>
      </div>
      <div class="recipe-grid recipe-grid--3">
        ${latest.map(renderRecipeCard).join('')}
      </div>
      <div class="section-footer">
        <a href="#/recipes" class="btn btn--outline">すべてのレシピを見る</a>
      </div>
    </div>
  </section>

  ${waveCreamToGreen}

  <!-- おばあちゃんから探す / レシピから探す -->
  <section class="home__explore" aria-labelledby="explore-heading">
    <div class="container">
      <div class="explore-grid">
        <div class="explore-col">
          <h2 class="section-title animate-on-scroll" id="explore-heading">おばあちゃんから探す</h2>
          <p class="section-subtitle animate-on-scroll">レシピを伝えてくれた人たち</p>
          <div class="grandma-list">
            ${grandmaCards}
          </div>
          <a href="#/recipes" class="btn btn--outline">もっと見る</a>
        </div>
        <div class="explore-col">
          <h2 class="section-title animate-on-scroll">レシピから探す</h2>
          <p class="section-subtitle animate-on-scroll">料理のジャンルで選ぶ</p>
          <div class="category-grid">
            ${categoryButtons}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${waveGreenToBlue}

  <!-- 地域で探す（マップ風） -->
  <section class="home__regions-map" aria-labelledby="regions-heading">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <h2 id="regions-heading" class="section-title">地域で探す</h2>
        <p class="section-subtitle">あなたのふるさとの味、探してみませんか</p>
      </div>
      <div class="region-map">
        ${regionMapItems}
      </div>
      <div class="section-footer">
        <a href="#/regions" class="btn btn--outline">地域一覧をすべて見る</a>
      </div>
    </div>
  </section>

  ${waveBlueToWarm}

  <!-- レシピ募集 -->
  <section id="recruit" class="home__recruit" aria-labelledby="recruit-heading">
    <div class="container">
      <div class="recruit-block animate-on-scroll">
        <div class="recruit-block__deco" aria-hidden="true">📮</div>
        <div class="recruit-block__beta-badge">β版公開中</div>
        <h2 id="recruit-heading" class="recruit-block__title">あなたのおばあちゃんのレシピを<br>教えてください</h2>
        <p class="recruit-block__text">
          料理名だけでもOKです。<br>
          「うちの祖母がよく作っていた」という記憶が、<br>
          日本の食文化を守る大切な一歩になります。
        </p>
        <div class="recruit-block__channels">
          <a href="https://www.instagram.com/obaachan_recipe" target="_blank" rel="noopener noreferrer" class="recruit-channel recruit-channel--instagram">
            <span class="recruit-channel__icon" aria-hidden="true">📸</span>
            <span class="recruit-channel__name">Instagram</span>
            <span class="recruit-channel__handle">@obaachan_recipe</span>
          </a>
          <a href="https://www.threads.net/@obaachan_recipe" target="_blank" rel="noopener noreferrer" class="recruit-channel recruit-channel--threads">
            <span class="recruit-channel__icon" aria-hidden="true">🧵</span>
            <span class="recruit-channel__name">Threads</span>
            <span class="recruit-channel__handle">@obaachan_recipe</span>
          </a>
        </div>
        <p class="recruit-block__note">DMでもコメントでも、どちらでも大歓迎です 🙏</p>
      </div>
    </div>
  </section>

  <!-- サービスの想い -->
  <section class="home__about" aria-labelledby="about-heading">
    <div class="container">
      <div class="about-block animate-on-scroll">
        <div class="about-block__deco" aria-hidden="true">👵</div>
        <h2 id="about-heading" class="about-block__title">このサービスについて</h2>
        <p class="about-block__text">
          日本各地には、おばあちゃんの台所にしか残っていないレシピがあります。<br>
          計量カップも使わず、「だいたいこのくらい」と手のひらで量り、<br>
          「昔からこうやって作ってきた」と語る、その言葉の中に<br>
          長い年月をかけて磨かれた知恵と愛情が宿っています。
        </p>
        <p class="about-block__text">
          「おばあちゃんのレシピ」は、そんな失われゆく郷土の味を記録し、<br>
          次の世代へとつなぐためのアーカイブです。<br>
          レシピだけでなく、料理にまつわる物語や食文化の背景も大切に伝えていきます。
        </p>
        <div class="about-block__cta">
          <a href="#/recipes" class="btn btn--primary">レシピを探す</a>
          <a href="#/regions" class="btn btn--outline">地域から探す</a>
        </div>
      </div>
    </div>
  </section>

</main>
`;

  setPage(html);

  // スクロールアニメーション（IntersectionObserver）
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length > 0 && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-scroll-ready');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1 });
    animatedEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all immediately
    animatedEls.forEach((el) => el.classList.add('is-visible'));
  }

  // 「詳しくはこちら」からのスクロール（他ページ経由の場合はsessionStorageでフラグを受け取る）
  if (sessionStorage.getItem('scrollTo') === 'recruit') {
    sessionStorage.removeItem('scrollTo');
    setTimeout(() => {
      document.getElementById('recruit')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  // ヒーロー検索フォームのイベント
  const heroForm = document.getElementById('hero-search-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('hero-search-input').value.trim();
      if (q) router.navigate(`#/search?q=${encodeURIComponent(q)}`);
    });
  }
}
