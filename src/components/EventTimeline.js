import React, {useState} from 'react';
import {StyleSheet, FlatList, View, Text, TouchableOpacity} from 'react-native';

const defaultCircleSize = 16;
const defaultCircleColor = '#007AFF';
const defaultLineWidth = 2;
const defaultLineColor = '#007AFF';
const defaultTimeTextColor = 'black';
const defaultDotColor = 'white';
const defaultInnerCircle = 'none';

export default EventTimeline = ({events}) => {
  events = events.sort((a, b) => a.time - b.time);

  const [x, setX] = useState(0);
  const [width, setWidth] = useState(0);

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <View style={styles.rowContainer}>
          {renderTime(item)}
          {renderEvent(item)}
          {renderCircle(item)}
        </View>
      </View>
    );
  };

  const renderTime = rowData => {
    return (
      <View
        style={{
          alignItems: 'flex-end',
        }}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{rowData.time.toLocaleDateString()}</Text>
        </View>
      </View>
    );
  };

  const renderEvent = rowData => {
    const lineWidth = rowData.lineWidth ? rowData.lineWidth : defaultLineWidth;
    const isLast = events.slice(-1)[0] === rowData;
    const lineColor = isLast ? 'rgba(0,0,0,0)' : rowData.lineColor;
    let opStyle = {
      borderColor: lineColor,
      borderLeftWidth: lineWidth,
      borderRightWidth: 0,
      marginLeft: 20,
      paddingLeft: 20,
    };

    return (
      <View
        style={[styles.details, opStyle]}
        onLayout={evt => {
          if (!x && !width) {
            const {x, width} = evt.nativeEvent.layout;
            setX(x);
            setWidth(width);
          }
        }}>
        <TouchableOpacity onPress={() => null}>
          <View style={styles.detail}>{renderDetail(rowData)}</View>
          {renderSeparator()}
        </TouchableOpacity>
      </View>
    );
  };

  const renderDetail = rowData => {
    let title = rowData.description ? (
      <View>
        <Text style={styles.title}>{rowData.title}</Text>
        <Text style={styles.description}>{rowData.description}</Text>
      </View>
    ) : (
      <Text style={styles.title}>{rowData.title}</Text>
    );
    return <View style={styles.container}>{title}</View>;
  };

  const renderCircle = rowData => {
    let circleSize = rowData.circleSize ? rowData.circleSize : defaultCircleSize;
    let circleColor = rowData.circleColor ? rowData.circleColor : defaultCircleColor;
    let lineWidth = rowData.lineWidth ? rowData.lineWidth : defaultLineWidth;

    let circleStyle = {
      width: x ? circleSize : 0,
      height: x ? circleSize : 0,
      borderRadius: circleSize / 2,
      backgroundColor: circleColor,
      left: x - circleSize / 2 + (lineWidth - 1) / 2,
    };

    let dotStyle = {
      height: circleSize / 2,
      width: circleSize / 2,
      borderRadius: circleSize / 4,
      backgroundColor: rowData.dotColor ? rowData.dotColor : defaultDotColor,
    };
    let innerCircle = <View style={[styles.dot, dotStyle]} />;

    return <View style={[styles.circle, circleStyle]}>{innerCircle}</View>;
  };

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listview}
        data={events}
        renderItem={renderItem}
        keyExtractor={(item, index) => index + ''}
      />
    </View>
  );
};

EventTimeline.defaultProps = {
  circleSize: defaultCircleSize,
  circleColor: defaultCircleColor,
  lineWidth: defaultLineWidth,
  lineColor: defaultLineColor,
  innerCircle: defaultInnerCircle,
  columnFormat: 'single-column-left',
  separator: false,
  showTime: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
  },
  listview: {
    flex: 1,
    marginTop: 10,
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 15,
    backgroundColor: '#007AFF',
    height: 30,
    justifyContent: 'center',
  },
  sectionHeaderText: {
    color: '#FFF',
    fontSize: 18,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  timeContainer: {
    width: 100,
  },
  time: {
    textAlign: 'right',
    color: defaultTimeTextColor,
    overflow: 'hidden',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: defaultDotColor,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    borderLeftWidth: defaultLineWidth,
    flexDirection: 'column',
    flex: 1,
  },
  detail: {paddingTop: 10, paddingBottom: 10},
  description: {
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#aaa',
    marginTop: 10,
    marginBottom: 10,
  },
});
