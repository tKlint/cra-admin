import { createSlice, CaseReducer, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../utils/request';
import { useAppDispatch } from './hooks';


enum Reducers {
    FETECH_USER = 'FETECH_USER',
}

export enum UserStatus {
  
}

export interface UserState {
    token?: string;
    perms: string[]
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
export const fetchUser = createAsyncThunk<UserState>('users/info', async () => {
    const response = await request({
        url: '/gateway/admin/signin',
        method: 'post',
        data: {
            userPassword: "admin123456",
            userName: "superadmin",
        }
    });
    // afterLogin();
    // useAppDispatch()(afterLogin)
    return {
        token: 'wwwwwwwwwwwwwwwwww',
        perms: ['22']
    };
});
export const afterLogin = createAsyncThunk<UserState>('users/after', async () => {
    console.log(afterLogin, 'afterLogin')
    const [userInfo, { perms, menus }] = await Promise.all([
        request({
            url: '/gateway/admin/account/info',
            method: 'get'
        })
        ,
        request({
            url: '/gateway/admin/account/permmenu',
            method: 'get'
        })
        
    ]);
    return {
        perms,
        menus,
        userInfo
    }
});

const userReducer = createSlice<UserState, UserReducer, 'user'>({
    name: 'user',
    initialState: {
        perms: []
    },
    reducers: {
        [Reducers.FETECH_USER]: (state, { payload, type }) => {
            state = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, { payload }) => {
            return {
                // routes: payload.routes
                token: '222222222',
                perms: ['']
            };
        });
        builder.addCase(afterLogin.fulfilled, (state, { payload }) => {
            return {
                // routes: payload.routes
                token: '222',
                perms: ['222222']
            };
        });
    }
});
export const { FETECH_USER } = userReducer.actions;
export const userStore = userReducer.getInitialState();
export default userReducer.reducer;
