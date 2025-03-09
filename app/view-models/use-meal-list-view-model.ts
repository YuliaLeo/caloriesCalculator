import {useMemo, useState} from 'react';
import {DateGroup} from '../models/date.ts';
import {MealGroup} from '../models/meal-groups.ts';
import {meals} from '../mocks/meals.ts';
import {ID} from '../models/id.ts';

export function useMealListViewModel() {
    const [search, setSearch] = useState<string>('');
    const [dateGroup, setDateGroup] = useState<DateGroup>('day');
    const [visible, setVisible] = useState<Record<ID, boolean>>({});

    const groups: MealGroup[] = useMemo(() => meals, []);

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

    const toggleVisible = (id: ID) => {
        setVisible(prevVisible => ({
            ...prevVisible,
            [id]: !prevVisible[id],
        }));
    };

    return {
        search,
        setSearch,
        dateGroup,
        setDateGroup,
        visible,
        setVisible,
        filteredGroups,
        toggleVisible,
    };
}
