/**
 * レシピカードコンポーネント
 */
import { escapeHtml, formatTime, difficultyStars, areaName } from '../utils/helpers.js';

export default function renderRecipeCard(recipe) {
  const id = recipe.id ?? '';
  const title = recipe.title ?? '';
  const grandmother = recipe.grandmother ?? {};
  const region = recipe.region ?? {};
  const meta = recipe.meta ?? {};
  const tags = recipe.tags ?? [];
  const servings = recipe.servings;
  const cookTime = recipe.cook_time_minutes ?? recipe.cook_time;
  const difficulty = recipe.difficulty;
  const isEndangered = meta.is_endangered ?? recipe.is_endangered ?? false;
  const imageUrl = recipe.photos?.main ?? recipe.photos?.thumbnail ?? recipe.image ?? '';
  const areaCode = region.area ?? recipe.area_code ?? '';

  const safeTitle = escapeHtml(title);
  const grandName = escapeHtml(grandmother.name ?? '');
  const grandAge = grandmother.age ? `（${grandmother.age}歳）` : '';
  const prefecture = escapeHtml(grandmother.prefecture ?? region.prefecture ?? areaName(areaCode));
  const stars = difficultyStars(difficulty);
  const timeStr = formatTime(cookTime);
  const servingsStr = servings ? `${servings}人分` : '-';

  const categoryEmoji = {
    '汁物': '🍲', '主菜': '🐟', '副菜': '🥬',
    '漬物': '🥒', 'ごはんもの': '🍚', 'おやつ': '🍡',
  };
  const emoji = recipe.thumbnail_emoji || categoryEmoji[recipe.category] || '🍱';

  const placeholderImg = `<img class="recipe-card__image recipe-card__image--placeholder" src="/assets/images/sample-placeholder.png.jpg" alt="準備中" loading="lazy" />`;

  const imgTag = imageUrl
    ? `<img
         class="recipe-card__image"
         src="${escapeHtml(imageUrl)}"
         alt="${safeTitle}"
         loading="lazy"
         onerror="this.onerror=null;this.outerHTML='${placeholderImg.replace(/'/g, "\\'")}'"
       />`
    : placeholderImg;

  const endangeredBadge = '';

  // 現在はすべてサンプルデータ
  const sampleBadge = `<span class="badge badge--sample">サンプル</span>`;

  const tagItems = tags.slice(0, 3)
    .map((t) => `<span class="recipe-card__tag">${escapeHtml(t)}</span>`)
    .join('');

  return `
<article class="recipe-card">
  <a href="/recipe/${escapeHtml(String(id))}" class="recipe-card__link" aria-label="${safeTitle}のレシピを見る">
    <div class="recipe-card__thumb${imageUrl ? '' : ' recipe-card__image-placeholder'}">
      ${imgTag}
      <div class="recipe-card__badges">${endangeredBadge}${sampleBadge}</div>
      ${prefecture ? `<span class="recipe-card__region-badge">${prefecture}</span>` : ''}
    </div>
    <div class="recipe-card__body">
      <h3 class="recipe-card__title">${safeTitle}</h3>
      ${grandName ? `<p class="recipe-card__grandmother">👵 ${grandName}${grandAge}</p>` : ''}
      <div class="recipe-card__tags">${tagItems}</div>
      <ul class="recipe-card__meta">
        <li class="recipe-card__meta-item">⏱ ${timeStr}</li>
        <li class="recipe-card__meta-item">👥 ${servingsStr}</li>
        <li class="recipe-card__meta-item" aria-label="難易度">${stars}</li>
      </ul>
    </div>
  </a>
</article>
`;
}
