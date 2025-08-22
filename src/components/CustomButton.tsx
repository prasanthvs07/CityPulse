import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme/theme';
import { DesignConstants } from '../theme/designConstants';

type ButtonType = 'primary' | 'secondary' | 'tertiary';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  type?: ButtonType;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  type = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  const getButtonStyles = () => {
    switch (type) {
      case 'secondary':
        return [styles.button, styles.secondaryButton];
      case 'tertiary':
        return [styles.tertiaryButton];
      default:
        return [styles.button, styles.primaryButton];
    }
  };

  const getTextStyles = () => {
    switch (type) {
      case 'secondary':
        return [styles.buttonText, styles.secondaryText];
      case 'tertiary':
        return [styles.tertiaryText];
      default:
        return [styles.buttonText, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyles(), style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base button styles for primary and secondary types
  button: {
    width: '100%',
    height: DesignConstants.BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing.s,
    marginTop: theme.spacing.m,
    overflow: 'hidden',
  },
  
  // Primary button specific styles
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  
  // Secondary button specific styles
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },

  // Link button specific styles
  tertiaryButton: {
    paddingVertical: theme.spacing.m,
    width: '100%',
    alignItems: 'center',
  },

  // Base text styles for primary and secondary types
  buttonText: {
    fontSize: theme.typography.fontStyles.body.fontSize,
    fontWeight: theme.typography.fontStyles.body.fontWeight,
  },

  // Primary button text styles
  primaryText: {
    color: theme.colors.surface,
  },
  
  // Secondary button text styles
  secondaryText: {
    color: theme.colors.primary,
  },

  // Link button text styles
  tertiaryText: {
    color: theme.colors.tertiary,
    fontSize: theme.typography.fontStyles.light.fontSize,
    textDecorationLine: 'underline',
  },

  // Disabled state styles
  disabledButton: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.border,
  },
});

export default CustomButton;
