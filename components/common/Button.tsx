import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'danger' 
  | 'success' 
  | 'warning';

export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '#6c757d';
    
    switch (variant) {
      case 'primary':
        return '#007bff';
      case 'secondary':
        return '#6c757d';
      case 'outline':
        return 'transparent';
      case 'danger':
        return '#dc3545';
      case 'success':
        return '#28a745';
      case 'warning':
        return '#ffc107';
      default:
        return '#007bff';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#ffffff';
    if (variant === 'outline') {
      switch (variant) {
        case 'outline':
          return '#007bff';
        case 'danger':
          return '#dc3545';
        case 'success':
          return '#28a745';
        case 'warning':
          return '#ffc107';
        default:
          return '#007bff';
      }
    }
    return '#ffffff';
  };

  const getBorderColor = () => {
    if (disabled) return '#6c757d';
    
    switch (variant) {
      case 'outline':
        return '#007bff';
      case 'danger':
        return '#dc3545';
      case 'success':
        return '#28a745';
      case 'warning':
        return '#ffc107';
      default:
        return 'transparent';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
          fontSize: 14,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
        };
      case 'medium':
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          fontSize: 16,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          width: fullWidth ? '100%' : undefined,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: sizeStyles.fontSize,
                marginLeft: leftIcon ? 8 : 0,
                marginRight: rightIcon ? 8 : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 44,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});