/**
 * レシピ詳細ページ
 */
import { setPage } from '../app.js';
import { getRecipeById, fetchRecipes } from '../utils/store.js';
import renderRecipeCard from '../components/recipe-card.js';
import { escapeHtml, formatTime, difficultyStars, seasonEmoji, truncate } from '../utils/helpers.js';

export default async function renderDetail({ params = {} } = {}, router) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    setPage(`
      <main class="container" style="padding:4rem 0;text-align:center;">
        <p style="font-size:3rem;">😢</p>
        <p>レシピが見つかりませんでした。</p>
        <a href="#/recipes" class="btn btn--outline" style="margin-top:1rem;display:inline-block;">レシピ一覧へ戻る</a>
      </main>
    `);
    return;
  }

  // JSONの実際の構造に合わせてフィールドを取り出す
  const id = recipe.id ?? '';
  const title = recipe.title ?? '';
  const grandmother = recipe.grandmother ?? {};
  const region = recipe.region ?? {};
  const meta = recipe.meta ?? {};
  const tags = recipe.tags ?? [];
  const servings = recipe.servings ?? 2;
  const cookTime = recipe.cook_time_minutes ?? recipe.cook_time;
  const prepTime = recipe.prep_time_minutes ?? recipe.prep_time;
  const difficulty = recipe.difficulty;
  const isEndangered = meta.is_endangered ?? recipe.is_endangered ?? false;
  const imageUrl = recipe.photos?.main ?? recipe.photos?.thumbnail ?? '';
  const areaCode = region.area ?? recipe.area_code ?? '';
  const prefecture = grandmother.prefecture ?? region.prefecture ?? '';
  const ingredients = recipe.ingredients ?? [];
  const steps = recipe.steps ?? [];
  const grandmaNotes = recipe.grandma_notes ?? (recipe.grandmother_memo ? [recipe.grandmother_memo] : []);
  const culturalBg = recipe.cultural_background ?? {};
  const seasonArr = Array.isArray(recipe.season) ? recipe.season : (recipe.season ? [recipe.season] : []);

  // 関連レシピ（同地方の他レシピ最大4件）
  const allRecipes = await fetchRecipes();
  const related = allRecipes
    .filter((r) => (r.region?.area ?? r.area_code) === areaCode && String(r.id) !== String(id))
    .slice(0, 4);

  // ヒーロー画像
  const heroImg = imageUrl
    ? `<img class="detail__hero-img" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" onerror="this.onerror=null;this.src='';this.parentNode.style.background='#EDE5D8';">`
    : '';

  // バッジ
  const endangeredBadge = isEndangered
    ? `<span class="badge badge--endangered">🕯 消えゆくレシピ</span>` : '';
  const regionBadge = prefecture
    ? `<span class="badge badge--region">${escapeHtml(prefecture)}</span>` : '';
  const seasonBadge = seasonArr.length > 0
    ? `<span class="badge badge--season">${seasonEmoji(seasonArr[0])} ${escapeHtml(seasonArr.join('・'))}</span>` : '';

  // タグ
  const tagChips = tags.map(
    (t) => `<a href="#/recipes?tag=${encodeURIComponent(t)}" class="tag-chip">${escapeHtml(t)}</a>`
  ).join('');

  // 材料（グループ構造対応）
  const ingredientRows = ingredients.map((group) => {
    const groupHeader = group.group
      ? `<tr class="ingredient-group-header"><td colspan="2" class="ingredient__group">${escapeHtml(group.group)}</td></tr>` : '';
    const items = (group.items ?? [group]).map((ing) => {
      const baseAmount = ing.amount ?? '';
      const hasGrandma = !!ing.grandma_amount;
      return `<tr class="ingredient-row" data-base-amount="${escapeHtml(String(baseAmount))}" data-unit="${escapeHtml(ing.unit ?? '')}">
        <td class="ingredient__name">${escapeHtml(ing.name ?? '')}</td>
        <td class="ingredient__amount">
          ${hasGrandma ? `
            <span class="ingredient__grandma">${escapeHtml(ing.grandma_amount)}</span>
            <span class="ingredient__precise" style="display:none">
              <span class="ingredient__qty">${escapeHtml(String(baseAmount))}</span>${escapeHtml(ing.unit ?? '')}
            </span>
          ` : `
            <span class="ingredient__precise-always"><span class="ingredient__qty">${escapeHtml(String(baseAmount))}</span>${escapeHtml(ing.unit ?? '')}</span>
          `}
          ${ing.note ? `<small class="ingredient__note">（${escapeHtml(ing.note)}）</small>` : ''}
        </td>
      </tr>`;
    }).join('');
    return groupHeader + items;
  }).join('');

  // 手順
  const stepItems = steps.map((step, i) => {
    const num = step.step ?? (i + 1);
    const text = step.description ?? step.text ?? String(step);
    return `<li class="step">
      <div class="step__num">${num}</div>
      <div class="step__content">
        ${step.title ? `<p class="step__title">${escapeHtml(step.title)}</p>` : ''}
        <p class="step__text">${escapeHtml(text)}</p>
        ${step.tip ? `<p class="step__tip">💡 ${escapeHtml(step.tip)}</p>` : ''}
      </div>
    </li>`;
  }).join('');

  // おばあちゃんのメモ（配列）
  const memoSection = grandmaNotes.length > 0 ? `
    <section class="detail__memo" aria-labelledby="memo-heading">
      <h2 id="memo-heading" class="detail__section-title">📝 おばあちゃんのメモ</h2>
      <div class="memo-box">
        ${grandmaNotes.map((note) => `<p class="memo-box__text">「${escapeHtml(note)}」</p>`).join('')}
      </div>
    </section>
  ` : '';

  // 食文化背景
  const bgHistory = culturalBg.history ?? '';
  const bgIngredients = (culturalBg.local_ingredients ?? []).join('、');
  const bgSimilar = (culturalBg.similar_dishes ?? []).join('、');
  const backgroundSection = (bgHistory || bgIngredients) ? `
    <section class="detail__background" aria-labelledby="background-heading">
      <h2 id="background-heading" class="detail__section-title">📖 食文化の背景</h2>
      <div class="background-block">
        ${bgHistory ? `<p class="background-block__text">${escapeHtml(bgHistory)}</p>` : ''}
        ${bgIngredients ? `<p class="background-block__text"><strong>この地域の特産食材：</strong>${escapeHtml(bgIngredients)}</p>` : ''}
        ${bgSimilar ? `<p class="background-block__text"><strong>似た料理：</strong>${escapeHtml(bgSimilar)}</p>` : ''}
      </div>
    </section>
  ` : '';

  // 関連レシピ
  const relatedSection = related.length > 0 ? `
    <section class="detail__related">
      <div class="container">
        <h2 class="detail__section-title">🍽 同じ地域のレシピ</h2>
        <div class="recipe-grid recipe-grid--4">
          ${related.map(renderRecipeCard).join('')}
        </div>
      </div>
    </section>
  ` : '';

  const html = `
<main id="main" class="detail-page">

  <div class="detail__hero">
    ${heroImg}
    <div class="detail__hero-overlay"></div>
  </div>

  <div class="container">

    <section class="detail__info">
      <div class="detail__badges">${endangeredBadge}${regionBadge}${seasonBadge}</div>
      <h1 class="detail__title">${escapeHtml(title)}</h1>

      ${grandmother.name ? `
      <div class="detail__grandmother">
        <div class="grandmother-icon">👵</div>
        <div class="grandmother-info">
          <p class="grandmother-info__name">${escapeHtml(grandmother.name)}${grandmother.age ? `（${grandmother.age}歳）` : ''}</p>
          ${grandmother.city ? `<p class="grandmother-info__place">${escapeHtml(grandmother.city)}${grandmother.village ? ` ${escapeHtml(grandmother.village)}` : ''}</p>` : ''}
          ${grandmother.message ? `<p class="grandmother-info__message">"${escapeHtml(truncate(grandmother.message, 80))}"</p>` : ''}
        </div>
      </div>
      ` : ''}

      <ul class="detail__meta">
        ${prepTime ? `<li class="detail__meta-item"><span class="detail__meta-label">下準備</span><span class="detail__meta-value">${formatTime(prepTime)}</span></li>` : ''}
        <li class="detail__meta-item"><span class="detail__meta-label">調理時間</span><span class="detail__meta-value">${formatTime(cookTime)}</span></li>
        <li class="detail__meta-item"><span class="detail__meta-label">人数</span><span class="detail__meta-value" id="current-servings">${servings}人分</span></li>
        <li class="detail__meta-item"><span class="detail__meta-label">難易度</span><span class="detail__meta-value">${difficultyStars(difficulty)}</span></li>
      </ul>

      <div class="detail__tags">${tagChips}</div>
    </section>

    <section class="detail__ingredients">
      <div class="detail__ingredients-header">
        <h2 class="detail__section-title">🧂 材料</h2>
        <div class="servings-control">
          <button class="servings-btn" id="servings-minus">−</button>
          <span class="servings-display"><output id="servings-output">${servings}</output>人分</span>
          <button class="servings-btn" id="servings-plus">＋</button>
        </div>
      </div>
      <div class="measure-toggle">
        <button class="measure-toggle__btn measure-toggle__btn--active" data-mode="grandma">
          👵 おばあちゃん流
        </button>
        <button class="measure-toggle__btn" data-mode="precise">
          ⚖️ きっちり計量
        </button>
      </div>
      <table class="ingredient-table">
        <tbody id="ingredient-tbody">${ingredientRows}</tbody>
      </table>
    </section>

    <section class="detail__steps">
      <h2 class="detail__section-title">👩‍🍳 作り方</h2>
      <ol class="step-list">${stepItems}</ol>
    </section>

    ${memoSection}
    ${backgroundSection}

  </div>

  ${relatedSection}

</main>
`;

  setPage(html);

  // 人数変更インタラクション
  let currentServings = Number(servings) || 2;
  const baseServings = currentServings;
  const output = document.getElementById('servings-output');
  const tbody = document.getElementById('ingredient-tbody');
  const currentServingsEl = document.getElementById('current-servings');

  function updateServings(n) {
    currentServings = Math.max(1, Math.min(20, n));
    if (output) output.textContent = currentServings;
    if (currentServingsEl) currentServingsEl.textContent = `${currentServings}人分`;
    if (!tbody) return;
    tbody.querySelectorAll('.ingredient-row').forEach((row) => {
      const base = parseFloat(row.dataset.baseAmount);
      const qtyEl = row.querySelector('.ingredient__qty');
      if (!qtyEl || isNaN(base) || base === 0) return;
      const scaled = (base / baseServings) * currentServings;
      qtyEl.textContent = Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(1);
    });
  }

  const minusBtn = document.getElementById('servings-minus');
  const plusBtn = document.getElementById('servings-plus');
  if (minusBtn) minusBtn.addEventListener('click', () => updateServings(currentServings - 1));
  if (plusBtn) plusBtn.addEventListener('click', () => updateServings(currentServings + 1));

  // おばあちゃん流 / きっちり計量 トグル
  const toggleBtns = document.querySelectorAll('.measure-toggle__btn');
  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach((b) => b.classList.remove('measure-toggle__btn--active'));
      btn.classList.add('measure-toggle__btn--active');
      const mode = btn.dataset.mode;
      if (!tbody) return;
      const grandmaEls = tbody.querySelectorAll('.ingredient__grandma');
      const preciseEls = tbody.querySelectorAll('.ingredient__precise');
      if (mode === 'grandma') {
        grandmaEls.forEach((el) => { if (el.textContent.trim()) el.style.display = ''; });
        preciseEls.forEach((el) => { el.style.display = 'none'; });
      } else {
        grandmaEls.forEach((el) => { el.style.display = 'none'; });
        preciseEls.forEach((el) => { el.style.display = ''; });
      }
    });
  });
}
