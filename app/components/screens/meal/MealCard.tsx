import React, { PropsWithChildren, useMemo, useState } from 'react';
import {Alert, View} from 'react-native';
import { MealEditCta } from './MealEditCta.tsx';
import {Meal} from '../../../models/meal.ts';
import {Card} from '../../common/Card.tsx';
import {defaultOffset} from '../../../styles/variables.tsx';
import {layoutStyles} from '../../../styles/layout.tsx';
import {Summary} from '../../common/Summary.tsx';
import {Button} from '../../common/Button.tsx';
import {FoodCard} from '../food/FoodCard.tsx';
import {useAppDispatch} from '../../../domain/hooks.ts';
import {removeMeal} from '../../../store/meal.tsx';

type Props = PropsWithChildren<{
    item: Meal;
}>;

export function MealCard({item}: Props): React.JSX.Element {
    const [expanded, setExpanded] = useState(false);

    const dispatch = useAppDispatch();

    const toggleExpand = () => setExpanded(!expanded);

    const items = useMemo(() => {
        return item.items.map((foodWeighted, index) => {
            return (
                foodWeighted.food && (
                    <FoodCard
                        key={foodWeighted.foodId}
                        index={item.items.length > 1 ? index : undefined}
                        item={foodWeighted.food}
                        readonly={true}
                    />
                )
            );
        });
    }, [item.items]);

    const confirmRemove = () =>
        Alert.alert('Confirm action', 'Are you sure?', [
            {
                text: 'Отменить',
                style: 'cancel',
            },
            {
                text: 'Удалить',
                onPress: () => dispatch(removeMeal(item.id)),
                style: 'destructive',
            },
        ]);

    return (
        <Card out={true}>
            {item.name ? (
                <Summary onPress={toggleExpand} name={item.name} items={[item]} />
            ) : (
                <View style={{gap: defaultOffset}}>{items}</View>
            )}

            {expanded && <View style={{gap: defaultOffset}}>{items}</View>}

            <View style={layoutStyles.row}>
                <MealEditCta newMealId={item.id} />

                <MealEditCta id={item.id} />

                <Button
                    title="Удалить"
                    onPress={confirmRemove}
                />
            </View>
        </Card>
    );
}

