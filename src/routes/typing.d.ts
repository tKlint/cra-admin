export interface IRoutes {
  name?: string;
  caseSensitive?: boolean;
  children?: IRoutes[];
  element?: React.ReactNode;
  index?: boolean;
  path?: string;
}
