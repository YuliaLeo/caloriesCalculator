import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Meal} from '../models/meal.ts';
import {addMealToDB, getMeals, removeMealFromDB, updateMealInDB} from '../database/database.ts';
import {ID} from '../models/id.ts';
import {food, meal} from './store.ts';

export const fetchMeals = createAsyncThunk('meal/fetchMeals', async () => {
    console.log('getMeals');
    return await getMeals();
});

export interface MealState {
    items: Meal[];
    isLoading: boolean;
    error: string | null;
}

const initialState: MealState = {
    items: [],
    isLoading: false,
    error: null,
};

export const mealSlice = createSlice({
    name: 'meal',
    initialState,
    reducers: {
        addMeal: (state, action) => {
            state.items.push(action.payload);
            addMealToDB(action.payload);
        },
        removeMeal: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            removeMealFromDB(action.payload);
        },
        updateMeal: (
            state: MealState,
            action: PayloadAction<{id: ID; body: Partial<Meal>}>,
        ) => {
            const { id, body } = action.payload;
            state.items = state.items.map(meal =>
                meal.id === id ? { ...meal, ...body } : meal
            );
            updateMealInDB(id, body);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeals.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMeals.fulfilled, (state, action) => {
                state.items = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchMeals.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка загрузки данных';
            });
    },
});

export const findMealById = (id?: ID) => createSelector([meal, food], (meal, food) => {
    if (!id) {
        return;
    }

    const item = meal.find(meal => meal.id === id);
    if (!item) {
        return;
    }

    return {
        ...item,
        items: item.items.map(item => ({
            ...item,
            food: food.find(food => food.id === item.foodId),
        })),
    };
});

export const { addMeal, removeMeal, updateMeal } = mealSlice.actions;
export default mealSlice.reducer;
