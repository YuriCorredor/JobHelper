import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function Purchase({ purchases, deletePurchase, updatePurchase, deliverymans }) {

    const changeTextHandler = (data, id) => {
        updatePurchase(data, id);
    }

    return (
        <ScrollView style={styles.container}>
        {purchases.map(purchase => <View style={styles.textContainer} key={purchase.id}>
            <View style={styles.textInnerContainer}>
                <TextInput
                    keyboardType={'numeric'}
                    style={styles.textStyles}
                    value={purchase.value}
                    onChangeText={(val) => changeTextHandler({value: val, fee: purchase.fee, deliveryman: purchase.deliveryman}, purchase.id)}
                />
                <TextInput
                    keyboardType={'numeric'}
                    onChangeText={(val) => updatePurchase({value: purchase.value, fee: val, deliveryman: purchase.deliveryman}, purchase.id)}
                    style={styles.textStylesFee}
                    value={purchase.fee}
                />
            </View>
            <Picker
                dropdownIconColor={'white'}
                style={{color: '#e8eaed', width: 150}}
                selectedValue={purchase.deliveryman}
                onValueChange={newDeliveryman => {
                    updatePurchase({value: purchase.value, fee: purchase.fee, deliveryman: newDeliveryman}, purchase.id);
                }}
            >
            {
                deliverymans?.map(deliveryman => 
                <Picker.Item 
                    key={deliveryman.id} 
                    label={deliveryman.name} 
                    value={deliveryman.name} 
                />)
            }
            </Picker>
            <TouchableOpacity onPress={() => deletePurchase(purchase.id)} style={styles.deleteButton}>
                <MaterialIcons name="delete-outline" size={25} color='#5d3fd3' />
            </TouchableOpacity>
        </View>)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    textInnerContainer: {
        flex: 10
    },
    container: {
        padding: 5
    },
    textStyles: {
        color: '#e8eaed',
        fontSize: 15
    },
    textStylesFee: {
        color: '#e8eaed',
        fontSize: 12
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 5,
        padding: 5,
        margin: 10,
        backgroundColor: '#1d292f'
    },
    deleteButton: {
        flex: 1,
        alignSelf: 'center'
    }
});