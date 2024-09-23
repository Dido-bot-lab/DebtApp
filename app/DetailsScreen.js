import { useLocation } from 'react-router-native';
import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';
import Header from './Header';
import DatabaseManager from './DatabaseManager';
import LoadingPage from './LoadingPage';
import NewDebtPage from './NewDebtPage';
import SingleDebt from './SingleDebt';

function filterDebtsList(debtsList, debt_buddy) {
  const filter = debtsList.filter(debt => debt.debt_buddy === debt_buddy);
  filter.sort((a, b) => new Date(a.date) - new Date(b.date));
  return filter;
}

function DetailsScreen() {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop(); // Récupère le dernier segment de l'URL

  const dbManager = DatabaseManager.getInstance();
  const [loading, setLoading] = useState(true);
  const [debtList, setDebtList] = useState([]);
  const [showNewDebtPage, setShowNewDebtPage] = useState(false);
  const navigate = useNavigate();

  const initDebts = useCallback(async () => {
    try {
      await dbManager.initPromise; // Wait for initialization to complete
      const debts = await dbManager.getDebtList();
      const filter = filterDebtsList(debts, pageName);
      setDebtList(filter);
    } catch (error) {
      console.error("Error initializing debts:", error);
    } finally {
      setLoading(false);
    }
  }, [dbManager, pageName]);

  useEffect(() => {
    console.log("Page name changed:", pageName);
    initDebts();
  }, [pageName, initDebts]);

  const handleAddDebt = async (debt) => {
    try {
      setShowNewDebtPage(false);
      await dbManager.addDebt(debt);
      const debts = await dbManager.getDebtList();
      setDebtList(filterDebtsList(debts, pageName));
    } catch (error) {
      console.error("Error adding debt:", error);
    }
  };

  const removeDebt = async (id) => {
    try {
      await dbManager.deleteDebt({ id });
      initDebts();
    } catch (error) {
      console.error("Error removing debt:", error);
    }
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
        <Header HomePage={false} Name={pageName} />

        {debtList.length === 0 ? (
          <Text style={styles.texte}>No debt</Text>
        ) : (
          debtList.map((debt, index) => (
            <SingleDebt key={index} debt={debt} handleDeleteDebt={removeDebt} />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.buttonAdd, styles.shadow]}
        onPress={() => setShowNewDebtPage(!showNewDebtPage)}>
        <Text style={{ fontSize: 32 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  },

  listRelationship: {
    width: '100%',
    height: '100%',
    flex: 1,
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

export default DetailsScreen;
