import React, { FC, Suspense } from 'react';
import { Outlet } from 'react-router';

import SuspendFallbackLoading from './SuspendFallbackLoading';
import { useAppSelector } from '@/store/hooks';
import NotFound from '@/pages/404';

export const RouteView: FC = () => {
  const { routes } = useAppSelector(store => store.userReducer);
  console.log(routes, 'routes');
  return (
    <Suspense
      fallback={
        <SuspendFallbackLoading
          message="Alert message title"
          description="Further details about the context of this alert."
        />
      }
    >
      {routes.length > 0 ? <Outlet /> : <NotFound />}
    </Suspense>
  );
};

export default RouteView;
