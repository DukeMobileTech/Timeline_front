import React, {Component} from 'react';
import {StyleSheet, FlatList, View, Text, PanResponder, Animated} from 'react-native';
import {whiteColor, greenColor, lightPrimaryColor, grayColor} from '../helpers/Constants';
import {Separator} from '../helpers/Separator';
import immutableMove from '../helpers/ImmutableList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const defaultCircleSize = 16;
const defaultLineWidth = 2;

export default class EventTimeline extends Component {
  point = new Animated.ValueXY();
  currentY = 0;
  scrollOffset = 0;
  flatlistTopOffset = 0;
  rowHeight = 0;
  currentIndex = -1;
  active = false;

  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);
    this._renderTime = this._renderTime.bind(this);
    this._renderDetail = this._renderDetail.bind(this);
    this._renderCircle = this._renderCircle.bind(this);
    this._renderEvent = this._renderEvent.bind(this);
    this.yToIndex = this.yToIndex.bind(this);
    this.animateList = this.animateList.bind(this);
    this.reset = this.reset.bind(this);

    this.state = {
      events: this.props.events.sort((a, b) => a.time - b.time),
      x: 0,
      width: 0,
      dragging: false,
      draggingIndex: -1,
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.currentIndex = this.yToIndex(gestureState.y0);
        this.currentY = gestureState.y0;
        Animated.event([{y: this.point.y}])({
          y: gestureState.y0 - this.rowHeight / 2,
        });
        this.active = true;
        this.setState({dragging: true, draggingIndex: this.currentIndex}, () => {
          this.animateList();
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        this.currentY = gestureState.moveY;
        Animated.event([{y: this.point.y}])({y: gestureState.moveY});
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        this.reset();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this.reset();
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  yToIndex(y) {
    const value = Math.floor((this.scrollOffset + y - this.flatlistTopOffset) / this.rowHeight) - 1;
    if (value < 0) {
      return 0;
    }
    if (value > this.state.events.length - 1) {
      return this.state.events.length - 1;
    }
    return value;
  }

  animateList() {
    if (!this.active) return;

    requestAnimationFrame(() => {
      const newIdx = this.yToIndex(this.currentY);
      if (this.currentIndex !== newIdx) {
        this.setState({
          events: immutableMove(this.state.events, this.currentIndex, newIdx),
          draggingIndex: newIdx,
        });
        this.currentIndex = newIdx;
      }
      this.animateList();
    });
  }

  reset() {
    this.active = false;
    this.setState({dragging: false, draggingIndex: -1});
  }

  _renderItem({item, index}, noPanResponder = false) {
    return (
      <View
        onLayout={e => {
          this.rowHeight = e.nativeEvent.layout.height;
        }}
        key={index}
        style={styles.rowContainer}>
        {this._renderTime(item, index, noPanResponder)}
        {this._renderEvent(item)}
        {this._renderCircle()}
      </View>
    );
  }

  _renderTime(rowData, index, noPanResponder) {
    return (
      <View
        style={[
          styles.timeContainer,
          {
            opacity: this.state.draggingIndex === index ? 0 : 1,
          },
        ]}>
        <View {...(noPanResponder ? {} : this._panResponder.panHandlers)}>
          <MaterialIcons name="drag-handle" size={28} />
        </View>
        <View style={styles.time}>
          <Text>{rowData.time.toLocaleDateString()}</Text>
        </View>
      </View>
    );
  }

  _renderEvent(rowData) {
    const isLast = this.state.events.slice(-1)[0] === rowData;
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
          if (!this.state.x && !this.state.width) {
            const {x, width} = evt.nativeEvent.layout;
            this.setState({x, width});
          }
        }}>
        <View style={styles.detail}>{this._renderDetail(rowData)}</View>
        <Separator />
      </View>
    );
  }

  _renderDetail(rowData) {
    let title = rowData.description ? (
      <View>
        <Text style={styles.title}>{rowData.title}</Text>
        <Text style={styles.description}>{rowData.description}</Text>
      </View>
    ) : (
      <Text style={styles.title}>{rowData.title}</Text>
    );
    return <View style={styles.container}>{title}</View>;
  }

  _renderCircle() {
    let circleStyle = {
      width: defaultCircleSize,
      height: defaultCircleSize,
      borderRadius: defaultCircleSize / 2,
      backgroundColor: lightPrimaryColor,
      left: this.state.x - defaultCircleSize / 2 + (defaultLineWidth - 1) / 2,
    };

    let dotStyle = {
      height: defaultCircleSize / 2,
      width: defaultCircleSize / 2,
      borderRadius: defaultCircleSize / 4,
      backgroundColor: whiteColor,
    };
    let innerCircle = <View style={dotStyle} />;
    return <View style={[styles.circle, circleStyle]}>{innerCircle}</View>;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.dragging && (
          <Animated.View
            style={{
              position: 'absolute',
              backgroundColor: grayColor,
              zIndex: 2,
              width: '100%',
              top: this.point.getLayout().top,
            }}>
            {this._renderItem({item: this.state.events[this.state.draggingIndex], index: -1}, true)}
          </Animated.View>
        )}
        <FlatList
          style={styles.listview}
          data={this.state.events}
          renderItem={this._renderItem}
          extraData={this.state}
          keyExtractor={(item, index) => `${index}`}
          scrollEnabled={!this.state.dragging}
          onScroll={e => {
            this.scrollOffset = e.nativeEvent.contentOffset.y;
          }}
          onLayout={e => {
            this.flatlistTopOffset = e.nativeEvent.layout.y;
          }}
          scrollEventThrottle={16}
        />
      </View>
    );
  }
}

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
    width: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
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
