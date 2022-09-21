declare namespace API {
  type RoutesResponse = {
    router: string;
    name: string;
    component?: string;
    index?: boolean;
    children?: RoutesResponse[];
    isShown?: boolean;
  };
}
