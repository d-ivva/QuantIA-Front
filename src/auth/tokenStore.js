const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL    ?? 'http://localhost:8180';
const REALM        = import.meta.env.VITE_KEYCLOAK_REALM   ?? 'quantia';
const CLIENT_ID    = import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'quantia-frontend';

const TOKEN_URL  = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
const LOGOUT_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;

const ACCESS_KEY  = 'q_access';
const REFRESH_KEY = 'q_refresh';

function parseJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

class TokenStore {
  _access  = sessionStorage.getItem(ACCESS_KEY)  ?? null;
  _refresh = sessionStorage.getItem(REFRESH_KEY) ?? null;
  _timer   = null;

  get token()         { return this._access; }
  get authenticated() { return !!this._access; }
  get userInfo()      { return this._access ? parseJwt(this._access) : null; }

  // ─── Login ────────────────────────────────────────────────────────
  async login(username, password) {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'password', client_id: CLIENT_ID, username, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error_description ?? 'Credenciais inválidas.');
    }

    const data = await res.json();
    this._persist(data.access_token, data.refresh_token, data.expires_in);

    // Recarrega a página para garantir estado limpo com o novo usuário.
    // Qualquer singleton JS que possa ter estado do usuário anterior é resetado.
    window.location.href = window.location.origin;
  }

  // ─── Refresh ──────────────────────────────────────────────────────
  async refresh() {
    if (!this._refresh) { this._clearAndReload(); return; }

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', client_id: CLIENT_ID, refresh_token: this._refresh }),
    });

    if (!res.ok) { this._clearAndReload(); return; }

    const data = await res.json();
    this._persist(data.access_token, data.refresh_token, data.expires_in);
  }

  // ─── Logout ───────────────────────────────────────────────────────
  logout() {
    const refreshToken = this._refresh;

    // Limpa localmente e invalida no Keycloak em background
    this._clear();
    if (refreshToken) {
      fetch(LOGOUT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: CLIENT_ID, refresh_token: refreshToken }),
      }).catch(() => {});
    }

    // Recarrega para estado completamente limpo
    window.location.href = window.location.origin;
  }

  // ─── Validate on page load ────────────────────────────────────────
  async validate() {
    if (!this._access) return false;
    const parsed = parseJwt(this._access);
    if (!parsed) return false;

    const now = Math.floor(Date.now() / 1000);
    if (parsed.exp > now + 30) {
      this._scheduleRefresh((parsed.exp - now - 60) * 1000);
      return true;
    }
    if (this._refresh) {
      await this.refresh();
      return !!this._access;
    }
    return false;
  }

  // ─── Private ──────────────────────────────────────────────────────
  _persist(access, refresh, expiresIn) {
    this._access  = access;
    this._refresh = refresh;
    sessionStorage.setItem(ACCESS_KEY,  access);
    sessionStorage.setItem(REFRESH_KEY, refresh);
    this._scheduleRefresh(Math.max((expiresIn - 60) * 1000, 10_000));
  }

  _scheduleRefresh(ms) {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.refresh(), ms);
  }

  _clear() {
    this._access  = null;
    this._refresh = null;
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    clearTimeout(this._timer);
  }

  _clearAndReload() {
    this._clear();
    window.location.href = window.location.origin;
  }

  // Usado após exclusão de conta (sem chamar logout no Keycloak — usuário já não existe)
  clearSession() {
    this._clear();
    window.location.href = window.location.origin;
  }
}

export const tokenStore = new TokenStore();
