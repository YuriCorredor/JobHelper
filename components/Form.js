import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import ModalView from './form/ModalView';
import Button from './form/Button';

const purchaseSchema = yup.object({
    purchaseValue: yup
        .number()
        .required(),
    feeValue: yup
        .number()
        .required()
});

export default function Form({ newDefaultFeeValue, deleteDeliveryman, newPurchase, newDeliveryman, deliverymans, defaultFee, settings }) {

    useEffect(() => {
        setFeeValue(defaultFee);
    }, [defaultFee]);

    const [purchaseValue, setPurchaseValue] = useState('');
    const [feeValue, setFeeValue] = useState(defaultFee);
    const [currentDeleveryman, setCurrentDeliveryman] = useState(deliverymans[0]?.name);
    const [modalOpen, setModalOpen] = useState(false);

    const submitForm = () => {
        purchaseSchema
            .isValid({purchaseValue, feeValue})
            .then( valid => {
                if (valid) {
                    newPurchase({purchaseValue, feeValue, currentDeleveryman});
                    setFeeValue(defaultFee);
                    setPurchaseValue('');
                }
            });
    }

    const handleCloseModal = () => {
        setModalOpen(false);
    } 


    return (
        <View style={styles.container}>
            <Modal visible={modalOpen}>
                <ModalView
                    newDefaultFeeValue={newDefaultFeeValue}
                    newDeliveryman={newDeliveryman} 
                    deleteDeliveryman={deleteDeliveryman} 
                    deliverymans={deliverymans} 
                    settings={settings} 
                    handleCloseModal={handleCloseModal}
                    defaultFee={defaultFee}
                />
            </Modal>
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInputStyles}
                    value={purchaseValue}
                    onChangeText={val => setPurchaseValue(val)}
                    placeholder={'Valor da venda'}
                    keyboardType={'numeric'}
                    placeholderTextColor={'grey'}
                />
                <TextInput
                    style={styles.textInputStyles}
                    value={feeValue}
                    onChangeText={val => setFeeValue(val)}
                    placeholder={'Valor do frete'}
                    keyboardType={'numeric'}
                    placeholderTextColor={'grey'}
                />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Picker
                    dropdownIconColor={'white'}
                    style={{color: '#e8eaed', flex: 1}}
                    selectedValue={currentDeleveryman}
                    onValueChange={(itemValue) => {
                        setCurrentDeliveryman(itemValue);
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
                <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <AntDesign name="setting" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Button onPress={submitForm} title='Nova venda' />
        </View>
    );
}

const styles = StyleSheet.create({
    textInputStyles: {
        padding: 10,
        color: '#e8eaed'
    },
    container: {
        padding: 10,
        paddingTop: 0,
        backgroundColor: '#1d292f',
        borderColor: '#5d3fd3',
        borderStartWidth: 5,
        marginBottom: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    }
});
