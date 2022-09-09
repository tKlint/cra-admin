import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, AnyAction } from 'redux';
import type { LocaleState } from './locale';
import localesReducer from './locale';

const rootReduce = combineReducers<
    {
        localesReducer: LocaleState;
    },
    AnyAction
>({
    localesReducer
});

const store = configureStore({
    reducer: rootReduce
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
