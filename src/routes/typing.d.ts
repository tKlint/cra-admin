import type { RouteObject } from 'react-router-dom';

export interface IRoutes extends RouteObject {
	name?: string;
	children?: IRoutes[];
}
