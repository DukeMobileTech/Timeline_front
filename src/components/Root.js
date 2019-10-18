import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {SearchBar} from 'react-native-elements';
import Participants from './Participants';
import {AccessTokenContext} from '../context/AccessTokenContext';
import {readAccessToken} from '../helpers/Keychain';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Root = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [token, setToken] = useContext(AccessTokenContext);

  useEffect(() => {
    const accessKeychain = () => {
      readAccessToken().then(response => {
        setToken(response);
      });
    };
    accessKeychain();
  }, []);

  const updateSearch = term => {
    setSearch(term);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Search participants here..."
        onChangeText={updateSearch}
        value={search}
        lightTheme
        round
      />
      <Participants navigation={navigation} search={search} />
    </SafeAreaView>
  );
};

export default Root;
