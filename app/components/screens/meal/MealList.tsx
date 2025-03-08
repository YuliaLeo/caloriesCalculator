import React, {useMemo, useState} from 'react';
import {Container} from '../../common/Container.tsx';
import {View, Text, SectionList, Pressable, StyleSheet} from 'react-native';
import {layoutStyles} from '../../../styles/layout.tsx';
import {typoStyles} from '../../../styles/typo.tsx';
import {MealEditCta} from './MealEditCta.tsx';
import {defaultOffset} from '../../../styles/variables.tsx';
import {Input} from '../../common/Input.tsx';
import {Select} from '../../common/Select.tsx';
import {DateGroup, dateGroups} from '../../../domain/date.ts';
import {MealGroup} from '../../../domain/meal-groups.ts';
import {Card} from '../../common/Card.tsx';
import {Button} from '../../common/Button.tsx';
import {ID} from '../../../domain/id.ts';
import {FoodInfo} from '../food/FoodInfo.tsx';
import {MealCard} from './MealCard.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes.tsx';
import {meals} from '../../../mocks/meals.ts';

type Props = NativeStackScreenProps<RootStackParamList, 'MealList'>;

function MealList({navigation}: Props): React.JSX.Element {
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
        setVisible({
            ...visible,
            [id]: !visible[id],
        });
    };

    return (
        <Container>
            <View style={layoutStyles.header}>
                <Text style={typoStyles.heading}>Рацион</Text>
                <MealEditCta />
            </View>

            <View style={{...layoutStyles.row, margin: defaultOffset}}>
                <Input
                    style={{flex: 3}}
                    placeholder="Найти прием пищи"
                    value={search}
                    onChangeText={setSearch}
                />

                <View style={{flex: 2}}>
                    <Select
                        value={dateGroup}
                        onChange={setDateGroup}
                        items={dateGroups}
                    />
                </View>
            </View>

            <SectionList
                sections={filteredGroups}
                keyExtractor={item => item.id}
                stickySectionHeadersEnabled={true}
                contentContainerStyle={{marginBottom: 100}}
                renderSectionHeader={data => (
                    <Card>
                        <View style={{...layoutStyles.row, alignItems: 'flex-start'}}>
                            <Pressable
                                style={layoutStyles.rowText}
                                onPress={() => toggleVisible(data.section.rangeAsString)}
                            >
                                <Text style={styles.sectionHeading}>
                                    Общее за: {data.section.rangeAsString}
                                </Text>
                            </Pressable>
                        </View>

                        <FoodInfo item={data.section.summary} />
                    </Card>
                )}
                renderItem={section => {
                    if (visible[section.section.rangeAsString]) {
                        return <MealCard item={section.item} />;
                    }

                    return null;
                }}
            />
            <View style={layoutStyles.footer}>
                <View style={layoutStyles.row}>
                    <Button
                        title="Список продуктов"
                        onPress={() => navigation.navigate('FoodList', {})}
                    />
                </View>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    sectionHeading: {
        ...typoStyles.headingPrimary,
        fontSize: 16,
        fontWeight: 700,
    },
    sectionFooter: {
        marginBottom: defaultOffset * 2,
    },
    list: {
        flex: 1,
        margin: defaultOffset,
    },
});

export default MealList;
