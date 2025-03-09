import React from 'react';
import {Container} from '../../common/Container.tsx';
import {View, Text, SectionList, Pressable, StyleSheet} from 'react-native';
import {layoutStyles} from '../../../styles/layout.tsx';
import {typoStyles} from '../../../styles/typo.tsx';
import {MealEditCta} from './MealEditCta.tsx';
import {defaultOffset} from '../../../styles/variables.tsx';
import {Input} from '../../common/Input.tsx';
import {Select} from '../../common/Select.tsx';
import {dateGroups} from '../../../models/date.ts';
import {Card} from '../../common/Card.tsx';
import {Button} from '../../common/Button.tsx';
import {FoodInfo} from '../food/FoodInfo.tsx';
import {MealCard} from './MealCard.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes.tsx';
import {useMealListViewModel} from '../../../view-models/use-meal-list-view-model.ts';

type Props = NativeStackScreenProps<RootStackParamList, 'MealList'>;

function MealList({navigation}: Props): React.JSX.Element {
    const {
        search,
        setSearch,
        dateGroup,
        setDateGroup,
        visible,
        filteredGroups,
        toggleVisible,
    } = useMealListViewModel();

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
