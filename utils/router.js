/**
 * History API ベースのクライアントサイドルーター
 */
export default class Router {
  constructor() {
    this.routes = [];
    this._currentParams = {};
    this._currentQuery = {};
    window.addEventListener('popstate', () => this._resolve());
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
   * 指定したパスへ遷移する
   * @param {string} path - 例: '/recipe/123'
   */
  navigate(path) {
    history.pushState({}, '', path);
    this._resolve();
  }

  /**
   * 現在のパスを解決してルーティングを開始する
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
   * 現在の pathname を解析してマッチするルートを実行する
   */
  _resolve() {
    const path = window.location.pathname || '/';
    const qs = window.location.search.slice(1);
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
    this.navigate('/');
  }
}
