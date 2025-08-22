import React from 'react';
import { StyleSheet, TextInput as RNTextInput, View, Text, I18nManager } from 'react-native';
import { theme } from '../theme/theme';
import { DesignConstants } from '../theme/designConstants';

interface CustomTextInputProps {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  errorMessage,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
}) => {
  const isRTL = I18nManager.isRTL;
  const textAlignmentStyle = {
    textAlign: isRTL ? 'right' : 'left',
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, textAlignmentStyle]}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          textAlignmentStyle,
          {
            borderColor: errorMessage ? theme.colors.error : theme.colors.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
      />
      {errorMessage && (
        <Text style={[styles.errorLabel, textAlignmentStyle]}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.m,
  },
  label: {
    ...theme.typography.fontStyles.body,
    marginBottom: theme.spacing.xs,
  },
  input: {
    height: DesignConstants.INPUT_HEIGHT,
    backgroundColor: theme.colors.surface,
    borderWidth: DesignConstants.BORDER_WIDTH,
    borderRadius: DesignConstants.BORDER_RADIUS,
    paddingHorizontal: theme.spacing.s,
    ...theme.typography.fontStyles.body,
    color: theme.colors.text,
  },
  errorLabel: {
    ...theme.typography.fontStyles.light,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default CustomTextInput;
