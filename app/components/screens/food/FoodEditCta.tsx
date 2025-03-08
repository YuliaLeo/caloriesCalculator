import { View } from 'react-native';
import React, { PropsWithChildren } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes.tsx';
import {ID} from '../../../domain/id.ts';
import {Button} from '../../common/Button.tsx';


type Props = PropsWithChildren<{
    id?: ID;
    defaultName?: string;
}>;

export function FoodEditCta(
    {
        id,
        defaultName,
    }: Props): React.JSX.Element {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const title = id ? 'Редактировать' : 'Добавить';

    const navigateToFoodEdit = () => {
        navigation.navigate('FoodEdit', {id});
    };

    return (
        <View>
            <Button
                onPress={() => navigateToFoodEdit()}
                title={title}
            />
        </View>
    );
}
