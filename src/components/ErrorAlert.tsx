import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface ErrorAlertProps {
  message: string | null;
  onDismiss?: () => void;
  title?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onDismiss,
  title = 'Access Denied',
}) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconColumn}>
        <View style={styles.iconCircle}>
          <Ionicons name="alert-circle-outline" size={17} color={THEME.colors.errorText} />
        </View>
      </View>
      
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          style={({ pressed }) => [styles.dismissButton, pressed && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel="Dismiss error"
        >
          <Text style={styles.dismissText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.errorBg,
    borderColor: THEME.colors.errorBorder,
    borderWidth: 1.5,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
    ...THEME.shadows.sm,
  },
  iconColumn: {
    marginRight: THEME.spacing.sm,
    marginTop: 2,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.errorText,
    marginBottom: 2,
  },
  message: {
    fontSize: THEME.typography.fontSize.sm,
    color: '#7F1D1D',
    lineHeight: 20,
  },
  dismissButton: {
    padding: 6,
    marginLeft: THEME.spacing.xs,
  },
  dismissText: {
    fontSize: 14,
    color: THEME.colors.errorText,
    fontWeight: 'bold',
  },
});

