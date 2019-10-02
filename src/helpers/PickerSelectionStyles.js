import {StyleSheet} from 'react-native';
import {grayColor, blackColor} from './Constants';

export default PickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: grayColor,
    borderRadius: 4,
    color: blackColor,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: grayColor,
    borderRadius: 8,
    color: blackColor,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
