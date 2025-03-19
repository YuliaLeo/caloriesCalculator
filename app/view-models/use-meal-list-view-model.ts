import {useEffect, useMemo, useState} from 'react';
import {DateGroup} from '../models/date.ts';
import {MealGroup, mealGroups} from '../models/meal-groups.ts';
import {ID} from '../models/id.ts';
import {useAppDispatch, useAppSelector} from '../domain/hooks.ts';
import {food, meal} from '../store/store.ts';
import {fetchMeals} from '../store/meal.tsx';

export function useMealListViewModel() {
    const mealState = useAppSelector(meal);
    const foodState = useAppSelector(food);

    const dispatch = useAppDispatch();

    const [search, setSearch] = useState<string>('');
    const [dateGroup, setDateGroup] = useState<DateGroup>('day');
    const [visible, setVisible] = useState<Record<ID, boolean>>({});

    const loading = useAppSelector(state => state.meal.isLoading);
    const error = useAppSelector(state => state.meal.error);

    useEffect(() => {
        dispatch(fetchMeals());
    }, [dispatch]);

    const groups = useMemo(() => {
        return mealGroups(mealState, foodState, dateGroup);
    }, [mealState, foodState, dateGroup]);

    const filteredGroups: MealGroup[] = useMemo(() => {
        if (!search) {
            return groups;
        }

        const text = search.toLowerCase();

        return groups.reduce((acc, group) => {
            const data = group.data.filter(m => {
                if (m.name?.toLowerCase().includes(text)) {
                    return true;
                }

                return m.items.some(item => {
                    return item.food?.name.toLowerCase().includes(text) ?? false;
                });
            });

            if (data.length) {
                acc.push({
                    ...group,
                    data,
                });
            }

            return acc;
        }, [] as MealGroup[]);
    }, [groups, search]);

    useEffect(() => {
        setSearch('');
    }, [mealState]);

    const toggleVisible = (id: ID) => {
        setVisible({
            ...visible,
            [id]: !visible[id],
        });
    };

    useEffect(() => {
        if (!filteredGroups.length) {
            return;
        }

        if (!search) {
            setVisible({
                [filteredGroups[0].rangeAsString]: true,
            });
        } else {
            const ids = filteredGroups.map(group => group.rangeAsString);
            setVisible(ids.reduce((acc, id) => ({...acc, [id]: true}), {}));
        }
    }, [search, filteredGroups]);

    return {
        search,
        setSearch,
        dateGroup,
        setDateGroup,
        visible,
        setVisible,
        filteredGroups,
        toggleVisible,
        loading,
        error,
    };
}
