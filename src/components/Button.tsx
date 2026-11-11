import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { THEME } from '../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'secondary' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getVariantStyles = (pressed: boolean) => {
    switch (variant) {
      case 'outline':
        return {
          container: {
            backgroundColor: pressed ? '#F8FAFC' : 'transparent',
            borderColor: THEME.colors.border,
            borderWidth: 1.5,
          },
          text: {
            color: THEME.colors.textPrimary,
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: pressed ? '#E2E8F0' : '#F1F5F9',
            borderColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: THEME.colors.textPrimary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: pressed ? '#DC2626' : THEME.colors.error,
            borderColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: '#FFFFFF',
          },
        };
      default: // primary
        return {
          container: {
            backgroundColor: pressed ? THEME.colors.primaryHover : THEME.colors.primary,
            borderColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: '#FFFFFF',
          },
        };
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => {
        const v = getVariantStyles(pressed);
        return [
          styles.button,
          v.container,
          (disabled || isLoading) && styles.disabled,
          style,
        ];
      }}
      accessibilityRole="button"
    >
      {({ pressed }) => {
        const v = getVariantStyles(pressed);
        return (
          <View style={styles.contentRow}>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : THEME.colors.primary}
                style={styles.spinner}
              />
            ) : (
              <>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <Text style={[styles.text, v.text, textStyle]}>{label}</Text>
              </>
            )}
          </View>
        );
      }}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.sm,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  spinner: {
    marginRight: 8,
  },
  text: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});

