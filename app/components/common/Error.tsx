import React from "react";
import {StyleSheet, Text, View} from "react-native";

interface ErrorProps {
    error: string;
}

export const Error = ({ error }: ErrorProps): React.JSX.Element => {
    return (
        <View style={styles.messageContainer}>
            <Text style={styles.errorText}>{error}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF3B30',
    },
});
