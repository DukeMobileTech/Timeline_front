import React, {useState, useEffect} from 'react';
import {Dimensions, View, Text, StyleSheet, ScrollView} from 'react-native';
import withObservables from '@nozbe/with-observables';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import {
  eventValues,
  eventColors,
  eventValuesInverse,
  redColor,
  greenColor,
  months,
} from '../helpers/Constants';

import Svg, {Path} from 'react-native-svg';
import ToggleSwitch from 'toggle-switch-react-native';

const allYValues = Array.from(eventValues.values());

const createScaleX = (events, width) => {
  return scale
    .scaleTime()
    .domain([events[0].start, events[events.length - 1].end])
    .range([0, width]);
};

const createScaleY = height => {
  return scale
    .scalePoint()
    .domain(allYValues)
    .range([0, height]);
};

const getEvents = events => {
  const allEvents = [];
  events.forEach(event => {
    const value = eventValues.get(event.title);
    allEvents.push([
      {
        time: event.start,
        value: value,
        title: event.title,
        description: event.description,
      },
      {
        time: event.end,
        value: value,
        title: event.title,
        description: event.description,
      },
    ]);
  });
  return allEvents;
};

const differenceInMonths = (date2, date1) => {
  var difference = (date2.getTime() - date1.getTime()) / 1000;
  difference /= 60 * 60 * 24 * 7 * 4;
  return Math.abs(Math.round(difference));
};

const getWidth = () => {
  return Dimensions.get('window').width * 0.8;
};

const Timeline = props => {
  const oEvents = props.events.sort((a, b) => a.start - b.start);
  const events = getEvents(oEvents);
  const monthsCount = differenceInMonths(oEvents[oEvents.length - 1].end, oEvents[0].start);
  const height = Math.round(Dimensions.get('window').height * 0.55);
  const [width, setWidth] = useState(getWidth());
  const [expand, setExpand] = useState(false);
  const [description, setDescription] = useState('Press on an event to view');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (expand) {
      setWidth(Math.round(20 * monthsCount));
    } else {
      setWidth(getWidth());
    }
  }, [expand]);

  const scaleX = createScaleX(oEvents, width);
  const scaleY = createScaleY(height);

  const lineShape = shape
    .line()
    .x(d => scaleX(d.time))
    .y(d => scaleY(d.value));

  const toggleLabel = expand ? 'Shrink View' : 'Expand View';

  const onPressEvent = event => {
    setDescription(event.description);
    setYear(event.time.getFullYear());
  };

  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        <View key={'yAxis'} height={height} style={styles.leftContainer}>
          {allYValues.map((value, index) => {
            return (
              <View key={index}>
                <Text style={styles.label}>{eventValuesInverse.get(value)}</Text>
              </View>
            );
          })}
        </View>
        <ScrollView horizontal>
          <View style={styles.rightContainer} width={width}>
            <View style={{padding: 10}}>
              <Svg height={height}>
                {events.map((group, index) => {
                  const path = lineShape(group);
                  const color = eventColors.get(group[0].value);
                  return (
                    <Path
                      key={index}
                      d={path}
                      stroke={color}
                      strokeWidth={25}
                      onPress={() => onPressEvent(group[0])}
                    />
                  );
                })}
              </Svg>
            </View>
            <View key={'xAxis'} style={styles.xAxisContainer}>
              {scaleX.ticks().map((tick, index) => {
                return (
                  <View key={index} style={styles.xTickContainer}>
                    <Text style={styles.label}>
                      {`${months[tick.getMonth()]} ${tick.getFullYear()}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.labelsContainer}>
        <ToggleSwitch
          isOn={expand}
          onColor={redColor}
          offColor={greenColor}
          label={toggleLabel}
          labelStyle={styles.label}
          size="large"
          onToggle={() => setExpand(!expand)}
        />
        <View>
          <Text style={styles.label}>{description}</Text>
          <Text style={styles.label}>{year}</Text>
        </View>
      </View>
    </View>
  );
};

export default withObservables(['participant'], ({participant}) => ({
  participant,
  events: participant.events,
}))(Timeline);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  graphContainer: {
    flexDirection: 'row',
    height: '75%',
  },
  labelsContainer: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  leftContainer: {
    justifyContent: 'space-between',
    padding: 5,
    width: '20%',
  },
  rightContainer: {},
  xAxisContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  xTickContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
