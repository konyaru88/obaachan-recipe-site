/**
 * プライバシーポリシーページ
 */
import { setPage } from '../app.js';

/**
 * プライバシーポリシーページを描画する
 */
export default function renderPrivacy() {
  setPage(`
<main class="privacy-page container">
  <div class="privacy-page__inner">
    <h1 class="privacy-page__title">プライバシーポリシー</h1>
    <p class="privacy-page__updated">最終更新日：2026年3月28日</p>

    <section class="privacy-section">
      <h2>サイト運営者について</h2>
      <p>「おばあちゃんのレシピ」（以下、当サイト）は、全国のおばあちゃんの手料理を記録・発信するメディアサイトです。</p>
      <ul>
        <li>サイト名：おばあちゃんのレシピ</li>
        <li>URL：<a href="https://www.obaachan-recipe.com" target="_blank" rel="noopener noreferrer">https://www.obaachan-recipe.com</a></li>
      </ul>
    </section>

    <section class="privacy-section">
      <h2>アクセス解析ツールについて</h2>
      <p>当サイトでは、アクセス状況を把握するために <strong>Google アナリティクス（Google Analytics 4）</strong> を使用しています。</p>
      <p>Google アナリティクスはCookieを使用してデータを収集しますが、個人を特定する情報は収集しません。収集されたデータはGoogleのプライバシーポリシーに基づいて管理されます。</p>
      <p>Cookieの使用を無効化することで、データ収集を拒否することができます。詳しくは <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google アナリティクス オプトアウト アドオン</a> をご確認ください。</p>
      <p>▶ <a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer">Google プライバシーポリシー</a></p>
    </section>

    <section class="privacy-section">
      <h2>広告について</h2>
      <p>当サイトでは、第三者配信の広告サービス（<strong>Google AdSense</strong>）を利用する場合があります。</p>
      <p>広告配信事業者はCookieを使用して、ユーザーの興味に応じた広告を表示することがあります。Cookieを無効化することで、パーソナライズ広告を無効にすることができます。詳しくは <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer">Google の広告ポリシー</a> をご確認ください。</p>
    </section>

    <section class="privacy-section">
      <h2>Cookieについて</h2>
      <p>当サイトでは、アクセス解析・広告表示の目的でCookieを使用しています。ブラウザの設定からCookieを無効にすることが可能ですが、一部の機能が正常に動作しない場合があります。</p>
    </section>

    <section class="privacy-section">
      <h2>著作権について</h2>
      <p>当サイトに掲載しているテキスト・画像・レシピコンテンツの著作権は、当サイト運営者に帰属します。無断での転載・複製はご遠慮ください。</p>
    </section>

    <section class="privacy-section">
      <h2>免責事項</h2>
      <p>当サイトに掲載しているレシピ・情報は、できる限り正確な情報を提供するよう努めておりますが、内容の正確性・安全性を保証するものではありません。掲載情報を利用したことによる損害について、当サイトは一切の責任を負いかねます。</p>
      <p>また、当サイトからリンクしている外部サイトの内容について、当サイトは関与できません。</p>
    </section>

    <section class="privacy-section">
      <h2>プライバシーポリシーの変更</h2>
      <p>本ポリシーの内容は、必要に応じて変更することがあります。変更後のポリシーはこのページに掲載します。</p>
    </section>
  </div>
</main>
`);
}
