const TOKEN_KEY = 'fintech_auth_token';

/**
 * TokenStorage: Encapsulamiento de la persistencia de tokens de autenticación en cliente.
 * 
 * DECISIÓN DIDÁCTICA:
 * Se utiliza `localStorage` únicamente como decisión didáctica en esta versión sin SSR o Server-Side Sessions.
 * 
 * ALTERNATIVA RECOMENDADA EN PRODUCCIÓN (HttpOnly Cookies):
 * En un entorno real de producción, el backend debe emitir tokens de autenticación en cookies HTTP con los atributos:
 *   Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict; Path=/
 * Esto previene ataques de Cross-Site Scripting (XSS) y evita la manipulación o filtrado del token desde JavaScript en el cliente.
 */
export class TokenStorage {
  static getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Ignorar errores de almacenamiento (ej. modo privado restringido)
    }
  }

  static removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignorar errores
    }
  }
}
