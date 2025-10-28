import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

export type InputVariant = 'default' | 'outline' | 'filled';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export default function InputField({
  label,
  error,
  variant = 'default',
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...textInputProps
}: InputFieldProps) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.containerOutline;
      case 'filled':
        return styles.containerFilled;
      case 'default':
      default:
        return styles.containerDefault;
    }
  };

  const getInputStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.inputOutline;
      case 'filled':
        return styles.inputFilled;
      case 'default':
      default:
        return styles.inputDefault;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      
      <View style={[getContainerStyle(), error ? styles.containerError : null]}>
        {leftIcon && (
          <View style={styles.leftIcon}>{leftIcon}</View>
        )}
        
        <TextInput
          style={[
            styles.input,
            getInputStyle(),
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            textInputProps.multiline ? styles.inputMultiline : null,
            inputStyle,
          ]}
          placeholderTextColor="#999"
          {...textInputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, errorStyle]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  containerDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  containerOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  containerFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 0,
  },
  containerError: {
    borderColor: '#dc3545',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputDefault: {
    backgroundColor: 'transparent',
  },
  inputOutline: {
    backgroundColor: 'transparent',
  },
  inputFilled: {
    backgroundColor: 'transparent',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
  error: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 4,
    marginLeft: 4,
  },
});