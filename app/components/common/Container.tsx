import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = PropsWithChildren<{
    children?: React.ReactNode;
}>;

export function Container({children}: Props): React.JSX.Element {
    const containerStyles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#eee',
        },
    });

    return (
        <View style={containerStyles.container}>
            {children}
        </View>
    );
}
