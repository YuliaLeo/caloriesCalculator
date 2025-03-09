import { Meal } from '../models/Meal';

export class MealRepository {
    private meals: Meal[] = [];

    getMeal(id?: string): Meal|null {
        if (!id) {
            return null;
        }

        return this.meals.find((meal) => meal.id === id) || {
            id,
            name: '',
            date: new Date().toISOString(),
            items: [],
        };
    }

    saveMeal(meal: Meal): void {
        const index = this.meals.findIndex((m) => m.id === meal.id);
        if (index !== -1) {
            this.meals[index] = meal;
        } else {
            this.meals.push(meal);
        }
    }
}
