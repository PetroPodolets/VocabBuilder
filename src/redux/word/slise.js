import { createSlice } from "@reduxjs/toolkit";
import { addWord, fetchWords, deleteWord, editWord, fetchStatistics, fetchCategories } from "./operation";

const wordSlice = createSlice({
    name: "words",
    initialState: {
        words: [],
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
            // .addCase(editWord.pending, (state) => {
            //     state.isLoading = true;
            //     state.error = null;
            // })
            // .addCase(editWord.fulfilled, (state, action) => {
            //     state.isLoading = false;
            //     state.words = state.words.map((word) =>
            //         word._id === action.payload._id ? action.payload : word
            //     );
            //     state.editModal.isOpen = false;
            //     state.editModal.wordId = null;
            // })
            // .addCase(editWord.rejected, (state, action) => {
            //     state.isLoading = false;
            //     state.error = action.payload;
            // })
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