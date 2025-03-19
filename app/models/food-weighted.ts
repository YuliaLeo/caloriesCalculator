import {ID} from './id.ts';
import {Food} from './food.ts';

export type FoodWeighted = {
    weight: number;
    foodId: ID;
    food?: Food;
}

export type FoodWeightedForm = {
    weight: string;
    foodId: string;
}
