import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { Badge } from './Badge';
import { APP_CONFIG } from '../constants/config';

export const Navbar: React.FC = () => {
  const { user, signOut, activeRoute, navigateTo } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < THEME.breakpoints.tablet;

  return (
    <View style={styles.navbar}>
      <View style={styles.leftSection}>
        {/* Brand Logo & Name */}
        <Pressable
          onPress={() => navigateTo('dashboard')}
          style={styles.brandContainer}
        >
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>HB+</Text>
          </View>
          {!isMobile && (
            <View style={styles.brandTitleContainer}>
              <Text style={styles.brandTitle}>{APP_CONFIG.name}</Text>
              <Text style={styles.brandSubtitle}>Official Enterprise Portal</Text>
            </View>
          )}
        </Pressable>

        {/* Navigation Tabs */}
        <View style={styles.navLinks}>
          <Pressable
            onPress={() => navigateTo('dashboard')}
            style={[
              styles.navLink,
              activeRoute === 'dashboard' && styles.navLinkActive,
            ]}
          >
            <Text
              style={[
                styles.navLinkText,
                activeRoute === 'dashboard' && styles.navLinkTextActive,
              ]}
            >
              Dashboard
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigateTo('resources')}
            style={[
              styles.navLink,
              activeRoute === 'resources' && styles.navLinkActive,
            ]}
          >
            <Text
              style={[
                styles.navLinkText,
                activeRoute === 'resources' && styles.navLinkTextActive,
              ]}
            >
              Resources
            </Text>
          </Pressable>

          {user?.role === 'admin' && (
            <Pressable
              onPress={() => navigateTo('admin')}
              style={[
                styles.navLink,
                activeRoute === 'admin' && styles.navLinkActive,
              ]}
            >
              <Text
                style={[
                  styles.navLinkText,
                  activeRoute === 'admin' && styles.navLinkTextActive,
                ]}
              >
                Admin Panel
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Right Section: User Info, Domain Badge & Logout */}
      <View style={styles.rightSection}>
        {!isMobile && (
          <Badge
            label={`@${APP_CONFIG.allowedDomain} Verified`}
            variant="success"
            icon={<Text style={styles.badgeIcon}>✓</Text>}
          />
        )}

        {user && (
          <View style={styles.userProfilePill}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {(user.fullName || user.email)[0].toUpperCase()}
                </Text>
              </View>
            )}

            {!isMobile && (
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user.fullName || user.email.split('@')[0]}
                </Text>
                <View style={styles.roleRow}>
                  <Badge
                    label={user.role}
                    variant={user.role === 'admin' ? 'admin' : 'primary'}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Sign Out Button */}
        <Pressable
          onPress={signOut}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 70,
    backgroundColor: THEME.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    ...THEME.shadows.sm,
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: THEME.spacing.lg,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.sm,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  brandTitleContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.textPrimary,
  },
  brandSubtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: -2,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: THEME.spacing.sm,
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.sm,
    marginRight: THEME.spacing.xs,
  },
  navLinkActive: {
    backgroundColor: THEME.colors.primaryLight,
  },
  navLinkText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.fontWeight.medium,
  },
  navLinkTextActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeIcon: {
    fontSize: 11,
    color: THEME.colors.success,
    fontWeight: 'bold',
  },
  userProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: THEME.spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  userInfo: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  userName: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.textPrimary,
    maxWidth: 120,
  },
  roleRow: {
    marginTop: 2,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonPressed: {
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    color: THEME.colors.errorText,
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
});

