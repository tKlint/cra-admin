import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, AnyAction } from 'redux';
import type { LocaleState } from './locale';
import localesReducer from './locale';
import userReducer from './user';
import { UserState } from './user';

const rootReduce = combineReducers<
	{
		localesReducer: LocaleState;
		userReducer: UserState;
	},
	AnyAction
>({
	localesReducer,
	userReducer
});

const store = configureStore({
	reducer: rootReduce
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
