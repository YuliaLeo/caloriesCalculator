import {useState, useEffect, useRef, useMemo} from 'react';
import {MealRepository} from '../repositories/meal-repository.ts';
import {defaultMeal, Meal, MealForm, MealSchema, toMealForm} from '../models/meal.ts';
import {mockFood} from '../mocks/foods.ts';
import {FormikProps} from 'formik';
import {generateId} from '../models/id.ts';

export function useMealViewModel(mealId?: string, newMealId?: string) {
    const repository = useMemo(() => new MealRepository(), []);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<FormikProps<MealForm>>(null);

    const mealExist = useMemo(() => {
        try {
            return repository.getMeal(mealId || newMealId);
        }
        catch (e) {
            setError('Ошибка загрузки данных');
            setLoading(false);
        }
    }, [mealId, newMealId, repository]);

    const meal: MealForm = useMemo(() => {
        const newMeal =
            newMealId &&
            (() => {
                const mealForm = toMealForm({
                    ...mealExist!,
                    date: new Date().toISOString(),
                });

                delete mealForm.id;

                return mealForm;
            })();

        return newMeal || (mealExist ? toMealForm(mealExist) : defaultMeal());
    }, [newMealId, mealExist]);

    useEffect(() => {
        if (formRef.current) {
            const { setFieldValue, values } = formRef.current;

            setFieldValue(
                'items',
                mockFood
                    .map((foodItem) => {
                        const foodExist = values.items.find((f) => f.foodId === foodItem.id);
                        if (foodExist) {
                            return foodExist;
                        }

                        return {
                            weight: foodItem.weight.toString(),
                            foodId: foodItem.id,
                        };
                    })
                    .filter((f) => f !== null),
            );
        }
    });

    const saveMeal = () => {
        setLoading(true);
        try {
            const cast = MealSchema.cast(meal);
            const mealEdit: Meal = {
                ...cast,
                name: cast.name?.trim(),
                date: cast.date.toISOString(),
                items: cast.items!,
                id: generateId(),
            };
            repository.saveMeal(mealEdit);
            setLoading(false);
        } catch (e) {
            setError('Ошибка сохранения данных');
            setLoading(false);
        }
    };

    return {
        meal,
        loading,
        error,
        saveMeal,
        formRef,
    };
}
