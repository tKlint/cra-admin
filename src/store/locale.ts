import { createSlice, CaseReducer } from '@reduxjs/toolkit';

enum Reducers {
    TOGGLE_LOCALED = 'TOGGLE_LOCALED',
}

export enum LocaleStatus {
    ZH_CN = 'zh_CN',
    ZH_TW = 'zh_TW',
    US_EN = 'en_US'
}

export interface LocaleState {
    locale: LocaleStatus;
}

type LocalesReducer = {
    [k in Reducers]: CaseReducer<
        LocaleState,
        {
            payload: LocaleState;
            // type: ReducerType[k];
            type: string;
        }
    >;
};


const localesReducer = createSlice<LocaleState, LocalesReducer, 'locale'>({
    name: 'locale',
    initialState: {
        locale: LocaleStatus.ZH_CN
    },
    reducers: {
        [Reducers.TOGGLE_LOCALED]: (state, { payload, type }) => {
            console.log(type, 'type')
            state.locale = payload.locale;
        },
    },
});
export const { TOGGLE_LOCALED } = localesReducer.actions;
export default localesReducer.reducer;
