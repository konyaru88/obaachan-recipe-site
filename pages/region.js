/**
 * 地域ページ（全地方一覧 / 地方別レシピ一覧）
 */
import { setPage } from '../app.js';
import { getRecipesByRegion, fetchRecipes, fetchRegions } from '../utils/store.js';
import renderRecipeCard from '../components/recipe-card.js';
import { escapeHtml, areaName } from '../utils/helpers.js';

/** デフォルトの地方データ（regions.json がない場合のフォールバック） */
const DEFAULT_REGIONS = [
  { code: 'hokkaido', name: '北海道', icon: '🐻', color: '#2B6CB0', catch: '雄大な自然が育む、北の大地の恵み', description: '広大な大地と豊かな自然に恵まれた北海道。乳製品・海鮮・じゃがいもなどを活かした素朴で力強い料理が特徴です。' },
  { code: 'tohoku',   name: '東北',   icon: '⛩', color: '#276749', catch: '厳しい寒さが生んだ、保存の知恵', description: '冬の寒さが長い東北では、保存食文化が発達。漬物・干物・味噌など、発酵・保存の技術が料理に根付いています。' },
  { code: 'kanto',    name: '関東',   icon: '🗼', color: '#744210', catch: '江戸の粋と多様な食文化の交差点', description: '江戸時代から続く食文化が今も息づく関東。濃いめの醤油文化と、全国各地から集まった料理が融合しています。' },
  { code: 'hokuriku',    name: '北陸',     icon: '🦀', color: '#2980B9', catch: '日本海の恵みと発酵の美食文化', description: '日本海に面した北陸は、加賀料理に代表される繊細な食文化と、かぶら寿しやへしこなどの発酵食品が根付く地域です。' },
  { code: 'koshinetsu',  name: '甲信越',   icon: '🗻', color: '#8E44AD', catch: '山々に囲まれた里の素朴な味', description: '日本アルプスに囲まれた甲信越は、野沢菜漬け・おやき・ほうとう・へぎそばなど、山の知恵が詰まった郷土料理の宝庫です。' },
  { code: 'tokai',       name: '東海',     icon: '🏯', color: '#D35400', catch: '味噌と醤油の濃厚な旨み', description: '八丁味噌・たまり醤油に代表される独自の調味料文化が特徴。味噌煮込みうどん・ひつまぶしなど個性豊かな料理が揃います。' },
  { code: 'kinki',    name: '近畿',   icon: '🏯', color: '#C05621', catch: '千年の都が育んだ、繊細な味わい', description: '京都・大阪・奈良など歴史的な都市が集まる近畿。薄口醤油・だし文化・精進料理など、繊細な味付けが特徴です。' },
  { code: 'chugoku',  name: '中国',   icon: '⛩', color: '#285E61', catch: '瀬戸内の海と山里が育む素朴な味', description: '瀬戸内海の豊かな海の幸と、山陰の山の幸が共存する中国地方。牡蠣・あなご・そろばん豆腐など個性豊かな料理が揃います。' },
  { code: 'shikoku',  name: '四国',   icon: '🍋', color: '#6B46C1', catch: '遍路の地に宿る、清らかな食文化', description: '弘法大師・空海ゆかりの四国遍路の地。柚子・カツオ・そうめんなど、清楚で素朴な食材を活かした料理が根付いています。' },
  { code: 'kyushu',   name: '九州・沖縄', icon: '🌺', color: '#9B2C2C', catch: '南国の陽気と大陸の影響を受けた味', description: '温暖な気候と大陸・南洋文化の影響を受けた九州・沖縄。豚骨・からし蓮根・ゴーヤチャンプルーなど個性豊かな料理が揃います。' },
];

/**
 * 地域ページを描画する
 * @param {{ params: Object, query: Object }} ctx
 * @param {import('../utils/router.js').default} router
 */
export default async function renderRegion({ params = {}, query = {} } = {}, router) {
  const code = params.code ?? null;

  if (code) {
    await renderRegionDetail(code, router);
  } else {
    await renderRegionIndex(router);
  }
}

/**
 * 全地方一覧を描画する
 */
