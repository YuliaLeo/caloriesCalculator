import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {addFoodToDB, getFood, removeFoodFromDB, updateFoodInDB} from '../database/database.ts';
import {Food} from '../models/food.ts';
import {RootState} from './store.ts';
import {ID} from '../models/id.ts';

export const fetchFood = createAsyncThunk('food/fetchFood', async () => {
    return await getFood();
});

export interface FoodState {
    defaultName: string;
    items: Food[];
}

const initialState: FoodState = {
    defaultName: '',
    items: [],
};

export const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {
        addFood: (state, action) => {
            state.items.push(action.payload);
            addFoodToDB(action.payload);
        },
        removeFood: (state, action) => {
            state.items = state.items.filter(food => food.id !== action.payload);
            removeFoodFromDB(action.payload);
        },
        updateFood: (state, action) => {
            const { id, body } = action.payload;
            state.items = state.items.map(food =>
                food.id === id ? { ...food, ...body } : food
            );
            updateFoodInDB(id, body);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFood.fulfilled, (state, action) => {
            state.items = action.payload;
        });
    },
});

export const findFoodById = (state: RootState, id?: ID) =>
    state.food.items.find(food => food.id === id);

export const { addFood, removeFood, updateFood } = foodSlice.actions;
export default foodSlice.reducer;
