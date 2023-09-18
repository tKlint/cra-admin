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
declare namespace RoutesAPI {
  type routes = {
    component: string | null;
    createdAt: string;

    icon: string | null;
    id: number;
    isShown: boolean;
    layout: boolean;
    name: string;
    parentId: number | null;
    path: string;
    redirect: string | null;
    updatedAt: string;
  };
}
