import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FoodCard } from './FoodCard.tsx';
import { FoodEditCta } from './FoodEditCta.tsx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes.tsx';
import {meals} from '../../../mocks/meals.ts';
import {groupByUsing} from '../../../domain/meal-groups.ts';
import {mockFood} from '../../../mocks/foods.ts';
import {Container} from '../../common/Container.tsx';
import {layoutStyles} from '../../../styles/layout.tsx';
import {typoStyles} from '../../../styles/typo.tsx';
import {Input} from '../../common/Input.tsx';
import {defaultOffset} from '../../../styles/variables.tsx';
import {Button} from '../../common/Button.tsx';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodList'>;

export function FoodList({navigation, route}: Props): React.JSX.Element {
    const selectable = route.params?.selectable || false;
    const [search, setSearch] = useState<string>('');
    const ids = ['1'];

    const groups = useMemo(() => {
        return meals;
    }, []);
    const products = Object.values(groupByUsing(groups, mockFood));

    const filteredFood = useMemo(() => {
        if (!search) {
            return products;
        }

        const text = search.toLowerCase();

        return products.filter(f => f.name.toLowerCase().includes(text));
    }, [products, search]);

    useEffect(() => {
        setSearch('');
    }, [products]);

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
        alignSelf: 'flex-start'
    }
});
