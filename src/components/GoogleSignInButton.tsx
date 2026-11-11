import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { THEME } from '../constants/theme';

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
            <View style={styles.googleGContainer}>
              {/* Google 4-color 'G' icon badge */}
              <View style={styles.gQuarterBlue} />
              <View style={styles.gQuarterRed} />
              <View style={styles.gQuarterYellow} />
              <View style={styles.gQuarterGreen} />
              <View style={styles.gInnerHole}>
                <Text style={styles.gLetter}>G</Text>
              </View>
            </View>
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
  },
  googleGContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
  },
  gQuarterBlue: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 11,
    height: 11,
    backgroundColor: '#4285F4',
  },
  gQuarterRed: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 11,
    height: 11,
    backgroundColor: '#EA4335',
  },
  gQuarterYellow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 11,
    height: 11,
    backgroundColor: '#FBBC05',
  },
  gQuarterGreen: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    backgroundColor: '#34A853',
  },
  gInnerHole: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  gLetter: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4285F4',
  },
  buttonText: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.googleBtnText,
  },
});

