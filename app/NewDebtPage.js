import React, { useState , useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatabaseManager from './DatabaseManager';

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function NewDebtPage({ handleAddDebt, handleClose }) {
  const [debtBuddy, setDebtBuddy] = useState('');
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredSuggestionsBuddy, setFilteredSuggestionsBuddy] = useState([]);
  const [filteredSuggestionsDestination, setFilteredSuggestionsDestination] = useState([]);
  const [buddySuggestions, setBuddySuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const handleFocus = (input) => {
    setFocusedInput(input);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onSubmit = () => {
    if (!debtBuddy || !amount) {
      alert('Please fill all fields with an *');
      return;
    }

    // Retire les espaces en fin de chaîne
    setDebtBuddy(debtBuddy.trim());
    setDestination(destination.trim());
    setNote(note.trim());

    const newDebt = {
      debt_buddy: debtBuddy,
      destination,
      amount: amount === null ? null : parseInt(amount, 10),
      note,
      date: date.toISOString().split('T')[0],
      duration: duration === null ? null : parseInt(duration, 10),
    };
    handleAddDebt(newDebt);
  };

  const handleDebtBuddyChange = (text) => {
    setDebtBuddy(text);
    setFilteredSuggestionsBuddy(buddySuggestions.filter(suggestion => suggestion.toLowerCase().includes(text.toLowerCase())));
  };

  const handleDebtDestinationChange = (text) => {
    setDestination(text);
    setFilteredSuggestionsDestination(destinationSuggestions.filter(suggestion => suggestion.toLowerCase().includes(text.toLowerCase())));
  };

  useEffect(() => {
    const fetchData = async () => {
      const filteredSuggestionsBuddy = (debts) => {
        let uniqueBuddies = [...new Set(debts.map(debt => debt.debt_buddy))];
        uniqueBuddies = uniqueBuddies.filter(buddy => buddy !== "");
        uniqueBuddies.sort();
        setBuddySuggestions(uniqueBuddies);
        setFilteredSuggestionsBuddy(uniqueBuddies);
      };

      const filteredSuggestionsDestination = (debts) => {
        let uniqueDestinations = [...new Set(debts.map(debt => debt.destination))];
        uniqueDestinations = uniqueDestinations.filter(destination => destination !== "");
        uniqueDestinations.sort();
        setDestinationSuggestions(uniqueDestinations);
        setFilteredSuggestionsDestination(uniqueDestinations);
      };

      const bd = await DatabaseManager.getInstance();
      const debts = await bd.getDebtList();
      filteredSuggestionsBuddy(debts);
      filteredSuggestionsDestination(debts);
    };

    fetchData();
  }, []);



  return (
    <TouchableOpacity style={[styles.container, styles.shadow]} onPress={handleBlur} activeOpacity={1}>
      <Text style={styles.title}>New DEBT</Text>
      {focusedInput === null ? (
        <View style={{ gap: 10, flexDirection: 'column', width: '100%', padding: 20 }}>
          <TouchableOpacity style={[styles.inputContainer, styles.shadow]} onPress={() => handleFocus('debtBuddy')}>
            <Text style={[debtBuddy === '' ? { fontStyle: 'italic', color: 'grey' } : {},]}>
              {debtBuddy === '' ? 'Debt Buddy*' : debtBuddy}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.inputContainer, styles.shadow]} onPress={() => handleFocus('destination')}>
            <Text style={[destination === '' ? { fontStyle: 'italic', color: 'grey' } : {},]}>
              {destination === '' ? 'Destination' : destination}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.inputContainer, styles.shadow]} onPress={() => handleFocus('amount')}>
            <Text style={[!amount ? { fontStyle: 'italic', color: 'grey' } : {},]}>
              {!amount ? 'Amount*' : amount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.inputContainer, styles.shadow]} onPress={() => handleFocus('note')}>
            <Text style={[note === '' ? { fontStyle: 'italic', color: 'grey' } : {},]}>
              {note === '' ? 'Note' : note}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.inputContainer, styles.shadow]} onPress={() => handleFocus('date')}>
            <Text style={[!date ? { fontStyle: 'italic', color: 'grey' } : {},]}>
              {!date ? 'Date' : formatDate(date)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.inputContainer, styles.shadow]} onPress={() => handleFocus('duration')}>
            <Text style={[!duration ? { fontStyle: 'italic', color: 'grey' } : {},]}>
              {!duration ? 'Duration' : duration}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{  flexDirection: 'column', width: '100%', padding: 20,marginBottom: 30}}>
          {focusedInput === 'debtBuddy' && (
            <Animated.View style={[styles.focusedInputContainer, styles.shadow]}>
              <TextInput
                style={styles.focusedInput}
                placeholder="Debt Buddy"
                value={debtBuddy}
                onChangeText={handleDebtBuddyChange}
                onFocus={() => handleFocus('debtBuddy')}
                onBlur={handleBlur}
              />
              {filteredSuggestionsBuddy.length > 0 && (
                <FlatList
                  data={filteredSuggestionsBuddy}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { setDebtBuddy(item); setFilteredSuggestionsBuddy([]); }}>
                      <Text style={styles.suggestion}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </Animated.View>
          )}
          {focusedInput === 'destination' && (
            <Animated.View style={[styles.focusedInputContainer, styles.shadow]}>
              <TextInput
                style={styles.focusedInput}
                placeholder="Destination"
                value={destination}
                onChangeText={handleDebtDestinationChange}
                onFocus={() => handleFocus('destination')}
                onBlur={handleBlur}
              />
              {filteredSuggestionsDestination.length > 0 && (
                <FlatList
                  data={filteredSuggestionsDestination}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { setDestination(item); setFilteredSuggestionsDestination([]); }}>
                      <Text style={styles.suggestion}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </Animated.View>
          )}
          {focusedInput === 'amount' && (
            <Animated.View style={[styles.focusedInputContainer, styles.shadow]}>
              <TextInput
                style={styles.focusedInput}
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                onFocus={() => handleFocus('amount')}
                onBlur={handleBlur}
                autoFocus
              />
            </Animated.View>
          )}
          {focusedInput === 'note' && (
            <Animated.View style={[styles.focusedInputContainer, styles.shadow]}>
              <TextInput
                style={styles.focusedInput}
                placeholder="Note"
                value={note}
                onChangeText={setNote}
                onFocus={() => handleFocus('note')}
                onBlur={handleBlur}
                autoFocus
              />
            </Animated.View>
          )}
          {focusedInput === 'date' && (
            <Animated.View style={[styles.focusedInputContainer, styles.shadow]}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  style={styles.focusedInput}
                  placeholder="Date"
                  value={formatDate(date)}
                  editable={false}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </Animated.View>
          )}
          {focusedInput === 'duration' && (
            <Animated.View style={[styles.focusedInputContainer, styles.shadow]}>
              <TextInput
                style={styles.focusedInput}
                placeholder="Duration"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                onFocus={() => handleFocus('duration')}
                onBlur={handleBlur}
                autoFocus
              />
            </Animated.View>
          )}
        </View>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', gap: 30 }}>
        <TouchableOpacity title="Add Debt" onPress={onSubmit}>
          <Text style={[styles.button, styles.shadow]}>Add Debt</Text>
        </TouchableOpacity>

        <TouchableOpacity title="Cancel" onPress={handleClose}>
          <Text style={[styles.button, styles.shadow]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: "80%",
    height: "80%",
    top: "10%",
    left: "10%",
    backgroundColor: 'white',
    zIndex: 1000,
    padding: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  focusedInputContainer: {
    transform: [{ scale: 1.1 }],
    zIndex: 1,
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingLeft: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  focusedInput: {
    borderColor: 'blue',
    height: 50,
    fontSize: 18,
    width: '100%',
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
    borderRadius: 8,
    width: 90,
    textAlign: 'center',
  },

  suggestion:{
    color : 'grey',
    fontSize : 16,
    fontStyle : 'italic',
    marginBottom : 10
  },
});

export default NewDebtPage;
