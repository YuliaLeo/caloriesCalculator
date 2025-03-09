import { ScrollView, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { Formik } from 'formik';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes.tsx';
import {mockFood} from '../../../mocks/foods.ts';
import {FoodForm, FoodSchema} from '../../../models/food.ts';
import {Container} from '../../common/Container.tsx';
import {layoutStyles} from '../../../styles/layout.tsx';
import {typoStyles} from '../../../styles/typo.tsx';
import {formStyles} from '../../../styles/form.tsx';
import {Field} from '../../common/Field.tsx';
import {Input} from '../../common/Input.tsx';
import {Button} from '../../common/Button.tsx';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodEdit'>;

export function FoodEdit({navigation, route}: Props): React.JSX.Element {
    const id = route.params.id;
    const food = useMemo(() => {
        return mockFood[0];
    }, []);

    const submitForm = (values: FoodForm) => {
        const foodEdit = FoodSchema.cast(values);
        foodEdit.name = foodEdit.name?.trim();
        navigation.goBack();
    };

    return (
        <Formik
            initialValues={food}
            validationSchema={FoodSchema}
            onSubmit={submitForm}>
            {({handleChange, handleBlur, handleSubmit, values}) => (
              <Container>
                    <View style={layoutStyles.header}>
                        <Text style={typoStyles.heading}>
                            {id ? 'Редактировать' : 'Добавить'}
                        </Text>
                    </View>

                    <ScrollView>
                        <View style={formStyles.form}>
                            <Field label={'Название'} name={'name'}>
                                <Input
                                    value={values.name}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                />
                            </Field>

                            <Field label={'Калорийность'} name={'kcal'}>
                                <Input
                                    inputMode={'numeric'}
                                    maxLength={7}
                                    value={values.kcal}
                                    onChangeText={handleChange('kcal')}
                                    onBlur={handleBlur('kcal')}
                                    placeholder={'0'}
                                />
                            </Field>

                            <Field label={'Белки'} name={'protein'}>
                                <Input
                                    inputMode={'numeric'}
                                    maxLength={7}
                                    value={values.protein}
                                    onChangeText={handleChange('protein')}
                                    onBlur={handleBlur('protein')}
                                    placeholder={'0'}
                                />
                            </Field>

                            <Field label={'Жиры'} name={'fat'}>
                                <Input
                                    inputMode={'numeric'}
                                    maxLength={7}
                                    value={values.fat}
                                    onChangeText={handleChange('fat')}
                                    onBlur={handleBlur('fat')}
                                    placeholder={'0'}
                                />
                            </Field>

                            <Field label={'Углеводы'} name={'carbs'}>
                                <Input
                                    inputMode={'numeric'}
                                    maxLength={7}
                                    value={values.carbs}
                                    onChangeText={handleChange('carbs')}
                                    onBlur={handleBlur('carbs')}
                                    placeholder={'0'}
                                />
                            </Field>

                            <Field label={'Вес'} name={'weight'}>
                                <Input
                                    inputMode={'numeric'}
                                    maxLength={7}
                                    value={values.weight}
                                    onChangeText={handleChange('weight')}
                                    onBlur={handleBlur('weight')}
                                    placeholder={'0'}
                                />
                            </Field>

                            <Field label={'Клечатка'} name={'fiber'}>
                                <Input
                                    inputMode={'numeric'}
                                    maxLength={7}
                                    value={values.fiber}
                                    onChangeText={handleChange('fiber')}
                                    onBlur={handleBlur('fiber')}
                                    placeholder={'0'}
                                />
                            </Field>

                            <Field label={'Соль'} name={'salt'}>
                                <Input
                                    inputMode={'numeric'}
                                    maxLength={7}
                                    value={values.salt}
                                    onChangeText={handleChange('salt')}
                                    onBlur={handleBlur('salt')}
                                    placeholder={'0'}
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
