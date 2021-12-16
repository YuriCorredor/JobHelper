import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveToStorage = async (keyOfValueToStore ,valueToBeStoraged) => {
    try {
        await AsyncStorage.setItem(keyOfValueToStore, JSON.stringify(valueToBeStoraged));
    } catch (error) {
        alert(error);
    } finally {
        return true
    }
}


export const loadFromStorage = async (KeyofValueToBeGettedFromStorage) => {
    try {
        let item = await AsyncStorage.getItem(KeyofValueToBeGettedFromStorage);
        if (item !== null) {
            return JSON.parse(item)
        } else {
            return false;
        }
    } catch (error) {
        alert(error);
    }
}


export const removeFromStorage = async (keyOfValueToRemove) => {
    try {
        await AsyncStorage.removeItem(keyOfValueToRemove);
    } catch (error) {
        alert(error);
    } finally {
        return true;
    }
}


export const prettifyDate = date => {
    date = new Date(date);
    let currentDay = date.getDate();
    let currentMonth = date.getMonth() + 1;
    let currentYear = date.getFullYear();
    currentDay = currentDay < 10 ? `0${currentDay}` : currentDay;
    currentMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    return `${currentDay}/${currentMonth}/${currentYear}`;
}


export const getTotals = data => {
    let newTotalPurchases = 0;
    let newTotalFees = 0;
    for(let i = 0; i < data.length; i++) {
        let purchaseValue = parseFloat(data[i].value);
        let fee = parseFloat(data[i].fee);
        purchaseValue = isNaN(purchaseValue) ? 0 : purchaseValue;
        fee = isNaN(fee) ? 0 : fee;
        newTotalPurchases += purchaseValue;
        newTotalFees += fee;
    }
    let newAvaragePurchase = newTotalPurchases/data.length;
    newAvaragePurchase = newAvaragePurchase.toFixed(2);
    newTotalPurchases = newTotalPurchases.toFixed(2);
    newTotalFees = newTotalFees.toFixed(2);
    console.log('newTotalFees: ', newTotalFees);
    return {newAvaragePurchase, newTotalFees, newTotalPurchases};
}


export const getTotalsForDeliverymans = (deliverymans, purchases)=> {
    let newArray = [];
    for(let i = 0; i < deliverymans?.length; i++){
        const deliverymanName = deliverymans[i].name;
        const deliverymanId = deliverymans[i].id;
        let total = 0;
        for(let j = 0; j < purchases?.length; j++){
            const deliverymanPurchaseName = purchases[j].deliveryman;
            const feeValue = parseFloat(purchases[j].fee);
            if(deliverymanPurchaseName === deliverymanName){
                total += isNaN(feeValue) ? 0 : feeValue;
            }
        }
        total = total.toFixed(2);
        console.log(deliverymanName, total);
        if(!(total === "0.00")) {
            newArray.push({id: deliverymanId, name: deliverymanName, totalFee: total});
        }
    }
    return newArray;
}