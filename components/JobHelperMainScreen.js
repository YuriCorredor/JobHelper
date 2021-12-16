import React, { useState, useEffect } from 'react';
import Form from './Form';
import Purchase from './Purchase';
import Summary from './Summary';
import uuid from 'react-native-uuid';
import { saveToStorage, loadFromStorage, removeFromStorage } from './util';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export default function JobHelperMainScreen() {
    
    const [purchases, setPurchases] = useState([]);
    const [deliverymans, setDeliverymans] = useState(null);
    const [settings, setSettings] = useState({});
    const [defaultFee, setDefaultFee] = useState('');
    const [loading, setLoading] = useState(true);
    const [dailyResumes, setDailyResumes] = useState([]);


    useEffect(() => {
        async function loadPurchases() {
            const loadedPurchases = await loadFromStorage('purchases');
            const loadedDeliverymans = await loadFromStorage('deliverymans');
            const loadedSettings = await loadFromStorage('settings');
            const loadedDailyResumes = await loadFromStorage('dailyResumes');
            if(loadedDailyResumes){
                setDailyResumes(loadedDailyResumes);
            }
            if(loadedPurchases){
                setPurchases(loadedPurchases);
            }
            if(loadedDeliverymans){
                setDeliverymans(loadedDeliverymans);
            }
            if(loadedSettings){
                setSettings(loadedSettings);
                setDefaultFee(loadedSettings.defaultFee);
                if(!loadedDeliverymans){    
                    setDeliverymans(loadedSettings.defaultDeliveryMan);
                }
            } else {
                const defaultSettings = {defaultDeliveryMan: [{id: '1', name:'Entregador'}], defaultFee: '3'}
                saveToStorage('settings', defaultSettings);
                setDefaultFee(defaultSettings.defaultFee);
                setDeliverymans(defaultSettings.defaultDeliveryMan);
            }
            setLoading(false);
        }
        loadPurchases();
    }, []);

    const newDefaultFeeValue = value => {
        saveToStorage('settings', {defaultDeliveryMan: deliverymans.length === 0 ? [{id: '1', name:'Entregador'}] : deliverymans, defaultFee: value});
        setDefaultFee(value);
    }

    const newPurchase = data => {
        const id = uuid.v4();
        const value = data.purchaseValue;
        const fee = data.feeValue;
        const deliveryman = data.currentDeleveryman;
        setPurchases(prevPurchases => {
            const newArray = [{ id, value, fee, deliveryman }, ...prevPurchases];
            saveToStorage('purchases', newArray);
            return newArray;
        });
    }

    const newDeliveryman = data => {
        const id = uuid.v4();
        const name = data;
        setDeliverymans(prevDeliverymans => {
            const newArray = [{id, name}, ...prevDeliverymans];
            saveToStorage('deliverymans', newArray);
            saveToStorage('settings', {defaultDeliveryMan: newArray, defaultFee: defaultFee});
            return newArray;
        });
    }

    const deleteDeliveryman = id => {
        setDeliverymans(prevDeliverymans => {
            const newArray = prevDeliverymans.filter(deliveryman => deliveryman.id !== id);
            if (newArray.length === 0) {
                removeFromStorage('deliverymans');
                saveToStorage('settings', {defaultDeliveryMan: [{id: '1', name:'Entregador'}], defaultFee: defaultFee});
            } else {
                saveToStorage('deliverymans', newArray);
                saveToStorage('settings', {defaultDeliveryMan: newArray, defaultFee: defaultFee});
            }
            return newArray;
        });
    }
    
    const deletePurchase = id => {
        setPurchases(prevPurchases => {
            const newArray = prevPurchases.filter(purchase => purchase.id !== id);
            saveToStorage('purchases', newArray);
            return newArray;
        });
    }

    const updatePurchase = (data, id) => {
        const value = data.value;
        const fee = data.fee;
        const deliveryman = data.deliveryman;
        setPurchases(prevPurchases => {
            const newArray = prevPurchases.map(purchase => purchase.id === id ? { id, value, fee, deliveryman } : purchase);
            saveToStorage('purchases', newArray);
            return newArray;
        });
    }
    
    const handleFinishDay = data => {
        const id = uuid.v4();
        const day = data.day;
        const totalPurchases = data.totalPurchases;
        const totalFee = data.totalFee;
        const totalFeeForDeliverymans = data.totalFeeForDeliverymans;
        const numberOfPurchases = data.numberOfPurchases;
        setDailyResumes(prevDailyResumes => {
            const newArray = [{id, day, totalFee, totalPurchases, totalFeeForDeliverymans, numberOfPurchases}, ...prevDailyResumes];
            saveToStorage('dailyResumes', newArray);
            return newArray;
        });
        removeFromStorage('purchases');
        setPurchases([]);
    }


    if (loading) {
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121b22'}}>
                <ActivityIndicator size={50} color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Form 
                newDefaultFeeValue={newDefaultFeeValue}
                defaultFee={defaultFee} 
                settings={settings} 
                deleteDeliveryman={deleteDeliveryman} 
                newDeliveryman={newDeliveryman}
                newPurchase={newPurchase}
                deliverymans={deliverymans} 
            />
            <Purchase 
                deliverymans={deliverymans} 
                updatePurchase={updatePurchase} 
                deletePurchase={deletePurchase} 
                purchases={purchases} 
            />
            <Summary 
                handleFinishDay={handleFinishDay}
                dailyResumes={dailyResumes} 
                deliverymans={deliverymans} 
                purchases={purchases} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});