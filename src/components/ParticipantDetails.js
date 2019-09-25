import React, {useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import InterviewList from './InterviewList';
import EventTimeline from './EventTimeline';
import {accentColor, primaryColor} from '../helpers/Constants';
import {YellowBox} from 'react-native';

// TODO: Remove when react-native-tab-view fixes issue
YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
]);

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: primaryColor,
  },
  indicator: {
    backgroundColor: accentColor,
  },
});

const ParticipantDetails = props => {
  const routes = [{key: 'interviews', title: 'Interviews'}, {key: 'events', title: 'Events'}];
  const [state, setState] = useState({
    index: 0,
    routes: routes,
  });

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'interviews':
        return <InterviewList interviews={props.interviews} />;
      case 'events':
        return <EventTimeline events={props.events} />;
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar {...props} indicatorStyle={styles.indicator} style={styles.tabbar} />
  );

  return (
    <TabView
      navigationState={state}
      renderScene={renderScene}
      onIndexChange={index =>
        setState({
          index: index,
          routes: routes,
        })
      }
      initialLayout={{width: Dimensions.get('window').width}}
      renderTabBar={renderTabBar}
    />
  );
};

export default ParticipantDetails;
