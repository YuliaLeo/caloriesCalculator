import React, { PropsWithChildren, useMemo } from 'react';
import {Meal} from '../../models/meal.ts';
import {summary} from '../../models/summary.ts';
import {FoodCard} from '../screens/food/FoodCard.tsx';


type Props = PropsWithChildren<{
    name: string;
    items: Meal[];
    onPress?: () => void;
}>;

export function Summary({items, name, onPress}: Props): React.JSX.Element {
    const prepared = useMemo(() => {
        return summary(items, name);
    }, [items, name]);

    return (
        <FoodCard
            item={prepared}
            primary={true}
            readonly={true}
            onPress={onPress}
        />
    );
}
