import React, {memo, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import {Dimensions, Image} from 'react-native';
import styles from './styles';

const BUTTON_WIDTH = Dimensions.get('window').width / 1.7;
const BUTTON_HEIGHT = 50;
const BUTTON_PADDING = 5;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
let H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SwipeButton = ({
  onToggle = () => {},
  title = 'Swipe me',
  customIcon,
  style = {},
  iconStyle = {},
  textStyle = {},
  startColor = 'red',
  endColor = 'red',
}) => {
  const X = useSharedValue(0);
  const [toggled, setToggled] = useState(false);

  const handleComplete = isToggled => {
    if (isToggled !== toggled) {
      setToggled(isToggled);
      onToggle(isToggled);
    }
  };

  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.completed = toggled;
    },
    onActive: (e, ctx) => {
      let newValue;
      if (ctx.completed) {
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }

      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const InterpolateXInput = [0, H_SWIPE_RANGE];
  const AnimatedStyles = {
    swipeCont: useAnimatedStyle(() => {
      return {};
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        width: H_WAVE_RANGE + X.value,

        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
      };
    }),
    swipeable: useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          X.value,
          [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
          ['white', '#fff'],
        ),
        transform: [{translateX: X.value}],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [1, 0],
          Extrapolate.CLAMP,
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
              Extrapolate.CLAMP,
            ),
          },
        ],
      };
    }),
  };

  return (
    <GestureHandlerRootView>
      <Animated.View
        style={[styles.swipeCont, style, AnimatedStyles.swipeCont]}>
        <AnimatedLinearGradient
          style={[AnimatedStyles.colorWave, styles.colorWave]}
          colors={[startColor, endColor]}
          start={{x: 0.0, y: 0.5}}
          end={{x: 1, y: 0.5}}
        />
        <PanGestureHandler
          onGestureEvent={animatedGestureHandler}
          onEnded={() => {
            X.value = 0;
            setToggled(false);
          }}>
          <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}>
            {customIcon ? (
              customIcon
            ) : (
              <Image
                resizeMode="contain"
                style={[{height: 20, width: 20, tintColor: 'red'}, iconStyle]}
                source={require('./right-arrow.png')}
              />
            )}
          </Animated.View>
        </PanGestureHandler>
        <Animated.Text
          style={[styles.swipeText, textStyle, AnimatedStyles.swipeText]}>
          {title}
        </Animated.Text>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default memo(SwipeButton);
