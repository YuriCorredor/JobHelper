import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons'; 
import { prettifyDate } from '../util';
import * as Clipboard from 'expo-clipboard';

export default function ModalView({ handleCloseModal, dailyResumes, handlePressFinishDay, deliverymans }) {

    const [startDate, setStartDate] = useState(dailyResumes[0]?.day);
    const [finishDate, setFinishDate] = useState(dailyResumes[dailyResumes.length-1]?.day);
    const [finalResume, setFinalResume] = useState();

    useEffect(() => {
        let purchases = 0;
        let fees = 0;
        let numberOfPurchases = 0;
        let feeDeliveryman = {};

        for(let i = 0; i < dailyResumes.length; i++){
            const resume = dailyResumes[i];
            const day = new Date(resume.day);
            const start = new Date(startDate);
            const finish = new Date(finishDate);
            if(day >= start && day <= finish){
                let totalPurchases = parseFloat(resume.totalPurchases);
                let feeValue = parseFloat(resume.totalFee);
                let numOfPurchases = parseFloat(resume.numberOfPurchases);
                for(let j = 0; j < resume.totalFeeForDeliverymans.length; j++){
                    const deliveryman = resume.totalFeeForDeliverymans[j];
                    if(!(feeDeliveryman[deliveryman.id] === undefined)){
                        let float0 = parseFloat(feeDeliveryman[deliveryman.id].totalFee);
                        let float1 = parseFloat(deliveryman.totalFee);
                        feeDeliveryman[deliveryman.id].totalFee = (float0 + float1).toFixed(2);
                    } else {
                        feeDeliveryman[deliveryman.id] = {id: deliveryman.id, name: deliveryman.name, totalFee: deliveryman.totalFee};
                    }
                }
                purchases += isNaN(totalPurchases)? 0 : totalPurchases;
                fees += isNaN(feeValue) ? 0 : feeValue;
                numberOfPurchases += isNaN(numOfPurchases) ? 0 : numOfPurchases;
            }
        }
        setFinalResume({startDate, finishDate, purchases, fees, numberOfPurchases, feeDeliveryman});
    }, [startDate, finishDate]);

    const handleFinishDayAlert = () => {
        Alert.alert(
            'Tem certeza?',
            `O dia será encerrado!`,
            [{text: 'Encerrar', onPress: handlePressFinishDay}, {text: 'CANCEL', style: 'cancel'}],
            {cancelable: true}
        )
    }

    const copyToClipboard = () => {
        Clipboard.setString(`*resultado ${prettifyDate(finalResume?.startDate)} - ${prettifyDate(finalResume?.finishDate)}*\n\nPedidos: ${finalResume?.numberOfPurchases}\n\nTotal fretes: R$${finalResume?.fees}\n\nTotal vendas: R$${finalResume?.purchases}\n\n\n\n${deliverymans.map(deliveryman => {
            if(!(finalResume?.feeDeliveryman[deliveryman.id] === undefined)) {
                return `\nNome: ${deliveryman.name}\nTotal: R$${finalResume?.feeDeliveryman[deliveryman.id]?.totalFee}\n`;
            }
        })}`);
    }

    return (
        <View style={styles.modalContainer}>
            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{padding: 20}} onPress={handleFinishDayAlert}>
                    <FontAwesome name="check-square" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 20}} onPress={handleCloseModal}>
                    <AntDesign name="close" size={28} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.settingsOutterContainer}>
                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View style={styles.settingsContainer}>
                        <Text style={{alignSelf: 'flex-start', color: 'white', margin: 5}}>Data do começo</Text>
                        <Picker
                            dropdownIconColor={'white'}
                            style={{color: '#e8eaed', width: '100%', marginBottom: 20}}
                            selectedValue={startDate}
                            onValueChange={(itemValue) => {
                                setStartDate(itemValue);
                            }}
                        >
                            {
                            dailyResumes?.map(resume=> <Picker.Item 
                                key={resume.id} 
                                label={prettifyDate(resume.day)} 
                                value={resume.day} 
                            />)
                            }
                        </Picker>
                        <Text style={{alignSelf: 'flex-start', color: 'white', margin: 5}}>Data do fim</Text>
                        <Picker
                            dropdownIconColor={'white'}
                            style={{color: '#e8eaed',width: '100%' }}
                            selectedValue={finishDate}
                            onValueChange={(itemValue) => {
                                setFinishDate(itemValue);
                            }}
                        >
                            {
                            dailyResumes?.map(resume=> <Picker.Item 
                                key={resume.id} 
                                label={prettifyDate(resume.day)} 
                                value={resume.day} 
                            />)
                            }
                        </Picker>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', padding: 5}}>
                        <TouchableOpacity onPress={copyToClipboard}>
                            <Text style={{color: '#e8eaed'}}>{console.log(finalResume?.feeDeliveryman)}
                                Pedidos: {finalResume?.numberOfPurchases}{'\n'}
                                Total fretes: R${finalResume?.fees}{'\n'}
                                Total vendas: R${finalResume?.purchases}
                            </Text>
                        </TouchableOpacity>
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
    settingsContainer: {
        margin: 10,
        padding: 10,
        borderBottomColor: '#5d3fd3',
        borderBottomWidth: 1,
        borderRadius: 3,
        alignItems: 'center'

    }
});