async function renderRegionIndex(router) {
  const [regionsData, allRecipes] = await Promise.all([
    fetchRegions(),
    fetchRecipes(),
  ]);

  // regions.json があればそれを使い、なければデフォルトを使う
  const regions = regionsData.length > 0 ? regionsData : DEFAULT_REGIONS;

  // 地方ごとのレシピ件数を集計
  const countMap = {};
  allRecipes.forEach((r) => {
    const key = r.region?.area ?? r.area_code;
    if (key) countMap[key] = (countMap[key] ?? 0) + 1;
  });

  const regionCards = regions.map((r) => {
    const count = r.recipe_count ?? countMap[r.code] ?? 0;
    const color = r.color ?? '#8B4513';
    const catchCopy = r.catch ?? r.catchcopy ?? '';
    return `
      <a href="/region/${escapeHtml(r.code)}" class="region-card" style="--region-color:${escapeHtml(color)};">
        <div class="region-card__header">
          <span class="region-card__icon" aria-hidden="true">${escapeHtml(r.icon ?? '🗾')}</span>
          <h2 class="region-card__name">${escapeHtml(r.name ?? areaName(r.code))}</h2>
        </div>
        ${catchCopy ? `<p class="region-card__catch">${escapeHtml(catchCopy)}</p>` : ''}
        <p class="region-card__count">${count}件のレシピ</p>
      </a>
    `;
  }).join('');

  const html = `
<main id="main" class="region-page">
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">地域で探す</h1>
      <p class="page-subtitle">日本全国、47都道府県のおばあちゃんの味をお届けします。</p>
    </div>
    <div class="region-card-grid">
      ${regionCards}
    </div>
  </div>
</main>
`;

  setPage(html);
}

/**
 * 特定地方のレシピ一覧を描画する
 * @param {string} code
 * @param {import('../utils/router.js').default} router
 */
async function renderRegionDetail(code, router) {
  const [regionsData, recipes] = await Promise.all([
    fetchRegions(),
    getRecipesByRegion(code),
  ]);

  const regions = regionsData.length > 0 ? regionsData : DEFAULT_REGIONS;
  const regionInfo = regions.find((r) => r.code === code) ?? null;

  const name = regionInfo?.name ?? areaName(code);
  const description = regionInfo?.description ?? '';
  const color = regionInfo?.color ?? '#8B4513';
  const icon = regionInfo?.icon ?? '🗾';

  const gridHtml = recipes.length > 0
    ? `<div class="recipe-grid recipe-grid--3">${recipes.map(renderRecipeCard).join('')}</div>`
    : `<div class="empty-state">
        <p class="empty-state__icon" aria-hidden="true">🍳</p>
        <p class="empty-state__msg">この地域のレシピはまだ登録されていません。</p>
        <a href="/regions" class="btn btn--outline">地域一覧へ戻る</a>
      </div>`;

  // 他の地方へのナビゲーション
  const regions8 = (regionsData.length > 0 ? regionsData : DEFAULT_REGIONS);
  const otherRegionLinks = regions8
    .filter((r) => r.code !== code)
    .map((r) => `<a href="/region/${escapeHtml(r.code)}" class="region-nav-link">${escapeHtml(r.icon ?? '')} ${escapeHtml(r.name ?? areaName(r.code))}</a>`)
    .join('');

  const html = `
<main id="main" class="region-page region-page--detail">

  <!-- 地方ヘッダー -->
  <div class="region-hero" style="--region-color:${escapeHtml(color)};">
    <div class="region-hero__inner">
      <span class="region-hero__icon" aria-hidden="true">${escapeHtml(icon)}</span>
      <div class="region-hero__text">
        <nav class="breadcrumb" aria-label="パンくず">
          <a href="/" class="breadcrumb__link">ホーム</a>
          <span class="breadcrumb__sep" aria-hidden="true">›</span>
          <a href="/regions" class="breadcrumb__link">地域で探す</a>
          <span class="breadcrumb__sep" aria-hidden="true">›</span>
          <span class="breadcrumb__current" aria-current="page">${escapeHtml(name)}</span>
        </nav>
        <h1 class="region-hero__title">${escapeHtml(name)}</h1>
        ${description ? `<p class="region-hero__description">${escapeHtml(description)}</p>` : ''}
        <p class="region-hero__count">${recipes.length}件のレシピ</p>
      </div>
    </div>
  </div>

  <div class="container">
    <!-- レシピグリッド -->
    ${gridHtml}

    <!-- 他の地方へのリンク -->
    <nav class="region-nav" aria-label="他の地方を見る">
      <h2 class="region-nav__title">他の地域のレシピを見る</h2>
      <div class="region-nav__links">
        ${otherRegionLinks}
      </div>
    </nav>
  </div>

</main>
`;

  setPage(html);
}
