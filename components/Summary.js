import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { prettifyDate, getTotals, getTotalsForDeliverymans } from './util';
import { MaterialIcons } from '@expo/vector-icons'; 
import ModalView from './summary/ModalView';

export default function Summary({ handleFinishDay, purchases, deliverymans, dailyResumes }) {
    
    const [totalPurchases, setTotalPurchases] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [totalFees, setTotalFees] = useState(0);
    const [totalFeeForDeliverymans, setTotalFeeForDeliverymans] = useState([{}]);
    const [numberOfPurchases, setNumberOfPurchases] = useState(0);
    const [averagePurchase, setAvaragePurchase] = useState(0);
    const [day, setDay] = useState(null);

    useEffect(() => {
        if(!day) {
            const currentDate = new Date();
            setDay(currentDate);
        }
    }, [day]);

    useEffect(() => {
        const newTotals = getTotals(purchases);
        const newTotalForDeliverymans = getTotalsForDeliverymans(deliverymans, purchases);
        setTotalFeeForDeliverymans(newTotalForDeliverymans);
        setTotalPurchases(newTotals.newTotalPurchases);
        setTotalFees(newTotals.newTotalFees);
        setAvaragePurchase(newTotals.newAvaragePurchase);
        setNumberOfPurchases(purchases.length);
    }, [purchases, deliverymans]);

    const handleCloseModal = () => {
        setModalOpen(false);
    }

    const copyToClipboard = () => {
        Clipboard.setString(`*resultado ${prettifyDate(day)}*\n\nPedidos: ${numberOfPurchases}\n\nTotal frete: R$${totalFees}\n\nTotal vendas: R$${totalPurchases}\n\nCompra média: R$${averagePurchase}\n\n${totalFeeForDeliverymans?.map(deliveryman => `\nTotal frete ${deliveryman.name}: ${deliveryman.totalFee}`)}`);
    }

    const handlePressFinishDay = () => {
        const data = {day, totalPurchases, totalFee: totalFees, totalFeeForDeliverymans, numberOfPurchases}
        handleFinishDay(data);
    }

    return (
        <TouchableOpacity style={styles.container} onPress={copyToClipboard}>
            <Modal visible={modalOpen}>
                <ModalView
                    deliverymans={deliverymans}
                    handlePressFinishDay={handlePressFinishDay}
                    dailyResumes={dailyResumes} 
                    handleCloseModal={handleCloseModal} 
                    />
            </Modal>
            <Text style={styles.textStyles}>
                Pedidos: {numberOfPurchases}{'\n'}
                Total fretes: R${totalFees}{'\n'}
                Total vendas: R${totalPurchases}
            </Text>
            <TouchableOpacity onPress={() => setModalOpen(true)} style={{alignSelf: 'center', padding: 5}}>
                <MaterialIcons name="more-horiz" size={24} color="white" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: '#1d292f',
        borderColor: '#5d3fd3',
        borderStartWidth: 5,
        marginTop: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    textStyles: {
        color: '#e8eaed'
    }
});