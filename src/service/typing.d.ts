declare namespace API {}

declare namespace AdminAPIResponse {
  type SignUp = {
    email: string;
    id: number;
    loginId: string;
  };
  type WhoAmI = {
    Roles: UserRole[];
    email: string;
    id: number;
    loginId: string;
  };
}
