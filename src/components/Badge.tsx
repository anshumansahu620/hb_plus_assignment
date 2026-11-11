import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'danger' | 'primary' | 'neutral' | 'admin';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return {
          bg: THEME.colors.successBg,
          text: THEME.colors.success,
          border: THEME.colors.successBorder,
        };
      case 'danger':
        return {
          bg: THEME.colors.errorBg,
          text: THEME.colors.errorText,
          border: THEME.colors.errorBorder,
        };
      case 'primary':
        return {
          bg: THEME.colors.primaryLight,
          text: THEME.colors.primary,
          border: '#BFDBFE',
        };
      case 'admin':
        return {
          bg: '#FAF5FF',
          text: '#7E22CE',
          border: '#E9D5FF',
        };
      default:
        return {
          bg: '#F1F5F9',
          text: THEME.colors.textSecondary,
          border: THEME.colors.cardBorder,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.badgeText, { color: style.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 5,
  },
  badgeText: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
