import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-ico-font-awesome';

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}




function SingleDebt({ debt, handleDeleteDebt }) {
    const {note, duration, date, destination, amount} = debt

    
    return (
        <View style={[styles.debtContainer, styles.shadow]}>
        
        {
            //Touchable bouton with trash icon become red when pressed
        }


            <Icon style={styles.deleteButton} name="trash" color="black" size={20}   onPress={() => {handleDeleteDebt(debt.id)}}/>

        

        <View>
            <Text style={styles.debtText}>{duration ? `Durée : ${duration} heure${duration > 1 ? 's' : ''}` : ''}</Text>
            <Text style={styles.debtText}>{destination ? `Destination :${destination}` : ''}</Text>
            <Text style={styles.debtText}>{note ? `Note : \n${note}` : ''}</Text>

        </View>

             <Text style={[{fontSize: 20},styles.texte, amount >= 0 ? styles.positiveAmount : styles.negativeAmount]}>
                {Math.abs(amount)}
            </Text>
            <Text style={styles.date}>{date ? `${formatDate(date)}` : '???'}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    debtContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        position : 'relative',
        borderRadius: 16,

    },

    debtText: {
        fontSize: 16, 
        width: 250,  
    },

    positiveAmount: {
        color: 'green',
    },

    negativeAmount: {
        color: 'red',
    },

    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },

    date : {
        position: 'absolute',
        right: 20,
        bottom: 20,
        color: 'gray',
    },

    deleteButton : {
        position: 'absolute',
        right: 20,
        top: 20,
    }
});

export default SingleDebt;