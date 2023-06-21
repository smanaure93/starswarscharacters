import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootStackParamList} from './App';

type CharacterListProps = NativeStackScreenProps<RootStackParamList, 'List'>;

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export type StarWarsPeople = {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: Gender;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
};

enum Gender {
  Female = 'female',
  Male = 'male',
  NA = 'n/a',
}

const Section = ({children, title}: SectionProps): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

function CharacterList({navigation}: CharacterListProps): JSX.Element {
  const [people, setPeople] = useState([] as StarWarsPeople[]);
  const [previous, setPrevious] = useState(null as string | null);
  const [next, setNext] = useState(null as string | null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setIsLoading] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const getStarWarsPeople = async (
    url = 'https://swapi.dev/api/people',
    searchTerm?: string,
  ) => {
    setIsLoading(true);
    if (searchTerm) {
      url = `https://swapi.dev/api/people/?search=${searchTerm}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    setPeople(data.results);
    setPrevious(data.previous);
    setNext(data.next);
    setIsLoading(false);
  };

  const handleSearch = async () => {
    const url = 'https://swapi.dev/api/people';
    let term = '';
    if (inputValue) {
      term = inputValue;
    }
    await getStarWarsPeople(url, term);
    return;
  };

  const handleCharacterPress = (url: string) => {
    navigation.navigate('Detail', {
      id: +url.split('https://swapi.dev/api/people/')[1].split('/')[0],
    });
  };

  return loading ? (
    <SafeAreaView style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#00ff00" />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Star Wars Characters List">
            This is a list of Star Wars Characters
          </Section>
        </View>
        <View style={styles.searchBar}>
          <View style={styles.searchBarItem}>
            <TextInput
              onChangeText={setInputValue}
              value={inputValue}
              placeholder="Search a character...."
            />
          </View>
          <View style={styles.searchBarItem}>
            <Button title="Search character" onPress={() => handleSearch()} />
          </View>
        </View>
        <View style={styles.listContainer}>
          {people.map((item, index) => (
            <Text
              key={index}
              style={styles.listItem}
              onPress={() => handleCharacterPress(item.url)}>
              {item.name}
            </Text>
          ))}
        </View>
        <View style={[styles.container, styles.horizontal]}>
          {previous && (
            <Text onPress={() => getStarWarsPeople(previous)}>Previous</Text>
          )}
          {next && <Text onPress={() => getStarWarsPeople(next)}>Next</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor: Colors.white,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchBarItem: {
    width: '50%',
  },
});

export default CharacterList;
