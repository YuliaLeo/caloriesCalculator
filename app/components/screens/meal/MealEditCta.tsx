import React, { PropsWithChildren, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {ID} from '../../../models/id.ts';
import {RootStackParamList} from '../../../routes.tsx';
import {Button} from '../../common/Button.tsx';
import {Screens} from '../../../domain/screens.ts';

type Props = PropsWithChildren<{
    id?: ID;
    newMealId?: ID;
}>;

export function MealEditCta({id, newMealId}: Props): React.JSX.Element {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const key = newMealId ? 'newMealId' : 'id';
    const value = newMealId || id;

    const title = useMemo(() => {
        if (newMealId) {
            return 'Копировать';
        }

        return id ? 'Редактировать' : 'Добавить';
    }, [id, newMealId]);

    const navigateToMealEdit = () => {
        navigation.navigate(Screens.MealEdit, {
            [key]: value,
        });
    };

    return <Button
        title={title}
        onPress={navigateToMealEdit}
    />;
}

