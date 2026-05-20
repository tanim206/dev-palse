export interface IUer {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: "maintainer" | "contributor";
}
