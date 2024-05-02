export type AuthUser = string
export interface AuthGateway {
  authenticateWithGoogle(): Promise<AuthUser>
}
