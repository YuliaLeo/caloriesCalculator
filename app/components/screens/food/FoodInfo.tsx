import React, { PropsWithChildren } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {layoutStyles} from '../../../styles/layout.tsx';
import {Number} from '../../common/Number.tsx';
import {Food} from '../../../models/food.ts';

type Props = PropsWithChildren<{
    item: Food;
}>;

const styles = StyleSheet.create({
    macroContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 4,
    },
    macroRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        width: '60%',
    },
    weightRow: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export function FoodInfo({item}: Props): React.JSX.Element {
    return (
        <View>
            <View style={styles.macroContainer}>
                <View style={styles.macroRow}>
                    <Number value={item.protein} />
                    <Text> белки /</Text>
                    <Number value={item.fat} />
                    <Text> жиры /</Text>
                    <Number value={item.carbs} />
                    <Text> углеводы</Text>
                </View>
                <View style={styles.weightRow}>
                    <Number value={item.kcal}>ккал</Number>
                    <Text> / <Number value={item.weight} /> г</Text>
                </View>
            </View>

            <View style={{...layoutStyles.row, gap: 0}}>
                <Number value={item.fiber || 0} />
                <Text> клечатка</Text>

                <Text> / </Text>

                <Number value={item.salt || 0} />
                <Text> соль</Text>

                <View style={layoutStyles.spacer}/>
            </View>
        </View>

    );
}
