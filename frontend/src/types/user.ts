export type Role = "DM" | "PLAYER";

export interface User {
  id: string;
  username: string;
  role: Role;
}
