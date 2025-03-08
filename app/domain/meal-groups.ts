import { Meal } from './meal.ts';
import { DateRange } from './date.ts';
import { Food } from './food.ts';
import { ID } from './id.ts';

export interface MealGroup {
    range: DateRange;
    rangeAsString: string;
    data: Array<Meal & {summary: Food}>;
    summary: Food;
}

export function groupByUsing(groups: MealGroup[], foodState: Food[]): Record<ID, Food & {totalUse: number}> {
    const products: Record<ID, Food & {totalUse: number}> = {};

    foodState.forEach(food => {
        products[food.id] = {
            ...food,
            totalUse: 0,
        };
    });

    groups.forEach(group => {
        group.data.forEach(meal => {
            meal.items.forEach(item => {
                const food = foodState.find(f => f.id === item.foodId);
                if (!food) {
                    return;
                }

                products[food.id].totalUse++;
            });
        });
    });

    return products;
}
