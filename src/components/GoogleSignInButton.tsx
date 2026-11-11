import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { THEME } from '../constants/theme';

const googleLogoSvg = require('../../assets/google-logo.svg');

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  isLoading = false,
  disabled = false,
  label = 'Sign in with Google',
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        (disabled || isLoading) && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="small" color={THEME.colors.primary} style={styles.spinner} />
        ) : (
          <View style={styles.googleIconWrapper}>
            <Image
              source={googleLogoSvg}
              style={styles.googleLogoImage}
              resizeMode="contain"
            />
          </View>
        )}
        <Text style={styles.buttonText}>
          {isLoading ? 'Connecting to Google...' : label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.colors.googleBtnBg,
    borderColor: THEME.colors.googleBtnBorder,
    borderWidth: 1.5,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...THEME.shadows.sm,
  },
  pressed: {
    backgroundColor: '#F8FAFC',
    borderColor: '#C7D2FE',
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 12,
  },
  googleIconWrapper: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogoImage: {
    width: 20,
    height: 20,
  },
  buttonText: {
    fontFamily: THEME.typography.fontFamily.sans,
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.googleBtnText,
  },
});


