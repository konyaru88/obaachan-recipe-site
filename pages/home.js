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

/** カテゴリごとのイラスト */
const categories = [
  { img: 'assets/images/categories/shirumono.png', label: '汁物' },
  { img: 'assets/images/categories/shusai.png', label: '主菜' },
  { img: 'assets/images/categories/fukusai.png', label: '副菜' },
  { img: 'assets/images/categories/tsukemono.png', label: '漬物' },
  { img: 'assets/images/categories/gohanmono.png', label: 'ごはんもの' },
  { img: 'assets/images/categories/oyatsu.png', label: 'おやつ' },
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

  // おばあちゃんハッシュタグ
  const grandmaTags = [
    '関西風おばあちゃん', '甘党おばあちゃん', '孫大好きおばあちゃん',
    '漬物名人', '味噌づくり40年', '朝4時起きおばあちゃん',
    '畑のおばあちゃん', '海の幸おばあちゃん', '節約の達人',
  ];

  const hashtagButtons = grandmaTags.map((tag) => `
    <a href="/recipes?tag=${encodeURIComponent(tag)}" class="hashtag-btn">${escapeHtml(tag)}</a>
  `).join('');

  // カテゴリボタン HTML
  const categoryButtons = categories.map((c) => `
    <a href="/recipes?category=${encodeURIComponent(c.label)}" class="category-btn animate-on-scroll">
      <img class="category-btn__img" src="${c.img}" alt="${escapeHtml(c.label)}" loading="lazy" />
      <span class="category-btn__label">${escapeHtml(c.label)}</span>
    </a>
  `).join('');

  // 地域マップアイテム HTML
  const regionMapItems = regions.length > 0
    ? regions.map((r) => `
        <a href="/region/${escapeHtml(r.code)}" class="region-map-item animate-on-scroll"
           data-region="${escapeHtml(r.code)}"
           style="--region-color:${escapeHtml(r.color ?? '#8B4513')}">
          <span class="region-map-item__emoji" aria-hidden="true">${regionEmoji[r.code] ?? '🗾'}</span>
          <span class="region-map-item__name">${escapeHtml(r.name ?? areaName(r.code))}</span>
          ${r.recipe_count != null ? `<span class="region-map-item__count">${escapeHtml(String(r.recipe_count))}件</span>` : ''}
        </a>
      `).join('')
    : Object.keys(regionEmoji).map((code) => `
        <a href="/region/${code}" class="region-map-item animate-on-scroll" data-region="${code}">
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
      <p class="hero__subtitle">全国のおばあちゃんの手料理が集まるメディア</p>
      <h1 class="hero__title">80年後も、<br>食べられ続ける味がある</h1>
      <p class="hero__lead">
        おばあちゃんの台所を、あなたの食卓へ。
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
        <a href="/recipes" class="btn btn--outline">すべてのレシピを見る</a>
      </div>
    </div>
  </section>

  ${waveCreamToGreen}

  <!-- おばあちゃんから探す / レシピから探す -->
  <section class="home__explore" aria-labelledby="explore-heading">
    <div class="container">
      <div class="explore-tabs">
        <button class="explore-tab explore-tab--active" data-tab="grandma">
          👵 おばあちゃんから探す
        </button>
        <button class="explore-tab" data-tab="recipe">
          🍽 レシピから探す
        </button>
      </div>

      <div class="explore-panel" id="panel-grandma">
        <p class="explore-panel__lead">おばあちゃんのタイプで選んでみよう</p>
        <div class="hashtag-cloud">
          ${hashtagButtons}
        </div>
      </div>

      <div class="explore-panel" id="panel-recipe" style="display:none">
        <p class="explore-panel__lead">料理のジャンルで選ぶ</p>
        <div class="category-grid">
          ${categoryButtons}
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
      <div class="japan-map-container">
        <div class="japan-map-wrapper" id="japan-map-wrapper">
          <!-- SVG will be loaded here via fetch -->
        </div>
        <div class="japan-map-tooltip" id="map-tooltip" style="display:none"></div>
      </div>
      <div class="region-map">
        ${regionMapItems}
      </div>
      <div class="section-footer">
        <a href="/regions" class="btn btn--outline">地域一覧をすべて見る</a>
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

  <!-- 応援してください -->
  <section id="support" class="home__support" aria-labelledby="support-heading">
    <div class="container">
      <div class="support-block animate-on-scroll">
        <div class="support-block__deco" aria-hidden="true">🍙</div>
        <h2 id="support-heading" class="support-block__title">おばあちゃんの味を、<br>一緒に残しませんか</h2>
        <p class="support-block__text">
          このサイトは、消えゆく郷土料理を記録するために<br>
          広告なしで運営している個人メディアです。
        </p>
        <p class="support-block__text">
          ご支援いただいた費用は、全国のおばあちゃんを訪ねる取材費や<br>
          レシピの記録・サイト運営のために、大切に使わせていただきます。
        </p>
        <a
          href="https://buymeacoffee.com/obaachanrev"
          target="_blank"
          rel="noopener noreferrer"
          class="support-block__btn"
        >
          🍙 このサイトを応援する
        </a>
        <p class="support-block__note">100円から支援できます。クレジットカード・PayPal対応。</p>
      </div>
    </div>
  </section>

  <!-- サービスの想い -->
  <section class="home__about" aria-labelledby="about-heading">
    <div class="container">
      <div class="about-block animate-on-scroll">
        <div class="about-block__deco" aria-hidden="true"><img src="assets/images/grandma-icon.png" alt="" class="about-block__deco-img" /></div>
        <h2 id="about-heading" class="about-block__title">このサービスについて</h2>
        <p class="about-block__text">
          日本各地にある、おばあちゃんの手料理を残したい。<br>
          「おばあちゃんのレシピ」は、「あの味」を記録し、次の世代へつなぐためのアーカイブです。
        </p>
        <p class="about-block__text">
          計量カップは使わず、「だいたいこのくらい」と手のひらで量る。<br>
          「昔からこうやって作ってきた」と語られるその言葉の中には、<br>
          長い時間をかけて積み重なった知恵や経験が詰まっています。
        </p>
        <p class="about-block__text">
          ここで大切にしているのは、レシピを正確に記録することだけではありません。<br>
          当時の会話やエピソード、歴史や食文化とあわせて伝え続けていくこと。
        </p>
        <p class="about-block__text">
          語られ、作られ、誰かの生活の中で使われ続けていくこと。<br>
          その循環があってはじめて、文化として残っていくと私たちは考えています。
        </p>
        <p class="about-block__text">
          何十年先の食卓でも、変わらず食べられ続ける「あの味」があることを目指して。
        </p>
        <div class="about-block__cta">
          <a href="/recipes" class="btn btn--primary">レシピを探す</a>
          <a href="/regions" class="btn btn--outline">地域から探す</a>
          <button type="button" class="btn btn--support-scroll" id="scroll-to-support">活動を応援する</button>
        </div>
      </div>
    </div>
  </section>

</main>
`;

  setPage(html);

  // タブ切り替え
  document.querySelectorAll('.explore-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.explore-tab').forEach(t => t.classList.remove('explore-tab--active'));
      tab.classList.add('explore-tab--active');
      const target = tab.dataset.tab;
      document.getElementById('panel-grandma').style.display = target === 'grandma' ? '' : 'none';
      document.getElementById('panel-recipe').style.display = target === 'recipe' ? '' : 'none';
    });
  });

  // 地図SVGを読み込んで動的に色付け
  const mapWrapper = document.getElementById('japan-map-wrapper');
  const mapTooltip = document.getElementById('map-tooltip');
  if (mapWrapper) {
    const classToRegion = {
      'hokkaido': 'hokkaido',
      'tohoku': 'tohoku',
      'kanto': 'kanto',
      'chubu': 'chubu',
      'kinki': 'kinki',
      'chugoku': 'chugoku',
      'shikoku': 'shikoku',
      'kyushu': 'kyushu',
      'kyushu-okinawa': 'kyushu',
    };
    const regionNames = {
      hokkaido: '北海道',
      tohoku: '東北',
      kanto: '関東',
      chubu: '中部',
      kinki: '近畿',
      chugoku: '中国',
      shikoku: '四国',
      kyushu: '九州・沖縄',
    };

    // 地域ごとのレシピ数を集計
    const regionRecipeCount = {};
    for (const r of regions) {
      regionRecipeCount[r.code] = r.recipe_count ?? 0;
    }

    // レシピ数に応じた色を返す
    function getColorForCount(count) {
      if (count === 0) return '#E8DCC8';
      if (count <= 2) return '#D4B896';
      if (count <= 5) return '#C49A6C';
      if (count <= 10) return '#A0703C';
      return '#7D4E1E';
    }

    try {
      const res = await fetch('/assets/japan-map.svg');
      const svgText = await res.text();
      mapWrapper.innerHTML = svgText;

      const svgEl = mapWrapper.querySelector('svg');
      if (svgEl) {
        // 全ての都道府県グループを処理
        const prefGroups = svgEl.querySelectorAll('.prefecture');
        for (const g of prefGroups) {
          const classes = g.className.baseVal || g.getAttribute('class') || '';
          let regionCode = null;

          // クラス名から地域コードを特定
          for (const [cls, code] of Object.entries(classToRegion)) {
            if (classes.split(/\s+/).includes(cls)) {
              regionCode = code;
              break;
            }
          }
          if (!regionCode) continue;

          const count = regionRecipeCount[regionCode] ?? 0;
          const color = getColorForCount(count);

          // fill と stroke を上書き
          g.setAttribute('fill', color);
          g.setAttribute('stroke', '#fff');
          g.setAttribute('stroke-width', '0.8');
          const shapes = g.querySelectorAll('polygon, path');
          for (const s of shapes) {
            s.setAttribute('fill', color);
            s.setAttribute('stroke', '#fff');
            s.setAttribute('stroke-width', '0.8');
          }

          // ツールチップ表示
          g.addEventListener('mouseenter', (e) => {
            const name = regionNames[regionCode] ?? regionCode;
            mapTooltip.innerHTML = `<strong>${name}</strong>${count}件のレシピ`;
            mapTooltip.style.display = 'block';
          });
          g.addEventListener('mousemove', (e) => {
            mapTooltip.style.left = (e.clientX + 12) + 'px';
            mapTooltip.style.top = (e.clientY + 12) + 'px';
          });
          g.addEventListener('mouseleave', () => {
            mapTooltip.style.display = 'none';
          });

          // クリックで地域ページへ遷移
          g.style.cursor = 'pointer';
          g.addEventListener('click', () => {
            router.navigate(`/region/${regionCode}`);
          });
        }
      }
    } catch (err) {
      console.warn('Japan map SVG の読み込みに失敗しました:', err);
    }
  }

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

  // 「活動を応援する」ボタン → 応援セクションへスクロール
  const scrollBtn = document.getElementById('scroll-to-support');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ヒーロー検索フォームのイベント
  const heroForm = document.getElementById('hero-search-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('hero-search-input').value.trim();
      if (q) router.navigate(`/search?q=${encodeURIComponent(q)}`);
    });
  }
}
