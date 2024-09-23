import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';
import Header from './Header';
import DatabaseManager from './DatabaseManager';
import LoadingPage from './LoadingPage';
import NewDebtPage from './NewDebtPage';

const sumsDebts = (debtList) => {
  if (debtList.length === 0) 
    return {};

  const debtSums = debtList.reduce((acc, debt) => {
    if (acc[debt.debt_buddy]) {
      acc[debt.debt_buddy] += debt.amount;
    } else {
      acc[debt.debt_buddy] = debt.amount;
    }

    return acc;
  }, {});
  
  return debtSums;
}

function HomeScreen() {
  const dbManager = DatabaseManager.getInstance();
  const [loading, setLoading] = useState(true);
  const [debtList, setDebtList] = useState([]);
  const [showNewDebtPage, setShowNewDebtPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initDebts = async () => {
      await dbManager.initPromise; // Attendre que l'initialisation soit terminée
      const debts = await dbManager.getDebtList();
      setDebtList(sumsDebts(debts));
      setLoading(false);
    };

    initDebts();
  }, []);

  const handleAddDebt = async (debt) => {
    setShowNewDebtPage(false);
    await dbManager.addDebt(debt);
    const debts = await dbManager.getDebtList();
    setDebtList(sumsDebts(debts));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingPage />
      </View>
    );
  }

  return (
    <View style={styles.globalContainer}>
      {showNewDebtPage && <NewDebtPage handleAddDebt={handleAddDebt} handleClose={() => setShowNewDebtPage(false)} />}


      <ScrollView style={styles.listRelationship}>
        <Header HomePage={true} />

        {
          Object.keys(debtList).length === 0 ? (
            <Text style={styles.texte}>No debt</Text>
          ) : (
            Object.entries(debtList).map(([debt_buddy, amount], index) => (
              <TouchableOpacity
                key={index}
                style={[styles.relationship, styles.shadow]}
                onPress={() => navigate(`/details/${debt_buddy}`)}
              >
                <Text style={styles.texte}>{debt_buddy}</Text>
                <Text style={[styles.texte, amount >= 0 ? styles.positiveAmount : styles.negativeAmount]}>
                  {Math.abs(amount)}
                </Text>
              </TouchableOpacity>
            ))
          ) 
        }
      </ScrollView>

      <TouchableOpacity 
        style={[styles.buttonAdd, styles.shadow]}
        onPress={() => setShowNewDebtPage(!showNewDebtPage)}>
        <Text style={{fontSize: 32}}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'top',
    backgroundColor: 'white',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  },

  listRelationship: {
    width: '100%',
    flex: 1,
    backgroundColor: 'white',

  },
  
  relationship: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin : 20,
    height: 75,
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

  texte: {
    color: 'black',
    fontSize: 18,
  },

  buttonAdd: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30, // Pour rendre le bouton rond
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
  },

  positiveAmount: {
    color: 'green',
  },

  negativeAmount: {
    color: 'red',
  },
});

export default HomeScreen;
