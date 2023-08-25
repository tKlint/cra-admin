declare type SimpleObject = Record<string, unknown>;

declare type UserPermission = {
  name: string;
  description: string;
  permId: number;
};

declare type UserRouter = {
  component: string;
  icon: null | string;
  id: number;
  isShown: boolean;
  layout: boolean;
  name: string;
  parentId: null | number;
  path: string;
  redirect: string | null;
  index?: boolean;
};

declare type UserRole = {
  Permissions: UserPermission[];
  Routes: UserRouter[];
  description: string;
  id: number;
  name: string;
};

declare type UserRouterWithChildren = UserRouter & {
  children?: UserRouterWithChildren[];
};

declare type UserMenu = {
  label: string;
  key: string;
  children?: UserMenu[] | null;
};
