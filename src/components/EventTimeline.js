import React, {Component} from 'react';
import {StyleSheet, FlatList, View, Text, PanResponder, Animated} from 'react-native';
import {
  whiteColor,
  greenColor,
  lightPrimaryColor,
  grayColor,
  blackColor,
  accentColor,
} from '../helpers/Constants';
import {Separator} from '../helpers/Separator';
import immutableMove from '../helpers/ImmutableList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {database} from '../../App';
import DoubleTap from '../helpers/DoubleTap';
import DatePicker from '../helpers/DatePicker';
import EventModal from '../helpers/EventModal';
import EventAddButton from '../helpers/EventAddButton';
import withObservables from '@nozbe/with-observables';

const defaultCircleSize = 16;
const defaultLineWidth = 2;

class EventTimeline extends Component {
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
    this.reorder = this.reorder.bind(this);
    this.updatePositions = this.updatePositions.bind(this);
    this.toggleDatePickerVisibility = this.toggleDatePickerVisibility.bind(this);
    this.handleEventAdd = this.handleEventAdd.bind(this);
    this.toggleModalVisibility = this.toggleModalVisibility.bind(this);

    this.state = {
      participant: this.props.participant,
      events: this.prepareEvents(this.props.events),
      x: 0,
      width: 0,
      dragging: false,
      draggingIndex: -1,
      showDatePicker: false,
      event: null,
      showEventModal: false,
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
        this.updatePositions();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this.reset();
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  prepareEvents(events) {
    ordered = events.sort((a, b) => a.position - b.position);
    if (ordered.length > 1) {
      for (let i = 0; i < ordered.length - 1; i++) {
        this.assignTextColor(ordered[i], ordered[i + 1]);
      }
      if (ordered[ordered.length - 1].time >= ordered[ordered.length - 2].time) {
        ordered[ordered.length - 1].backgroundColor = blackColor;
      }
    }
    return ordered;
  }

  assignTextColor(eventOne, eventTwo) {
    if (eventOne.time <= eventTwo.time) {
      eventOne.backgroundColor = blackColor;
    } else {
      eventOne.backgroundColor = accentColor;
    }
  }

  updatePositions() {
    const updates = this.reorder(this.state.events);
    database.action(async () => {
      await database.batch(...updates);
    });
  }

  reorder(events) {
    const updates = [];
    events.map((event, index) => {
      if (event.position !== index + 1) {
        updates.push(
          event.prepareUpdate(evt => {
            evt.position = index + 1;
          })
        );
      }
    });
    this.setState({events: this.prepareEvents(events)});
    return updates;
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
        <DoubleTap onDoubleTap={() => this.handleDoubleTap(rowData)}>
          <View style={styles.time}>
            <Text style={{color: rowData.backgroundColor}}>
              {rowData.time.toLocaleDateString()}
            </Text>
          </View>
        </DoubleTap>
      </View>
    );
  }

  handleDoubleTap(event) {
    this.setState({showDatePicker: true, event: event});
  }

  toggleDatePickerVisibility() {
    this.setState({
      showDatePicker: !this.state.showDatePicker,
      event: null,
      events: this.prepareEvents(this.state.events),
    });
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

  handleEventAdd() {
    this.setState({showEventModal: true, event: null});
  }

  toggleModalVisibility(newEvent) {
    this.setState({
      showEventModal: !this.state.showEventModal,
      event: null,
      events: this.prepareEvents([newEvent, ...this.state.events]),
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <EventAddButton handleClick={this.handleEventAdd} />
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
        {this.state.showDatePicker && (
          <DatePicker
            event={this.state.event}
            isVisible={this.state.showDatePicker}
            setVisible={this.toggleDatePickerVisibility}
          />
        )}
        {this.state.showEventModal && (
          <EventModal
            participant={this.state.participant}
            event={this.state.event}
            isVisible={this.state.showEventModal}
            setVisible={this.toggleModalVisibility}
            eventCount={this.state.events.length}
          />
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
    marginRight: 10,
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

export default withObservables(['participant'], ({participant}) => ({
  participant,
  events: participant.events,
}))(EventTimeline);
