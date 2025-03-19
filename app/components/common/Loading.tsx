import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

export const Loading = (): React.JSX.Element => {
    return (
        <View style={styles.messageContainer}>
            <ActivityIndicator size="large" color="#007BFF" style={styles.activityIndicator} />
            <Text style={styles.loadingText}>Загрузка...</Text>
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
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007BFF',
    },
    activityIndicator: {
        marginBottom: 20,
    },
});
