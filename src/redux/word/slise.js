import { createSlice } from "@reduxjs/toolkit";
import { addWord, fetchWords, deleteWord, editWord, fetchStatistics, fetchCategories, fetchAllWords, addWordFromForeignUser, fetchUserTasks, submitAnswers } from "./operation";

const wordSlice = createSlice({
    name: "words",
    initialState: {
        words: [],
        allWords: [],
        tasks: [],
        categories: [],
        statistics: null,
        selectedCategory: '',
        searchTerm: '',
        isLoading: false,
        error: null,
        isAddWordModalOpen: false,
        editModal: {
            isOpen: false,
            wordId: null,
        },
        totalPages: 0,
        currentPage: 1,
        perPage: 7,
    },
    reducers: {
        openEditWordModal(state, action) {
            state.editModal.isOpen = true;
            state.editModal.wordId = action.payload;
        },
        closeEditWordModal(state) {
            state.editModal.isOpen = false;
            state.editModal.wordId = null;
        },
        openAddWordModal(state) {
            state.isAddWordModalOpen = true;
        },
        closeAddWordModal(state) {
            state.isAddWordModalOpen = false;
        },
        setSelectedCategory(state, action) {
            state.selectedCategory = action.payload;
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWords.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWords.fulfilled, (state, action) => {
                state.isLoading = false;
                state.words = action.payload.results;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.page;
                state.perPage = action.payload.perPage;
            })
            .addCase(fetchWords.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllWords.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllWords.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allWords = action.payload.results;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.page;
                state.perPage = action.payload.perPage;
            })
            .addCase(fetchAllWords.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                const uniqueTasks = [];
                const seenIds = new Set();
                action.payload.words.forEach(task => {
                    if (!seenIds.has(task._id)) {
                        seenIds.add(task._id);
                        uniqueTasks.push(task);
                    } else {
                        const existingTask = uniqueTasks.find(t => t._id === task._id);
                        if (existingTask) {
                            if (task.ua && !existingTask.ua) existingTask.ua = task.ua;
                            if (task.en && !existingTask.en) existingTask.en = task.en;
                        }
                    }
                });
                state.tasks = uniqueTasks;
                console.log('Tasks fetched successfully:', state.tasks);
            })
            .addCase(fetchUserTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch tasks';
                console.log('Tasks fetch failed:', state.error);
            })
            .addCase(submitAnswers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(submitAnswers.fulfilled, (state) => {
                state.isLoading = false;
                state.tasks = []; // Очищаємо завдання після збереження
            })
            .addCase(submitAnswers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addWord.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addWord.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addWord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addWordFromForeignUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addWordFromForeignUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.words.push(action.payload);
            })
            .addCase(addWordFromForeignUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteWord.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteWord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.words = state.words.filter((word) => word._id !== action.payload);
            })
            .addCase(deleteWord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(editWord.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editWord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.words = state.words.map((word) =>
                    word._id === action.payload._id ? action.payload : word
                );
                state.editModal.isOpen = false;
                state.editModal.wordId = null;
            })
            .addCase(editWord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchStatistics.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchStatistics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.statistics = action.payload;
            })
            .addCase(fetchStatistics.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    openEditWordModal,
    closeEditWordModal,
    openAddWordModal,
    closeAddWordModal,
    setSelectedCategory,
    setSearchTerm,
} = wordSlice.actions;
export default wordSlice.reducer;