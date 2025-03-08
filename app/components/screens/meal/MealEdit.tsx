import {ScrollView, Text, View } from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import DatePicker from 'react-native-date-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes.tsx';
import {defaultMeal, MealForm, MealSchema, toMealForm} from '../../../domain/meal.ts';
import {FieldArray, Formik, FormikProps} from 'formik';
import {Container} from '../../common/Container.tsx';
import {layoutStyles} from '../../../styles/layout.tsx';
import {typoStyles} from '../../../styles/typo.tsx';
import {defaultOffset} from '../../../styles/variables.tsx';
import {formStyles} from '../../../styles/form.tsx';
import {Input} from '../../common/Input.tsx';
import {FoodWeighted} from '../food/FoodWeighted.tsx';
import {mockFood} from '../../../mocks/foods.ts';
import {Field} from '../../common/Field.tsx';
import {Button} from '../../common/Button.tsx';

type Props = NativeStackScreenProps<RootStackParamList, 'MealEdit'>;

const mealExist = {
    id: '1',
    date: new Date().toISOString(),
    name: 'Обед',
    items: [
        { foodId: '1', weight: 150 },
        { foodId: '2', weight: 200 },
    ],
    summary: {
        id: 'summary-1',
        name: 'Обед 1',
        weight: 350,
        kcal: 400,
        protein: 20,
        fat: 30,
        carbs: 22,
    },
};

export function MealEdit({navigation, route}: Props): React.JSX.Element {
    const formRef = useRef<FormikProps<MealForm>>(null);

    const {id, newMealId} = route.params;
    const title = id ? 'Редактировать' : 'Добавить';

    const meal: MealForm = useMemo(() => {
        const newMeal =
            newMealId &&
            (() => {
                const mealForm = toMealForm({
                    ...mealExist!,
                    date: new Date().toISOString(),
                });

                delete mealForm.id;

                return mealForm;
            })();

        return newMeal || (mealExist ? toMealForm(mealExist) : defaultMeal());
    }, [newMealId]);

    useEffect(() => {
        if (!id && !newMealId) {
            navigation.navigate('FoodList', { selectable: true });
        }
    });

    useEffect(() => {
        const { setFieldValue, values } = formRef.current!;

        setFieldValue(
            'items',
            mockFood
                .map((foodItem) => {
                    const foodExist = values.items.find((f) => f.foodId === foodItem.id);
                    if (foodExist) {
                        return foodExist;
                    }

                    return {
                        weight: foodItem.weight.toString(),
                        foodId: foodItem.id,
                    };
                })
                .filter((f) => f !== null),
        );
    }, [formRef]);

    return (
        <Formik
            innerRef={formRef}
            initialValues={meal}
            validationSchema={MealSchema}
            onSubmit={() => {
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
