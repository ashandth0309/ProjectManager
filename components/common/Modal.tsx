import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
  GestureResponderEvent,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  position?: 'center' | 'bottom';
  footer?: React.ReactNode;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = 'fade',
  position = 'center',
  footer,
}: ModalProps) {
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (animationType === 'slide' && position === 'bottom') {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (animationType === 'slide' && position === 'bottom') {
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, animationType, position]);

  const getModalSize = () => {
    switch (size) {
      case 'small':
        return { width: SCREEN_WIDTH * 0.8, maxWidth: 400 };
      case 'large':
        return { width: SCREEN_WIDTH * 0.9, maxWidth: 600 };
      case 'fullscreen':
        return { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };
      case 'medium':
      default:
        return { width: SCREEN_WIDTH * 0.85, maxWidth: 500 };
    }
  };

  const getModalPosition = () => {
    if (position === 'bottom') {
      return {
        justifyContent: 'flex-end',
        margin: 0,
      };
    }
    return {
      justifyContent: 'center',
      margin: 20,
    };
  };

  const handleBackdropPress = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget && closeOnBackdropPress) {
      onClose();
    }
  };

  const renderAnimatedContent = () => {
    const modalSize = getModalSize();
    const modalPosition = getModalPosition();

    if (animationType === 'slide' && position === 'bottom') {
      return (
        <Animated.View
          style={[
            styles.modalContent,
            modalSize,
            modalPosition,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderContent()}
        </Animated.View>
      );
    }

    if (animationType === 'fade') {
      return (
        <Animated.View
          style={[
            styles.modalContent,
            modalSize,
            modalPosition,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {renderContent()}
        </Animated.View>
      );
    }

    return (
      <View style={[styles.modalContent, modalSize, modalPosition]}>
        {renderContent()}
      </View>
    );
  };

  const renderContent = () => (
    <>
      {/* Header */}
      {(title || showCloseButton) && (
        <View style={styles.header}>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Body */}
      <View style={[
        styles.body,
        size === 'fullscreen' && styles.bodyFullscreen,
        !footer && styles.bodyWithoutFooter
      ]}>
        {children}
      </View>

      {/* Footer */}
      {footer && (
        <View style={styles.footer}>
          {footer}
        </View>
      )}
    </>
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType === 'slide' && position === 'center' ? 'slide' : 'none'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        {renderAnimatedContent()}
      </TouchableOpacity>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  body: {
    padding: 20,
  },
  bodyFullscreen: {
    flex: 1,
  },
  bodyWithoutFooter: {
    paddingBottom: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});