import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'sage' | 'success' | 'danger' | 'admin' | 'darkGreen' | 'neutral' | 'primary';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'sage',
  icon,
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'primary':
      case 'sage':
      case 'success':
        return {
          bg: THEME.colors.creamDark,
          text: THEME.colors.textPrimary,
          border: THEME.colors.cardBorder,
        };
      case 'danger':
        return {
          bg: THEME.colors.errorBg,
          text: THEME.colors.errorText,
          border: THEME.colors.errorBorder,
        };
      case 'admin':
        return {
          bg: '#1A1A1A',
          text: '#F5F2E9',
          border: '#1A1A1A',
        };
      case 'darkGreen':
        return {
          bg: 'rgba(255, 255, 255, 0.16)',
          text: '#FFFFFF',
          border: 'rgba(255, 255, 255, 0.25)',
        };
      default:
        return {
          bg: '#F3F4F6',
          text: '#374151',
          border: '#E5E7EB',
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
    paddingVertical: 3.5,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  badgeText: {
    fontFamily: THEME.typography.fontFamily.sans,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
