import {Dimensions, StyleSheet} from 'react-native';

const BUTTON_WIDTH = Dimensions.get('window').width / 1.7;
const BUTTON_HEIGHT = 50;
const BUTTON_PADDING = 5;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const styles = StyleSheet.create({
  swipeCont: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    backgroundColor: 'grey',
    borderRadius: BUTTON_HEIGHT,
    padding: BUTTON_PADDING,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  colorWave: {
    position: 'absolute',
    left: 0,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT,
  },
  swipeable: {
    position: 'absolute',
    left: BUTTON_PADDING,
    height: SWIPEABLE_DIMENSIONS,
    width: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 2,
    color: 'white',
  },
});

export default styles;
