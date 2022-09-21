import { Layout } from 'antd';
import RouteView from './routeView';
import IMenu from './menu';
import HeaderComponent from './header';

import './style.less';

const { Header, Content, Sider, Footer } = Layout;

export default function BaseLayout() {
	return (
		<div className="layout-container">
			<Layout>
				<Header className="header">
					<HeaderComponent />
				</Header>
				<Layout className="content-layout">
					<Sider collapsible>
						<IMenu />
					</Sider>
					<Layout>
						<Content>
							<div className="layout-page-container">
								<RouteView />
							</div>
						</Content>
						<Footer>foofter</Footer>
					</Layout>
				</Layout>
			</Layout>
		</div>
	);
}
