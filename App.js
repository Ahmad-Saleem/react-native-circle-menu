import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';

import CircleMenu from './CircleMenu';

export default class App extends Component {
  items = [
    {
      name: 'md-home',
      color: '#298cff',
    },
    {
      name: 'md-search',
      color: '#30a400',
    },
    {
      name: 'md-time',
      color: '#ff4b32',
    },
    {
      name: 'md-settings',
      color: '#8a39ff',
    },
    {
      name: 'md-navigate',
      color: '#ff6a00',
    },

  ]

  onPress = (index) => {
    console.warn(`${this.items[index].name} icon pressed!`);
  }

  render() {
    return (
      <View style={styles.container}>
        <CircleMenu buttonColor="rgba(231,76,60,1)" items={this.items} onPress={this.onPress} radius={150}>
          {/* <CircleMenu.Item buttonColor='#9b59b6' onPress={() => console.log("notes tapped!")}>
            <Icon name="android-create" style={styles.actionButtonIcon} />
          </CircleMenu.Item> */}
        </CircleMenu>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1329',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  }
});
