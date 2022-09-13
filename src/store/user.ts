import { createSlice, CaseReducer, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { request } from '../utils/request';
import storage from '../utils/Storage';
import { useAppDispatch } from './hooks';

// const dispatch = useAppDispatch();

enum Reducers {
    FETECH_USER = 'FETECH_USER',
}

export enum UserStatus {
  
}

export interface UserState {
    token?: string;
    perms: string[];
    orgIdSet?: string[];
    tokenType?: string;
    userFullNameCn?: string;
    userNo?: string;
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

export async function afterLogin({ token,  userNo}: { token?: string; userNo?: string}) {
    const [routerList] = await Promise.all([
        request({
            url: '/gateway/admin/userMenu',
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            data: { userNo }
        })
    ]);
    return {
        routes: routerList
    }
}

export const fetchUser = createAsyncThunk<UserState>('users/info', async () => {
    const response = await request({
        url: '/gateway/admin/signin',
        method: 'post',
        data: {
            userPassword: "admin123456",
            userName: "superadmin",
        }
    });
    const { token, userNo } = response;
    storage.set('access_token', token);
    const perm = await afterLogin({ token, userNo });
    return {
        ...response,
        ...perm
    };
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
                ...payload
            };
        });
       
    }
});
export const { FETECH_USER } = userReducer.actions;
export const userStore = userReducer.getInitialState();
export default userReducer.reducer;
