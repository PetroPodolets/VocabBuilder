import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice'; // Змінено "authReduser" на "authReducer" (ймовірно, це була опечатка)
import wordReducer from './word/slise'; // Додаємо редуктор для слів
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['token'], // Зберігаємо тільки токен у локальному сховищі
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        words: wordReducer, // Додаємо редуктор для слів
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);