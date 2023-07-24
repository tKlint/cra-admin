import { createSlice, CaseReducer, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../utils/request';
import storage from '../utils/Storage';
import api from '../service';
import { generateMenus } from './generateRoutes';
import { MenuProps } from 'antd';

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
  routes: API.RoutesResponse[];
  menuItems?: MenuProps['items'];
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

export async function afterLoginApi({ token, userNo }: { token?: string; userNo?: string }) {
  console.log({ token, userNo });
  const [routerList] = await Promise.all([api.fetchUserRoute()]);
  const menuItems = generateMenus((routerList as { data: API.RoutesResponse[] }).data);
  return {
    routes: (routerList as { data: API.RoutesResponse[] }).data,
    menuItems
  };
}

export const fetchUser = createAsyncThunk<UserState>('users/info', async () => {
  const response = await request({
    url: '/gateway/admin/signin',
    method: 'post',
    data: {
      userPassword: 'admin230220CvNypF',
      userName: 'superadmin'
    }
  });
  const { token, userNo } = response as { token: string; userNo: string };
  storage.set('access_token', token);
  storage.set('user_no', userNo);
  storage.set('avatar_url', fakeAvatarUrl);
  // storage.set('user_name', fakeAvatarUrl);
  const { routes, menuItems } = await afterLoginApi({ token, userNo });
  return {
    ...response,
    routes,
    menuItems,
    avatarUrl: fakeAvatarUrl
  };
});

export const afterLogin = createAsyncThunk<UserState>('user/after', async () => {
  const { token, userNo } = userReducer.getInitialState();
  const { routes, menuItems } = await afterLoginApi({ token, userNo });
  return {
    routes,
    menuItems: menuItems || []
  };
});

const userReducer = createSlice<UserState, UserReducer, 'user'>({
  name: 'user',
  initialState: {
    token: storage.get('access_token', ''),
    userNo: storage.get('user_no', ''),
    avatarUrl: storage.get('avatar_url', ''),
    userFullNameCn: storage.get('user_name', ''),
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
  }
});
export const { FETECH_USER } = userReducer.actions;
export const userStore = userReducer.getInitialState();
export default userReducer.reducer;
