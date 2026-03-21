/**
 * サイト共通フッターコンポーネント
 */

/**
 * フッターのHTML文字列を返す
 * @returns {string}
 */
export default function renderFooter() {
  return `
<footer class="footer">
  <div class="footer__inner">
    <div class="footer__brand">
      <a class="footer__logo" href="#/">
        <span class="footer__logo-icon">🍱</span>
        <span class="footer__logo-text">おばあちゃんのレシピ</span>
      </a>
      <p class="footer__tagline">古き良き味を、未来へつなぐ</p>
    </div>

    <nav class="footer__nav" aria-label="フッターナビゲーション">
      <a href="#/" class="footer__link">ホーム</a>
      <a href="#/recipes" class="footer__link">レシピ一覧</a>
      <a href="#/regions" class="footer__link">地域で探す</a>
    </nav>
  </div>

  <div class="footer__bottom">
    <p class="footer__copy">&copy; 2025 おばあちゃんのレシピ</p>
  </div>
</footer>
`;
}
