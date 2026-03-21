/**
 * ホームページ
 */
import { setPage } from '../app.js';
import {
  getEndangeredRecipes,
  fetchRecipes,
  fetchRegions,
} from '../utils/store.js';
import renderRecipeCard from '../components/recipe-card.js';
import { escapeHtml, areaName } from '../utils/helpers.js';

/**
 * ホームページを描画する
 * @param {import('../utils/router.js').default} router
 */
export default async function renderHome(router) {
  // データを並行取得
  const [endangered, allRecipes, regions] = await Promise.all([
    getEndangeredRecipes(),
    fetchRecipes(),
    fetchRegions(),
  ]);

  // 消えゆくレシピ（最大3件）
  const endangeredSlice = endangered.slice(0, 3);

  // 新着レシピ（最大6件 - IDの降順）
  const latest = [...allRecipes]
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 6);

  // 地域ボタン（8地方）
  const regionButtons = regions.length > 0
    ? regions.map((r) => `
        <a href="#/region/${escapeHtml(r.code)}" class="region-btn" style="--region-color:${escapeHtml(r.color ?? '#8B4513')}">
          <span class="region-btn__icon" aria-hidden="true">${escapeHtml(r.icon ?? '🗾')}</span>
          <span class="region-btn__name">${escapeHtml(r.name ?? areaName(r.code))}</span>
          ${r.recipe_count != null ? `<span class="region-btn__count">${escapeHtml(String(r.recipe_count))}件</span>` : ''}
        </a>
      `).join('')
    : ['hokkaido', 'tohoku', 'kanto', 'chubu', 'kinki', 'chugoku', 'shikoku', 'kyushu'].map((code) => `
        <a href="#/region/${code}" class="region-btn">
          <span class="region-btn__name">${escapeHtml(areaName(code))}</span>
        </a>
      `).join('');

  // 消えゆくレシピセクション
  const endangeredSection = endangeredSlice.length > 0 ? `
    <section class="home__endangered" aria-labelledby="endangered-heading">
      <div class="section-header section-header--endangered">
        <h2 id="endangered-heading" class="section-title section-title--endangered">
          <span aria-hidden="true">🕯</span> 消えゆくレシピ
        </h2>
        <p class="section-subtitle">次の世代に伝えたい、失われつつある郷土の味</p>
      </div>
      <div class="recipe-grid recipe-grid--3">
        ${endangeredSlice.map(renderRecipeCard).join('')}
      </div>
      <div class="section-footer">
        <a href="#/recipes?filter=endangered" class="btn btn--outline">消えゆくレシピをすべて見る</a>
      </div>
    </section>
  ` : '';

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

  <!-- 消えゆくレシピ特集 -->
  ${endangeredSection}

  <!-- 新着レシピ -->
  <section class="home__latest" aria-labelledby="latest-heading">
    <div class="container">
      <div class="section-header">
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

  <!-- 地域で探す -->
  <section class="home__regions" aria-labelledby="regions-heading">
    <div class="container">
      <div class="section-header">
        <h2 id="regions-heading" class="section-title">地域で探す</h2>
        <p class="section-subtitle">あなたのふるさとの味、探してみませんか</p>
      </div>
      <div class="region-grid">
        ${regionButtons}
      </div>
      <div class="section-footer">
        <a href="#/regions" class="btn btn--outline">地域一覧をすべて見る</a>
      </div>
    </div>
  </section>

  <!-- サービスの想い -->
  <section class="home__about" aria-labelledby="about-heading">
    <div class="container">
      <div class="about-block">
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
