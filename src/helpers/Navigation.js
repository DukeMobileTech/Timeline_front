import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Root from '../components/Root';
import {whiteColor, primaryColor} from './Constants';
import Timeline from '../components/Timeline';

const createNavigation = props =>
  createAppContainer(
    createStackNavigator(
      {
        Root: {
          screen: ({navigation}) => <Root navigation={navigation} />,
          navigationOptions: {
            title: 'Participants',
          },
        },
        Timeline: {
          screen: ({navigation}) => (
            <Timeline participant={navigation.state.params.participant} navigation={navigation} />
          ),
          navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.participant.identifier}`,
          }),
        },
      },
      {
        initialRouteName: 'Root',
        initialRouteParams: props,
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
