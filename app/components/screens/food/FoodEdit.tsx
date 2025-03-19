import { ScrollView, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { Formik } from 'formik';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes.tsx';
import {defaultFood, FoodForm, FoodSchema, toFoodForm} from '../../../models/food.ts';
import {Container} from '../../common/Container.tsx';
import {layoutStyles} from '../../../styles/layout.tsx';
import {typoStyles} from '../../../styles/typo.tsx';
import {formStyles} from '../../../styles/form.tsx';
import {Field} from '../../common/Field.tsx';
import {Input} from '../../common/Input.tsx';
import {Button} from '../../common/Button.tsx';
import {useAppDispatch, useAppSelector} from '../../../domain/hooks.ts';
import {generateId} from '../../../models/id.ts';
import {addFood, findFoodById, updateFood} from '../../../store/food.tsx';
import {setSelection} from '../../../store/selection.tsx';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodEdit'>;

export function FoodEdit({navigation, route}: Props): React.JSX.Element {
    const dispatch = useAppDispatch();

    const id = route.params.id;

    const defaultName = useAppSelector(state => state.food.defaultName);

    const exist = useAppSelector(state => findFoodById(state, id));
    const food = useMemo(() => {
        return exist ? toFoodForm(exist) : defaultFood(defaultName);
    }, [defaultName, exist]);

    const selection = useAppSelector(state => state.selection.items);

    const submitForm = (values: FoodForm) => {
        const foodEdit = FoodSchema.cast(values);
        foodEdit.name = foodEdit.name?.trim();

        if (food.id) {
            dispatch(updateFood({id: food.id, body: foodEdit}));
        } else {
            const newId = generateId();

            dispatch(addFood({
                ...foodEdit,
                id: newId,
            }));

            dispatch(setSelection([
                ...selection,
                newId,
            ]));
        }

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
