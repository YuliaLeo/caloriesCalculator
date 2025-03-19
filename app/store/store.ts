import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import mealReducer from './meal.tsx';
import foodReducer from './food.tsx';
import selectionReducer from './selection.tsx';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from 'redux-persist/es/constants';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['food', 'meal'],
};

const rootReducer = combineReducers({
    food: foodReducer,
    meal: mealReducer,
    selection: selectionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const meal = (state: RootState) => state.meal.items;
export const food = (state: RootState) => state.food.items;
export const selection = (state: RootState) => state.selection.items;

export const persistor = persistStore(store);
