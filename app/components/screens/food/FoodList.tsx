import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FoodCard } from './FoodCard.tsx';
import { FoodEditCta } from './FoodEditCta.tsx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes.tsx';
import {groupByUsing, mealGroups} from '../../../models/meal-groups.ts';
import {Container} from '../../common/Container.tsx';
import {layoutStyles} from '../../../styles/layout.tsx';
import {typoStyles} from '../../../styles/typo.tsx';
import {Input} from '../../common/Input.tsx';
import {defaultOffset} from '../../../styles/variables.tsx';
import {Button} from '../../common/Button.tsx';
import {useAppDispatch, useAppSelector} from '../../../domain/hooks.ts';
import {food, meal, selection} from '../../../store/store.ts';
import {addToSelection, removeFromSelection, setSelection} from '../../../store/selection.tsx';
import {ID} from '../../../models/id.ts';
import {fetchFood} from '../../../store/food.tsx';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodList'>;

export function FoodList({navigation, route}: Props): React.JSX.Element {
    const dispatch = useAppDispatch();

    const selectable = route.params?.selectable || false;
    const [search, setSearch] = useState<string>('');

    const mealState = useAppSelector(meal);
    const foodState = useAppSelector(food);

    const ids = useAppSelector(selection);

    useEffect(() => {
        dispatch(fetchFood());
    }, [dispatch]);

    const groups = useMemo(() => {
        return mealGroups(mealState, foodState, 'day');
    }, [mealState, foodState]);

    const sortedFood = useMemo(() => {
        const products = groupByUsing(groups, foodState);

        return Object.values(products)
            .sort((a, b) => {
                if (ids.includes(a.id) && !ids.includes(b.id)) {
                    return -1;
                }

                if (!ids.includes(a.id) && ids.includes(b.id)) {
                    return 1;
                }

                return b.totalUse - a.totalUse;
            });
    }, [groups, foodState, ids]);

    const filteredFood = useMemo(() => {
        if (!search) {
            return sortedFood;
        }

        const text = search.toLowerCase();

        return sortedFood.filter(f => f.name.toLowerCase().includes(text));
    }, [sortedFood, search]);

    useEffect(() => {
        if (!selectable) {
            dispatch(setSelection([]));
        }
    }, [dispatch, selectable]);

    useEffect(() => {
        setSearch('');
    }, [sortedFood]);

    useEffect(() => {
        if (ids.length === 0) {
            setSearch('');
        }
    }, [ids]);

    const prepareSelectedIds = (item: {id: ID}) => {
        if (!ids.includes(item.id)) {
            dispatch(addToSelection(item.id));
        } else {
            dispatch(removeFromSelection(item.id));
        }
    };

    return (
        <Container>
            <View style={layoutStyles.header}>
                <Text style={typoStyles.heading}>Список продуктов</Text>
                <FoodEditCta defaultName={search} />
            </View>

            <Input
                style={{margin: defaultOffset, marginBottom: 0}}
                placeholder="Найти продукт"
                value={search}
                onChangeText={setSearch}
            />

            <View style={styles.list}>
                {filteredFood.length === 0 && <FoodEditCta defaultName={search} />}

                <FlatList
                    data={filteredFood}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{gap: defaultOffset}}
                    renderItem={({item, index}) => (
                        <FoodCard
                            index={index}
                            item={item}
                            selectable={selectable}
                            selected={ids.includes(item.id)}
                            select={() => prepareSelectedIds(item)}
                        />
                    )}
                />
            </View>

            <View style={layoutStyles.footer}>
                {selectable ? (
                    <View style={layoutStyles.row}>
                        <Button
                            title={'Выбрать ' + ids.length}
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                ) : (
                    <View style={layoutStyles.row}>
                        <Button
                            title={'Рацион'}
                            onPress={() => navigation.navigate('MealList')}
                        />
                    </View>
                )}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        gap: defaultOffset,
        margin: defaultOffset,
    },
    button: {
        alignSelf: 'flex-start',
    },
});
