import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { Theme } from './types';

interface FormInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  maxLength?: number;
  keyboardType?: 'default' | 'numeric';
  theme: Theme;
  testID?: string;
}

export const FormInput = memo(
  ({
    label = '',
    error = '',
    containerStyle,
    placeholder = '',
    value,
    onChangeText,
    onBlur,
    maxLength,
    keyboardType = 'default',
    theme,
    testID,
  }: FormInputProps) => {
    const handleChange = useCallback(
      (text: string) => {
        onChangeText(text);
      },
      [onChangeText]
    );

    const handleBlur = useCallback(() => {
      onBlur();
    }, [onBlur]);

    const styles = useMemo(
      () =>
        StyleSheet.create({
          container: {
            marginBottom: 16,
          },
          label: {
            fontSize: 14,
            marginBottom: 8,
            color: theme.colors.text,
          },
          input: {
            borderWidth: 1,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: theme.colors.text,
          },
          error: {
            color: theme.colors.error,
            fontSize: 12,
            marginTop: 4,
          },
        }),
      [theme, error]
    );

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.border}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="done"
          testID={testID}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
