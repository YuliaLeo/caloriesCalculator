import React, { PropsWithChildren } from 'react';
import { FoodCard } from './FoodCard.tsx';
import {FoodWeightedForm} from '../../../domain/meal.ts';
import {mockFood} from '../../../mocks/foods.ts';

type Props = PropsWithChildren<{
    index?: number;
    fw: FoodWeightedForm;
    removeFn: () => void;
}>;

export function FoodWeighted(
    {
        index,
        fw,
        removeFn,
    }: Props): React.JSX.Element | null {
    const result = mockFood[0];

    return result ? (
        <FoodCard
            index={index}
            item={result}
            selectable={true}
            selected={true}
            select={() => removeFn()}
        />
    ) : null;
}
