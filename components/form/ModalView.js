import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import Button from './Button';
import * as yup from 'yup';


const newDeliverymanSchema = yup.object({
    newDeliverymanName: yup
    .string()
    .required()
});

const newDefaultFeeValueSchema = yup.object({
    newDefaultFeeValueValue: yup
    .string()
    .required()
});


export default function ModalView({ defaultFee, newDefaultFeeValue, handleCloseModal, settings, deliverymans, deleteDeliveryman, newDeliveryman }) {

    const [newDeliverymanName, setNewDeliverymanName] = useState(settings.defaultDeliveryMan[0]?.name);
    const [newDefaultFeeValueValue, setNewDefaultFeeValue] = useState(defaultFee);

    const handleLongPress = deliveryman => {
        Alert.alert('Tem certeza?',
        `O entregador '${deliveryman.name}' será deletado.`,
        [{text: 'OK', onPress: () => deleteDeliveryman(deliveryman.id)}, {text: 'CANCEL', style: 'cancel'}],
        {cancelable: true});
    }

    const handleNewDefaultFeeValue = () => {
        newDefaultFeeValueSchema
            .isValid({newDefaultFeeValueValue})
            .then( valid => {
                if (valid) {
                    newDefaultFeeValue(newDefaultFeeValueValue);
                    setNewDefaultFeeValue('');
                }
            })
    }

    const handleNewDeliveryman= () => {
        newDeliverymanSchema
            .isValid({newDeliverymanName})
            .then( valid => {
                if (valid) {
                    newDeliveryman(newDeliverymanName);
                    setNewDeliverymanName('');
                }
            })
    }

    return (
        <View style={styles.modalContainer}>
            <TouchableOpacity style={{alignSelf: 'flex-end', padding: 20}} onPress={handleCloseModal}>
                <AntDesign name="close" size={28} color="white" />
            </TouchableOpacity>
            <View style={styles.settingsOutterContainer}>
                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View style={styles.settingsContainer}>
                        <TextInput 
                            style={styles.TextInput}
                            value={newDeliverymanName}
                            onChangeText={val => setNewDeliverymanName(val)}
                            placeholder='Novo entregador'
                            placeholderTextColor={'grey'}
                        />
                        <Button onPress={handleNewDeliveryman} flex={1} title='Adicionar Entregador' />
                    </View>
                    <View style={styles.settingsContainer}>
                        <TextInput 
                            style={styles.TextInput}
                            value={newDefaultFeeValueValue}
                            onChangeText={val => setNewDefaultFeeValue(val)}
                            placeholder='Nova taxa padrão'
                            placeholderTextColor={'grey'}
                        />
                        <Button onPress={handleNewDefaultFeeValue} width={250} title='Mudar frete padrão' />
                    </View>
                    <View style={styles.settingsContainer}>
                        <Text style={{alignSelf: 'flex-start', padding: 10, color: '#e8eaed'}}>Entregadores:</Text>
                        {deliverymans?.map(deliveryman => <View style={styles.deliverymanContainer} key={deliveryman.id}>
                            <TouchableOpacity onLongPress={() => handleLongPress(deliveryman)}>
                                <Text style={{color: '#e8eaed', padding: 25, alignSelf: 'center'}}>{deliveryman.name}</Text>
                            </TouchableOpacity>
                        </View>)}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#1d292f'
    },
    settingsContainer: {
        margin: 10,
        padding: 10,
        borderBottomColor: '#5d3fd3',
        borderBottomWidth: 1,
        borderRadius: 3,
        alignItems: 'center'

    },
    settingsOutterContainer: {
        flex: 1,
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        backgroundColor: '#121b22', 
        margin: 10, 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#5d3fd3'
    },
    deliverymanContainer: {
        flexDirection: 'row',
        backgroundColor: '#1d292f',
        padding: 5,
        margin: 5, 
        borderRadius: 5
    }, TextInput: {
        padding: 5,
        margin: 5,
        borderRadius: 3,
        color: '#e8eaed',
        backgroundColor: '#1d292f'
    }
});