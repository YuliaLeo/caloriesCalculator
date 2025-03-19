import React, { PropsWithChildren } from 'react';
import {Alert, Pressable, Switch, Text, View} from 'react-native';
import {Food} from '../../../models/food.ts';
import {ID} from '../../../models/id.ts';
import {Card} from '../../common/Card.tsx';
import {layoutStyles} from '../../../styles/layout.tsx';
import {typoStyles} from '../../../styles/typo.tsx';
import {FoodInfo} from './FoodInfo.tsx';
import {primaryColor} from '../../../styles/variables.tsx';
import {FoodEditCta} from './FoodEditCta.tsx';
import {Button} from '../../common/Button.tsx';
import {useAppDispatch} from '../../../domain/hooks.ts';
import {removeFood} from '../../../store/food.tsx';

type Props = PropsWithChildren<{
    index?: number;
    item: Food;
    primary?: boolean;
    selectable?: boolean;
    selected?: boolean;
    select?: (id: ID) => void;
    readonly?: boolean;
    onPress?: () => void;
}>;

export function FoodCard(
    {
        index,
        item,
        primary,
        selectable,
        selected,
        select,
        readonly,
        onPress,
    }: Props): React.JSX.Element {
    const dispatch = useAppDispatch();

    const confirmRemove = () =>
        Alert.alert('Confirm action', 'Are you sure?', [
            {
                text: 'Отменить',
                style: 'cancel',
            },
            {
                text: 'Удалить',
                onPress: () => dispatch(removeFood(item.id)),
                style: 'destructive',
            },
        ]);

    return (
        <Card>
            <View style={{...layoutStyles.row, alignItems: 'flex-start'}}>
                <Pressable style={layoutStyles.rowText} onPress={onPress}>
                    <Text
                        style={primary ? typoStyles.headingPrimary : typoStyles.heading}
                    >
                        {item.name}
                    </Text>
                </Pressable>
            </View>

            <FoodInfo item={item} />

            {!readonly && (
                <View style={layoutStyles.row}>
                    {selectable && (
                        <Switch
                            thumbColor={(selected ? primaryColor : 'gray')}
                            onValueChange={() => select?.(item.id)}
                            value={selected}
                        />
                    )}

                    <FoodEditCta id={item.id} />

                    <Button
                        onPress={confirmRemove}
                        title="Удалить"
                    />
                </View>
            )}
        </Card>
    );
}
