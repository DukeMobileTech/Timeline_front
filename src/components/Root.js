import React, {useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {SearchBar} from 'react-native-elements';
import Participants from './Participants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Root = ({navigation}) => {
  const [search, setSearch] = useState('');

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
