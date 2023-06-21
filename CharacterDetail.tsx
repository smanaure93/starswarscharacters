/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootStackParamList} from './App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StarWarsPeople} from './CharacterList';

type CharacterDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'Detail'
>;

type SectionProps = PropsWithChildren<{
  title: string;
}>;

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

function CharacterDetail({
  route,
  navigation,
}: CharacterDetailProps): JSX.Element {
  const [isLoading, setLoading] = useState(true);
  const [character, setCharacter] = useState(null as null | StarWarsPeople);

  const getCharacterData = async () => {
    try {
      const url = `https://swapi.dev/api/people/${route.params.id}`;
      const response = await fetch(url);
      const json = await response.json();
      setCharacter(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCharacterData();
  }, []);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return isLoading ? (
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
          <Section title="Character detail">
            {character?.name}'s Details
          </Section>
        </View>
        {character && (
          <View>
            <View style={[styles.detailContainer, styles.horizontal]}>
              <Text style={[styles.detailItem, styles.detailTitle]}>Name</Text>
              <Text style={[styles.detailItem]}>{character.name}</Text>
              <Text style={[styles.detailItem, styles.detailTitle]}>
                Birth Year
              </Text>
              <Text style={[styles.detailItem]}>{character.birth_year}</Text>
            </View>
            <View style={[styles.detailContainer, styles.horizontal]}>
              <Text style={[styles.detailItem, styles.detailTitle]}>
                Gender
              </Text>
              <Text style={[styles.detailItem]}>{character.gender}</Text>
              <Text style={[styles.detailItem, styles.detailTitle]}>
                Skin color
              </Text>
              <Text style={[styles.detailItem]}>{character.skin_color}</Text>
            </View>
            <View style={[styles.detailContainer, styles.horizontal]}>
              <Text style={[styles.detailItem, styles.detailTitle]}>
                Hair color
              </Text>
              <Text style={[styles.detailItem]}>{character.hair_color}</Text>
              <Text style={[styles.detailItem, styles.detailTitle]}>
                Eye color
              </Text>
              <Text style={[styles.detailItem]}>{character.eye_color}</Text>
            </View>
          </View>
        )}
        <View>
          <Text
            style={styles.goBack}
            onPress={() => {
              navigation.navigate('List');
            }}>
            Go back to List
          </Text>
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
  detailContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.black,
    borderWidth: 2,
  },
  detailItem: {
    fontSize: 18,
  },
  detailTitle: {
    fontWeight: 'bold',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
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
  goBack: {
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor: Colors.white,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
});

export default CharacterDetail;
