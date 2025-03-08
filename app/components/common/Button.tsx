import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {primaryColor} from '../../styles/variables.tsx';

interface ButtonProps {
    title: string;
    onPress: () => void;
}

export const Button = ({ title, onPress }: ButtonProps): React.JSX.Element => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
