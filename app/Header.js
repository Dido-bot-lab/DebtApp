import { View, Text, Button, StyleSheet } from 'react-native';
import { Link, useLocation } from 'react-router-native';

function Header ({HomePage, Name}){
  const location = useLocation();

    return (
        <View style={styles.globalContainer}>

          {
            HomePage ? 
            <View style={[styles.container, {justifyContent: 'center'}]}>
              <Text style={[ styles.title]}>Welcome on DebtPal</Text>
            </View> : 
              <View style={styles.container}>
                <View style={styles.back}>
                  <Link to="/">
                    <Text> {"<"} Back </Text>
                  </Link>
                  <Text style={{ borderLeftColor: 'black',borderLeftWidth: 1, height: '100%' }}></Text>
                </View>
                <Text style={[ styles.title, { position: 'absolute', top : 0, left : '40%' }]}>{Name}</Text>

              </View>

              
          }


          <View style={styles.line}/> 

        </View>
    );
}

const styles = StyleSheet.create({
    globalContainer: {
      flexDirection: 'column',
      width: '100%',
      alignItems :'center'
    },

    line: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        marginVertical: 10,
        width: '75%',
      },

    container : {
      flexDirection : 'row', 
      alignItems :'center',
      width: '100%',
      position: 'relative',
      height: 50,
      paddingLeft: 20,

    },
    back:{
      flexDirection : 'row',
      alignItems :'center',
      gap : 10
    }, 
  
    title: {
      fontSize : 32 ,
      color: 'black',
      fontWeight : 'bold',
      textAlign : 'center',
    }
  });

export default Header ;

/*


import Header from './Header';

function DetailsScreen() {
  const pageName = location.pathname.split('/').pop(); // Récupère le dernier segment de l'URL

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Header HomePage={false} />
      <Text>Details Screen</Text>
      <Text>Page Name: {pageName}</Text>
      
    </View>
  );
}

export default DetailsScreen;
*/