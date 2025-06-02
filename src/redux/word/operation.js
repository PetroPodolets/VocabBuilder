import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "https://vocab-builder-backend.p.goit.global/";

export const fetchStatistics = createAsyncThunk(
    "words/fetchStatistics",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/words/statistics");
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue("Unauthorized");
            }
            return rejectWithValue(error.response?.data?.message || "Failed to fetch statistics");
        }
    }
);

export const fetchCategories = createAsyncThunk(
    "words/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/words/categories");
            return response.data.map(item => ({
                value: item,
                label: item.charAt(0).toUpperCase() + item.slice(1),
            }));
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue("Unauthorized");
            }
            return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
        }
    }
);

export const fetchWords = createAsyncThunk(
    'words/fetchWords',
    async ({ token, keyword = '', category = '', isIrregular = null, page = 1, limit = 7 }, { rejectWithValue }) => {
        try {
            const params = {
                page,
                limit,
            };
            if (keyword) params.keyword = keyword;
            if (category) params.category = category;
            if (isIrregular !== null && category === 'verb') params.isIrregular = isIrregular;

            const response = await axios.get('/api/words/own', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            return {
                results: response.data.results,
                totalPages: response.data.totalPages,
                page: response.data.page,
                perPage: response.data.perPage,
            };
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized');
            }
            if (error.response?.status === 404) {
                return rejectWithValue('Service not found');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch words');
        }
    }
);

export const addWord = createAsyncThunk(
    'words/add',
    async (wordData, { rejectWithValue }) => {
        try {
            const payload = {
                en: wordData.en,
                ua: wordData.ua,
                category: wordData.category,
                ...(wordData.category === 'verb' && { isIrregular: wordData.isIrregular }),
            };
            const response = await axios.post('/api/words/create', payload, {
                headers: {
                    Authorization: `Bearer ${wordData.token}`,
                },
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 400) {
                return rejectWithValue('Invalid request body');
            }
            if (error.response?.status === 401) {
                return rejectWithValue('Such a word already exists');
            }
            if (error.response?.status === 404) {
                return rejectWithValue('Service not found. Check endpoint.');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to add word');
        }
    }
);

export const deleteWord = createAsyncThunk(
    "words/delete",
    async ({ wordId, token }, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/words/delete/${wordId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return wordId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete word");
        }
    }
);
export const editWord = createAsyncThunk(
    "words/edit",
    async ({ wordId, wordData, token }, { rejectWithValue }) => {
        try {
            const payload = {
                en: wordData.en,
                ua: wordData.ua,
                category: wordData.category, // Додаємо category з оригінального слова
                ...(wordData.category === "verb" && { isIrregular: wordData.isIrregular }), // Додаємо isIrregular для дієслів
            };
            console.log('Sending edit request:', { wordId, payload, token });
            const response = await axios.patch(`/api/words/edit/${wordId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Edit response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Edit error:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to edit word");
        }
    }
);




export const fetchAllWords = createAsyncThunk(
    'words/fetchAllWords',
    async ({ token, keyword = '', category = '', isIrregular = null, page = 1, limit = 7 }, { rejectWithValue }) => {
        try {
            const params = {
                page,
                limit,
            };
            if (keyword) params.keyword = keyword;
            if (category) params.category = category;
            if (isIrregular !== null && category === 'verb') params.isIrregular = isIrregular;

            const response = await axios.get('/api/words/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            return {
                results: response.data.results,
                totalPages: response.data.totalPages,
                page: response.data.page,
                perPage: response.data.perPage,
            };
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized');
            }
            if (error.response?.status === 404) {
                return rejectWithValue('Service not found');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch all words');
        }
    }
);



export const addWordFromForeignUser = createAsyncThunk(
    'words/addWordFromForeignUser',
    async ({ wordId, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/words/add/${wordId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Очікуємо { _id, en, ua, category, isIrregular, owner, progress }
        } catch (error) {
            if (error.response?.status === 400) {
                return rejectWithValue('Invalid request body');
            }
            if (error.response?.status === 401) {
                return rejectWithValue('Such a word already exists');
            }
            if (error.response?.status === 404) {
                return rejectWithValue('Service not found');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to add word');
        }
    }
);


export const fetchUserTasks = createAsyncThunk(
    'words/fetchUserTasks',
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://vocab-builder-backend.p.goit.global/api/words/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'accept': 'application/json',
                },
            });
            console.log('Fetch tasks response:', response.data);
            const data = response.data.tasks || response.data.words || response.data;
            if (!Array.isArray(data)) {
                throw new Error('Invalid response format');
            }
            return { words: data };
        } catch (error) {
            console.error('Fetch tasks error:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized');
            }
            if (error.response?.status === 404) {
                return rejectWithValue('Service not found');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);


export const submitAnswers = createAsyncThunk(
    'words/submitAnswers',
    async ({ token, answers }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/words/answers', answers, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Очікуємо [{ _id, ua, task, en, isDone }, ...]
        } catch (error) {
            if (error.response?.status === 400) {
                return rejectWithValue('Invalid request body');
            }
            if (error.response?.status === 404) {
                return rejectWithValue('Service not found');
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to submit answers');
        }
    }
);