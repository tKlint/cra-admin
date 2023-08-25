import { createSlice, CaseReducer, createAsyncThunk } from '@reduxjs/toolkit';
import storage from '../utils/Storage';
import api from '../service';
import { generateMenus } from './generateRoutes';
import { generateRoutesChildren } from '@/utils/tools';

const fakeAvatarUrl = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

enum Reducers {
  FETECH_USER = 'FETECH_USER'
}

export interface UserState {
  token?: string;
  orgIdSet?: string[];
  tokenType?: string;
  userFullNameCn?: string;
  userNo?: string;
  routes: UserRouterWithChildren[];
  menuItems?: UserMenu[];
  avatarUrl?: string;
}

type UserReducer = {
  [k in Reducers]: CaseReducer<
    UserState,
    {
      payload: UserState;
      type: string;
    }
  >;
};

export async function afterLoginApi({ userNo }: { token?: string; userNo?: string }) {
  const userInfo = await api.WHO_AM_I({ loginId: userNo });
  const userMenus: UserRouter[] = [];
  userInfo.Roles.forEach(item => {
    item.Routes.forEach(route => {
      if (userMenus) {
        if (userMenus.findIndex(value => value.path === route.path) === -1) {
          userMenus.push(route);
        }
      }
    });
  });
  const completeRoutes = generateRoutesChildren(userMenus, null);

  const menuItems = generateMenus(completeRoutes);

  return {
    routes: completeRoutes,
    menuItems
  };
}

export const fetchUser = createAsyncThunk<UserState, Record<string, string>>('users/info', async data => {
  const response = await api.SIGN_UP(data);

  const userNo = response.data.data.loginId;
  const token = response.headers.authorization;

  storage.set('access_token', token);
  storage.set('avatar_url', fakeAvatarUrl);
  storage.set('user_no', userNo);

  const { routes, menuItems } = await afterLoginApi({ token, userNo });
  return {
    ...response.data.data,
    routes: routes,
    menuItems,
    avatarUrl: fakeAvatarUrl,
    token
  };
});
export const logout = createAsyncThunk<UserState>('users/logout', async () => {
  storage.remove('access_token');
  storage.remove('user_no');
  storage.remove('avatar_url');
  return Promise.resolve({
    token: void 0,
    userNo: void 0,
    avatarUrl: void 0,
    userFullNameCn: void 0,
    routes: []
  });
});
export const afterLogin = createAsyncThunk<UserState>('user/after', async () => {
  const { token, userNo } = userReducer.getInitialState();
  const { routes, menuItems } = await afterLoginApi({ token, userNo });
  return {
    routes: routes,
    menuItems: menuItems || []
  };
});

const userReducer = createSlice<UserState, UserReducer, 'user'>({
  name: 'user',
  initialState: {
    token: storage.get('access_token'),
    userNo: storage.get('user_no'),
    avatarUrl: storage.get('avatar_url'),
    userFullNameCn: storage.get('user_name'),
    routes: []
  },
  reducers: {
    [Reducers.FETECH_USER]: (state, { payload }) => {
      state = payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUser.fulfilled, (state, { payload }) => {
      return {
        ...payload
      };
    });
    builder.addCase(afterLogin.fulfilled, (state, { payload }) => {
      state.routes = payload.routes;
      state.menuItems = payload.menuItems;
    });
    builder.addCase(logout.fulfilled, (state, { payload }) => {
      return {
        ...payload
      };
    });
  }
});
export const { FETECH_USER } = userReducer.actions;
export const userStore = userReducer.getInitialState();
export default userReducer.reducer;
