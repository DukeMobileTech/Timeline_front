import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import ParticipantList from '../components/ParticipantList';
import ParticipantDetails from '../components/ParticipantDetails';
import {whiteColor, primaryColor} from './Constants';

const createNavigation = props =>
  createAppContainer(
    createStackNavigator(
      {
        Root: {
          screen: ({navigation}) => {
            return <ParticipantList navigation={navigation} />;
          },
          navigationOptions: {
            title: 'Participants',
          },
        },
        Participant: {
          screen: ({navigation}) => (
            <ParticipantDetails
              participant={navigation.state.params.participant}
              interviews={navigation.state.params.interviews}
              events={navigation.state.params.events}
              navigation={navigation}
            />
          ),
          navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.participant.newId}`,
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
