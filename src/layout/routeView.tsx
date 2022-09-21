import React, { FC, Suspense } from 'react';
import { Outlet } from 'react-router';

import SuspendFallbackLoading from './SuspendFallbackLoading';

export const RouteView: FC = () => {
	return (
		<Suspense
			fallback={
				<SuspendFallbackLoading
					message="Alert message title"
					description="Further details about the context of this alert."
				/>
			}
		>
			<Outlet />
		</Suspense>
	);
};

export default RouteView;
