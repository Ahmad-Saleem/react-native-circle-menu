import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';

import TouchableIcon from './TouchableIcon';

export default class ActionButtonItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      startDeg: (this.props.angle * 180 / Math.PI) + 90,
    }

    this.animation = new Animated.Value(0);
    this.radius = (this.props.radius / 2 + this.props.size / 2);

    this.animation.addListener(({ value }) => {
      this.showLine(value);
      this.move(value);
    });
  }

  move(value) {
    const angle = this.props.angle + Math.PI * 2 * value;
    this.btn.setNativeProps({
      style: {
        transform: [
          {
            translateY: this.radius * Math.sin(angle),
          },
          {
            translateX: this.radius * Math.cos(angle),
          },
        ]
      }
    });
  }

  showLine(value) {
    const percent = value * 99;
    let leftTransformerDegree = '0deg';
    let rightTransformerDegree = '0deg';
    if (percent >= 50) {
      rightTransformerDegree = '180deg';
      leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
    } else {
      rightTransformerDegree = percent * 3.6 + 'deg';
    }

    const radius = this.props.radius + this.props.size;

    let commonStyle = [styles.loader, {
      width: radius,
      height: radius * 2,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: this.props.buttonColor,
    }];

    this.rightPart.setNativeProps({
      style: [styles.loader, commonStyle, {
        left: -radius,
        transform: [{
          translateX: radius / 2,
        }, {
          rotate: rightTransformerDegree,
        }, {
          translateX: -radius / 2,
        }],
      }]
    });

    this.leftPart.setNativeProps({
      style: [styles.loader, commonStyle, {
        left: radius,
        transform: [{
          translateX: -radius / 2,
        }, {
          rotate: leftTransformerDegree,
        }, {
          translateX: radius / 2,
        }],
      }]
    });
  }

  renderCircle() {
    const radius = this.props.radius + this.props.size;
    return (
      <View style={{
        display: this.state.isActive ? 'flex' : 'none',
        position: 'absolute',
        top: -this.props.radius - this.props.size / 2,
        width: radius * 2,
        height: radius * 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View
          setNativeProps={true}
          pointerEvents="box-none"
          style={[styles.circle, {
            width: radius + this.props.size,
            height: radius + this.props.size,
            borderRadius: (radius + this.props.size) / 2,
            transform: [{
              rotate: this.state.startDeg + 'deg',
            }],
            backgroundColor: 'transparent',
          }]}
        >
          <View setNativeProps={true} style={[styles.leftWrap, {
            width: radius,
            height: radius * 2,
            left: -this.props.size,
          }]}>
            <View
              setNativeProps={true}
              ref={(ref) => this.leftPart = ref}
              style={[styles.loader,{
                left: radius,
                width: radius,
                height: radius * 2,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                backgroundColor: this.props.buttonColor,
              }]}
            />
          </View>
          <View setNativeProps={true} style={[styles.leftWrap, {
            left: radius - this.props.size,
            width: radius,
            height: radius * 2,
          }]}>
            <View
              setNativeProps={true}
              ref={(ref) => this.rightPart = ref}
              style={[styles.loader, {
                left: -radius,
                width: radius,
                height: radius * 2,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: this.props.buttonColor,
              }]}
            />
          </View>
          <View style={[styles.innerCircle, {
            borderRadius: radius,
            backgroundColor: this.props.bgColor,
            zIndex: 1,
            ...Platform.select({
              ios: {
                width: radius - this.props.size,
                height: radius - this.props.size,
              },
              android: {
                width: radius * 2,
                height: radius * 2,
                borderWidth: radius,
                borderColor: 'transparent',
              },
            }),
          }]}>
          </View>
        </View>
      </View>
    );
  }

  startAnimation() {
    this.setState({
      isActive: true,
    });
    this.wraper.setNativeProps({
      style: [this.props.style, {
        zIndex: 100,
      }],
    });
    this.animation.setValue(0);
    Animated.timing(
      this.animation,
      {
        duration: this.props.duration,
        toValue: 1,
      }
    ).start(() => {
      this.props.onPress();
    });
  }

  render() {
    return (
      <View style={this.props.style} ref={(ref) => this.wraper = ref}>
        {this.renderCircle()}
        <Animated.View style={{
          width: this.props.size,
          height: this.props.size,
          borderRadius: this.props.size / 2,
          backgroundColor: this.props.buttonColor,
          position: 'absolute', 
          transform: [
            {
              translateY: this.radius * Math.sin(this.props.angle),
            },
            {
              translateX: this.radius * Math.cos(this.props.angle),
            },
            {
              scale: this.props.anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1.1, 1],
              })
            }, 
          ]
        }} />
        <Animated.View
          ref={(ref) => this.btn = ref}
          style={[{
              opacity: this.props.anim,
              width: this.props.size,
              height: this.props.size,
              zIndex: 0,
              transform: [
                {
                  translateY: this.radius * Math.sin(this.props.angle),
                },
                {
                  translateX: this.radius * Math.cos(this.props.angle),
                },
                {
                  scale: this.props.anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.1, 1],
                  })
                }, 
              ]
            }]}
        >
          <TouchableOpacity
            style={{flex:1}}
            activeOpacity={this.props.activeOpacity || 0.85}
            onPress={this.startAnimation.bind(this)}>
            <View
              style={[styles.actionButton,{
                  width: this.props.size,
                  height: this.props.size,
                  borderRadius: this.props.size / 2,
                  backgroundColor: this.props.buttonColor,
                }]}
            >
              <TouchableIcon
                icon={this.props.icon} color="white" backgroundColor={this.props.buttonColor} buttonSize={this.props.size}
                afterAnimation={this.startAnimation.bind(this)}
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
        </View>
    );
  }

}

ActionButtonItem.propTypes = {
  angle: PropTypes.number,
  radius: PropTypes.number,
  buttonColor: PropTypes.string,
  style: View.propTypes.style,
  onPress: PropTypes.func,
  afterPress: PropTypes.func,
  duration: PropTypes.number,
  size: PropTypes.number,
  icon: PropTypes.string.isRequired,
};

ActionButtonItem.defaultProps = {
  duration: 500,
  onPress: () => { },
  afterPress: () => { },
};

const styles = StyleSheet.create({
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 2,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
    backgroundColor: 'red',
    position: 'absolute',
  },
  circle: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E1329',
    position: 'relative',
  },
  leftWrap: {
    overflow: 'hidden',
    position: 'absolute',
  },
  rightWrap: {
    position: 'absolute',
  },
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 1000,
  },
  innerCircle: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'column',
    padding: 0,
    alignItems: 'center',
  },
});