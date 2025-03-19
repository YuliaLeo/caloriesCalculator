import {ScrollView, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import DatePicker from 'react-native-date-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes.tsx';
import {MealSchema} from '../../../models/meal.ts';
import {FieldArray, Formik} from 'formik';
import {Container} from '../../common/Container.tsx';
import {layoutStyles} from '../../../styles/layout.tsx';
import {typoStyles} from '../../../styles/typo.tsx';
import {defaultOffset} from '../../../styles/variables.tsx';
import {formStyles} from '../../../styles/form.tsx';
import {Input} from '../../common/Input.tsx';
import {FoodWeighted} from '../food/FoodWeighted.tsx';
import {Field} from '../../common/Field.tsx';
import {Button} from '../../common/Button.tsx';
import {useMealViewModel} from '../../../view-models/use-meal-view-model.ts';
import {useAppDispatch} from '../../../domain/hooks.ts';
import {removeFromSelection} from '../../../store/selection.tsx';
import {Error} from '../../common/Error.tsx';
import {Loading} from '../../common/Loading.tsx';

type Props = NativeStackScreenProps<RootStackParamList, 'MealEdit'>;

export function MealEdit({navigation, route}: Props): React.JSX.Element {
    const {id, newMealId} = route.params;
    const title = id ? 'Редактировать' : 'Добавить';
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!id && !newMealId) {
            navigation.navigate('FoodList', {selectable: true});
        }
    });

    const { meal, loading, error, saveMeal, formRef } = useMealViewModel(id, newMealId);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <Error error={error} />
        );
    }

    return (
        <Formik
            innerRef={formRef}
            initialValues={meal}
            validationSchema={MealSchema}
            onSubmit={(values) => {
                saveMeal(values);
                navigation.goBack();
            }}>
            {({setFieldValue, handleChange, handleBlur, handleSubmit, values}) => (
                <Container>
                    <View style={layoutStyles.header}>
                        <Text style={typoStyles.heading}>{title}</Text>
                        <Button
                            title={'Выбрать'}
                            onPress={() =>
                                navigation.navigate('FoodList', {selectable: true})
                            }
                        />
                    </View>
                    <ScrollView>
                        <View style={formStyles.form}>
                            <Field name={'items'}>
                                <FieldArray
                                    name={'items'}
                                    render={arrayHelpers =>
                                        values.items.map((foodItem, index) => (
                                            <View
                                                key={foodItem.foodId}
                                                style={{gap: defaultOffset}}>
                                                <FoodWeighted
                                                    index={index}
                                                    fw={foodItem}
                                                    removeFn={() => {
                                                        arrayHelpers.remove(index);
                                                        dispatch(removeFromSelection(foodItem.foodId));
                                                    }}
                                                />

                                                <Field
                                                    label={'Вес продукта'}
                                                    name={`items[${index}].weight`}>
                                                    <Input
                                                        inputMode={'numeric'}
                                                        maxLength={7}
                                                        value={values.items[index].weight}
                                                        onChangeText={handleChange(
                                                            `items[${index}].weight`,
                                                        )}
                                                        onBlur={handleBlur(`items[${index}].weight`)}
                                                        placeholder={'0'}
                                                    />
                                                </Field>
                                            </View>
                                        ))
                                    }
                                />
                            </Field>

                            <Field label={'Название приема пищи'} name={'name'}>
                                <Input
                                    value={values.name}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                />
                            </Field>

                            <Field
                                label={'Дата приема пищи: '}
                                name={'date'}>
                                <DatePicker
                                    date={values.date}
                                    onDateChange={date => setFieldValue('date', date)}
                                />
                            </Field>
                        </View>
                    </ScrollView>

                    <View style={layoutStyles.footer}>
                        <View style={{flex: 1}}>
                            <Button
                                title={'Сохранить'}
                                onPress={handleSubmit}
                            />
                        </View>
                    </View>
                </Container>
            )}
        </Formik>
    );
}

