import React, {useState} from 'react';
import {StyleSheet, FlatList, View, Text, TouchableOpacity} from 'react-native';
import {blackColor, whiteColor, greenColor, lightPrimaryColor} from '../helpers/Constants';
import {Separator} from '../helpers/Separator';

const defaultCircleSize = 16;
const defaultLineWidth = 2;

export default EventTimeline = ({events}) => {
  const [eventData, setEventData] = useState(events.sort((a, b) => a.time - b.time));
  const [x, setX] = useState(0);
  const [width, setWidth] = useState(0);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity key={index} style={styles.rowContainer}>
        {renderTime(item)}
        {renderEvent(item)}
        {renderCircle()}
      </TouchableOpacity>
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
    const isLast = eventData.slice(-1)[0] === rowData;
    const lineColor = isLast ? whiteColor : greenColor;
    let opStyle = {
      borderColor: lineColor,
      borderLeftWidth: defaultLineWidth,
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
        <View style={styles.detail}>{renderDetail(rowData)}</View>
        <Separator />
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

  const renderCircle = () => {
    let circleStyle = {
      width: x ? defaultCircleSize : 0,
      height: x ? defaultCircleSize : 0,
      borderRadius: defaultCircleSize / 2,
      backgroundColor: lightPrimaryColor,
      left: x - defaultCircleSize / 2 + (defaultLineWidth - 1) / 2,
    };

    let dotStyle = {
      height: defaultCircleSize / 2,
      width: defaultCircleSize / 2,
      borderRadius: defaultCircleSize / 4,
      backgroundColor: whiteColor,
    };
    let innerCircle = <View style={[styles.dot, dotStyle]} />;

    return <View style={[styles.circle, circleStyle]}>{innerCircle}</View>;
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listview}
        data={eventData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
    </View>
  );
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
    color: blackColor,
    overflow: 'hidden',
    fontSize: 18,
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
    backgroundColor: whiteColor,
  },
  title: {
    fontSize: 18,
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
    fontSize: 18,
  },
});
