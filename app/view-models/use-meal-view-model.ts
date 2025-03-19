import {useEffect, useRef, useMemo} from 'react';
import {defaultMeal, MealForm, MealSchema, toMealForm} from '../models/meal.ts';
import {FormikProps} from 'formik';
import {generateId} from '../models/id.ts';
import {useAppDispatch, useAppSelector} from '../domain/hooks.ts';
import {food, selection} from '../store/store.ts';
import {addMeal, fetchMeals, findMealById, updateMeal} from '../store/meal.tsx';

export function useMealViewModel(mealId?: string, newMealId?: string) {
    const loading = useAppSelector(state => state.meal.isLoading);
    const error = useAppSelector(state => state.meal.error);
    const formRef = useRef<FormikProps<MealForm>>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchMeals());
    }, [dispatch]);

    const mealExist = useAppSelector(findMealById(mealId || newMealId));

    const ids = useAppSelector(selection);
    const foodState = useAppSelector(food);

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
        const {setFieldValue, values} = formRef.current!;

        setFieldValue(
            'items',
            ids
                .map(id => {
                    const foodExist = values.items.find(f => f.foodId === id);
                    if (foodExist) {
                        return foodExist;
                    }

                    const exist = foodState.find(f => f.id === id);
                    if (!exist) {
                        return null;
                    }

                    return {
                        weight: exist.weight.toString(),
                        foodId: exist.id,
                    };
                })
                .filter(f => f !== null),
        );
    }, [ids, foodState, formRef]);

    const saveMeal = (values: MealForm) => {
        const cast = MealSchema.cast(values);
        const mealEdit = {
            ...cast,
            name: cast.name?.trim(),
            date: cast.date.toISOString(),
            items: cast.items!,
        };

        if (meal.id) {
            dispatch(updateMeal({id: meal.id, body: mealEdit}));
        } else {
            dispatch(
                addMeal({
                    ...mealEdit,
                    id: generateId(),
                }),
            );
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
