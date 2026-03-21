/**
 * ハッシュベースのクライアントサイドルーター
 */
export default class Router {
  constructor() {
    this.routes = [];
    this._currentParams = {};
    this._currentQuery = {};
    window.addEventListener('hashchange', () => this._resolve());
  }

  /**
   * ルートを追加する
   * @param {string} pattern - '/recipe/:id' のような動的セグメント対応のパターン
   * @param {Function} handler - マッチ時に呼ばれる関数 ({params, query}) => void
   */
  add(pattern, handler) {
    this.routes.push({
      pattern,
      handler,
      regex: this._patternToRegex(pattern),
    });
  }

  /**
   * 指定したハッシュへ遷移する
   * @param {string} hash - 例: '#/recipe/123'
   */
  navigate(hash) {
    window.location.hash = hash;
  }

  /**
   * 現在のハッシュを解決してルーティングを開始する
   */
  start() {
    this._resolve();
  }

  /**
   * パターン文字列を正規表現とキー配列に変換する
   * @param {string} pattern
   * @returns {{ regex: RegExp, keys: string[] }}
   */
  _patternToRegex(pattern) {
    const keys = [];
    const re = pattern.replace(/:(\w+)/g, (_, k) => {
      keys.push(k);
      return '([^/]+)';
    });
    return { regex: new RegExp(`^${re}$`), keys };
  }

  /**
   * 現在の window.location.hash を解析してマッチするルートを実行する
   */
  _resolve() {
    const raw = window.location.hash.slice(1) || '/';
    const [path, qs] = raw.split('?');
    const query = Object.fromEntries(new URLSearchParams(qs || ''));

    for (const route of this.routes) {
      const m = path.match(route.regex.regex);
      if (m) {
        const params = Object.fromEntries(
          route.regex.keys.map((k, i) => [k, m[i + 1]])
        );
        this._currentParams = params;
        this._currentQuery = query;
        route.handler({ params, query });
        return;
      }
    }

    // マッチなし → ホームへ
    this.navigate('#/');
  }
}
