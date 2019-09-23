import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import InterviewList from './InterviewList';
import EventTimeline from './EventTimeline';
import {accentColor, primaryColor} from '../helpers/Constants';

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: primaryColor,
  },
  indicator: {
    backgroundColor: accentColor,
  },
});

class ParticipantDetails extends React.Component {
  state = {
    index: 0,
    routes: [{key: 'interviews', title: 'Interviews'}, {key: 'events', title: 'Events'}],
  };

  renderScene = ({route}) => {
    switch (route.key) {
      case 'interviews':
        return <InterviewList interviews={this.props.interviews} />;
      case 'events':
        return <EventTimeline events={this.props.events} />;
      default:
        return null;
    }
  };

  renderTabBar = props => (
    <TabBar {...props} indicatorStyle={styles.indicator} style={styles.tabbar} />
  );

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onIndexChange={index => this.setState({index})}
        initialLayout={{width: Dimensions.get('window').width}}
        renderTabBar={this.renderTabBar}
      />
    );
  }
}

export default ParticipantDetails;
