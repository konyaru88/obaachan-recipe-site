/**
 * 活動応援ページ
 */
import { setPage } from '../app.js';

export default function renderSupport() {
  setPage(`
<main class="support-page">

  <div class="support-page__hero">
    <div class="support-page__deco" aria-hidden="true">🍙</div>
    <h1 class="support-page__title">おばあちゃんの「あの味」を、<br>一緒に残しませんか</h1>
  </div>

  <div class="support-page__body container">

    <section class="support-page__section">
      <h2 class="support-page__section-title">この活動について</h2>
      <p>「おばあちゃんのレシピ」は、個人で運営しているメディアです。</p>
      <p>まだ立ち上がったばかりの小さなメディアで、みなさんから寄せていただいたレシピの情報やアンケートをもとに運営しています。</p>
      <p>でも、ゆくゆくは全国のおばあちゃんを直接訪ねて取材した一次情報だけを届けていきたい。レシピの正確な記録だけでなく、当時の会話やエピソード、その土地の食文化とあわせて丁寧に伝えていきたいと思っています。</p>
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

    <section class="support-page__section">
      <h2 class="support-page__section-title">今後予定している活動</h2>
      <ul class="support-page__list">
        <li>🍲 <strong>「あの味」の再現プロジェクト</strong><br>もう聞けなくなってしまったおばあちゃんの味を、料理の専門家や食文化を研究する大学教授と一緒に本気で再現する活動</li>
        <li>🛍 <strong>おばあちゃんの「あの味」の販売</strong><br>おばあちゃん自身が作った料理を届けることで、新しい雇用やおばあちゃんへの収入につなげる取り組み</li>
        <li>🏘 <strong>地域・産業の盛り上げ</strong><br>衰退しつつあるおばあちゃんたちの技や文化を、地域ごとの食産業として育てていく活動</li>
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
