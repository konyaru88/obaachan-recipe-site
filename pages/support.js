/**
 * 活動応援ページ
 */
import { setPage } from '../app.js';

export default function renderSupport() {
  setPage(`
<main class="support-page">

  <div class="support-page__hero">
    <div class="support-page__deco" aria-hidden="true">🍙</div>
    <h1 class="support-page__title">おばあちゃんの味を、<br>一緒に残しませんか</h1>
    <p class="support-page__lead">
      消えゆく郷土料理と、おばあちゃんたちの記憶を<br>
      次の世代へつないでいくための活動を応援してください。
    </p>
  </div>

  <div class="support-page__body container">

    <section class="support-page__section">
      <h2 class="support-page__section-title">この活動について</h2>
      <p>「おばあちゃんのレシピ」は、広告収入に頼らず個人で運営しているメディアです。</p>
      <p>全国のおばあちゃんを直接訪ねて取材し、レシピだけでなく当時の会話やエピソード、食文化とあわせて記録しています。</p>
      <p>「計量カップは使わない、だいたいこのくらい」——そんな言葉の中に詰まった知恵を、きちんと形にして残したいと思っています。</p>
    </section>

    <section class="support-page__section">
      <h2 class="support-page__section-title">支援の使い道</h2>
      <ul class="support-page__list">
        <li>🚗 全国のおばあちゃんを訪ねる取材費・交通費</li>
        <li>📝 レシピの記録・編集・サイトへの掲載</li>
        <li>🌐 サイトの維持・運営費</li>
        <li>📸 取材時の撮影・記録</li>
      </ul>
    </section>

    <section class="support-page__cta">
      <p class="support-page__cta-text">100円から支援できます。<br>クレジットカード・PayPal対応。</p>
      <a
        href="https://buymeacoffee.com/obaachanrev"
        target="_blank"
        rel="noopener noreferrer"
        class="support-page__btn"
      >
        🍙 この活動を応援する
      </a>
      <p class="support-page__cta-note">
        支援はBuy Me a Coffeeというサービスを通じて行われます。<br>
        あなたの決済情報がこのサイトに渡ることはありません。
      </p>
    </section>

  </div>
</main>
`);
}
