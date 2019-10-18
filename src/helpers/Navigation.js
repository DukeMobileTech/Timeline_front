import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Root from '../components/Root';
import {whiteColor, primaryColor} from './Constants';
import Timeline from '../components/Timeline';
import {Button} from 'react-native-elements';
import Login from './Login';

const createNavigation = () =>
  createAppContainer(
    createStackNavigator(
      {
        Root: {
          screen: ({navigation}) => <Root navigation={navigation} />,
          navigationOptions: ({navigation}) => ({
            title: 'Participants',
            headerRight: (
              <Button
                icon={{
                  name: 'refresh',
                  size: 30,
                  color: 'white',
                }}
                onPress={() => navigation.navigate('Root', {navigation, refresh: true})}
              />
            ),
          }),
        },
        Timeline: {
          screen: ({navigation}) => (
            <Timeline participant={navigation.state.params.participant} navigation={navigation} />
          ),
          navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.participant.identifier}`,
          }),
        },
        Login: {
          screen: ({navigation}) => <Login navigation={navigation} />,
          navigationOptions: {
            title: 'Login',
          },
        },
      },
      {
        initialRouteName: 'Root',
        defaultNavigationOptions: {
          headerStyle: {
            backgroundColor: primaryColor,
          },
          headerTintColor: whiteColor,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        },
        headerLayoutPreset: 'center',
      }
    )
  );

export default createNavigation;
