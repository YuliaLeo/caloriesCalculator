import {Food} from "../domain/food.ts";

export const mockFood: Food[] = [
    {
        id: '1',
        name: 'Омлет',
        weight: 150,
        kcal: 250,
        protein: 15,
        fat: 20,
        carbs: 2,
    },
    {
        id: '2',
        name: 'Салат с курицей',
        weight: 200,
        kcal: 300,
        protein: 25,
        fat: 10,
        carbs: 15,
    },
    {
        id: '3',
        name: 'Панкейки',
        weight: 180,
        kcal: 400,
        protein: 8,
        fat: 18,
        carbs: 45,
    },
    {
        id: '4',
        name: 'Паста',
        weight: 250,
        kcal: 500,
        protein: 18,
        fat: 12,
        carbs: 65,
    },
];
