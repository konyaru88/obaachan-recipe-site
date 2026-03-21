/**
 * データ取得とキャッシュ管理
 */

let _recipesCache = null;
let _regionsCache = null;

/**
 * data/recipes.json を fetch してキャッシュする
 * @returns {Promise<Recipe[]>}
 */
export async function fetchRecipes() {
  if (_recipesCache) return _recipesCache;
  try {
    const res = await fetch('./data/recipes.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    _recipesCache = data.recipes ?? data;
    return _recipesCache;
  } catch (e) {
    console.error('fetchRecipes error:', e);
    _recipesCache = [];
    return _recipesCache;
  }
}

/**
 * IDでレシピを1件取得する
 * @param {string|number} id
 * @returns {Promise<Recipe|null>}
 */
export async function getRecipeById(id) {
  const recipes = await fetchRecipes();
  return recipes.find((r) => String(r.id) === String(id)) ?? null;
}

/**
 * 地方コードでレシピを絞り込む
 * @param {string} areaCode
 * @returns {Promise<Recipe[]>}
 */
export async function getRecipesByRegion(areaCode) {
  const recipes = await fetchRecipes();
  return recipes.filter((r) => r.region?.area === areaCode || r.area_code === areaCode);
}

/**
 * タグでレシピを絞り込む
 * @param {string} tag
 * @returns {Promise<Recipe[]>}
 */
export async function getRecipesByTag(tag) {
  const recipes = await fetchRecipes();
  return recipes.filter(
    (r) => Array.isArray(r.tags) && r.tags.includes(tag)
  );
}

/**
 * 全文検索: title, tags, story, grandmother.prefecture を対象にする
 * @param {string} query
 * @returns {Promise<Recipe[]>}
 */
export async function searchRecipes(query) {
  if (!query || !query.trim()) return [];
  const recipes = await fetchRecipes();
  const q = query.trim().toLowerCase();
  return recipes.filter((r) => {
    const fields = [
      r.title ?? '',
      (r.tags ?? []).join(' '),
      r.story ?? '',
      r.grandmother?.prefecture ?? '',
      r.grandmother?.name ?? '',
      r.description ?? '',
      r.food_culture_background ?? '',
    ];
    return fields.some((f) => f.toLowerCase().includes(q));
  });
}

/**
 * 注目レシピ（is_featured フラグが true のもの）を返す
 * @returns {Promise<Recipe[]>}
 */
export async function getFeaturedRecipes() {
  const recipes = await fetchRecipes();
  return recipes.filter((r) => r.meta?.is_featured === true || r.is_featured === true);
}

/**
 * 消えゆくレシピ（is_endangered フラグが true のもの）を返す
 * @returns {Promise<Recipe[]>}
 */
export async function getEndangeredRecipes() {
  const recipes = await fetchRecipes();
  return recipes.filter((r) => r.meta?.is_endangered === true || r.is_endangered === true);
}

/**
 * data/regions.json を fetch してキャッシュする
 * @returns {Promise<Area[]>}
 */
export async function fetchRegions() {
  if (_regionsCache) return _regionsCache;
  try {
    const res = await fetch('./data/regions.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    _regionsCache = data.areas ?? data;
    return _regionsCache;
  } catch (e) {
    console.error('fetchRegions error:', e);
    _regionsCache = [];
    return _regionsCache;
  }
}
