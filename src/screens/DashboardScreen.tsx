import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';

export const DashboardScreen: React.FC = () => {
  const { user, signOut, navigateTo } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.tablet;

  const [activeTab, setActiveTab] = useState<'overview' | 'resources'>('overview');

  const firstName = user?.fullName
    ? user.fullName.split(' ')[0]
    : user?.email.split('@')[0] || 'Member';

  return (
    <View style={styles.rootWrapper}>
      <View style={[styles.dashboardLayout, isDesktop ? styles.layoutDesktop : styles.layoutMobile]}>
        
        {/* SIDEBAR (Desktop only - matches Figma middle screen) */}
        {isDesktop && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarTop}>
              {/* Brand Logo */}
              <View style={styles.brandRow}>
                <View style={styles.brandDot} />
                <Text style={styles.brandName}>hbplus</Text>
              </View>

              {/* Sidebar Menu Items */}
              <View style={styles.menuList}>
                <Pressable
                  onPress={() => setActiveTab('overview')}
                  style={[styles.menuItem, activeTab === 'overview' && styles.menuItemActive]}
                >
                  <Text style={styles.menuIcon}>📊</Text>
                  <Text style={[styles.menuItemText, activeTab === 'overview' && styles.menuItemTextActive]}>
                    Overview
                  </Text>
                </Pressable>

                {user?.role === 'admin' && (
                  <Pressable
                    onPress={() => navigateTo('admin')}
                    style={styles.menuItem}
                  >
                    <Text style={styles.menuIcon}>🛡️</Text>
                    <Text style={styles.menuItemText}>Admin Panel</Text>
                    <Badge label="RBAC" variant="admin" />
                  </Pressable>
                )}

                <Pressable
                  onPress={() => setActiveTab('resources')}
                  style={[styles.menuItem, activeTab === 'resources' && styles.menuItemActive]}
                >
                  <Text style={styles.menuIcon}>📁</Text>
                  <Text style={[styles.menuItemText, activeTab === 'resources' && styles.menuItemTextActive]}>
                    Resources
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sidebar User Footer */}
            <View style={styles.sidebarFooter}>
              <View style={styles.userProfileRow}>
                {user?.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={styles.userAvatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitial}>{firstName[0].toUpperCase()}</Text>
                  </View>
                )}
                <View style={styles.userMetaCol}>
                  <Text style={styles.userName} numberOfLines={1}>{user?.fullName || firstName}</Text>
                  <Text style={styles.userRoleText}>{user?.role === 'admin' ? 'Administrator' : 'Team Member'}</Text>
                </View>
              </View>

              <Pressable
                onPress={signOut}
                style={({ pressed }) => [styles.signOutLink, pressed && { opacity: 0.6 }]}
              >
                <Text style={styles.signOutText}>Sign out</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* MAIN DASHBOARD CONTENT AREA */}
        <View style={styles.contentArea}>
          {/* Top Mobile Bar if mobile */}
          {!isDesktop && (
            <View style={styles.mobileTopBar}>
              <View style={styles.brandRow}>
                <View style={styles.brandDot} />
                <Text style={styles.brandNameDark}>hbplus</Text>
              </View>
              <Pressable onPress={signOut} style={styles.mobileSignOut}>
                <Text style={styles.mobileSignOutText}>Sign out</Text>
              </Pressable>
            </View>
          )}

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.innerContainer}>
              
              {/* Header Greeting */}
              <View style={styles.greetingHeader}>
                <View>
                  <Text style={styles.greetingTitle}>Welcome back, {firstName}.</Text>
                  <Text style={styles.greetingSubtitle}>
                    Here is what's happening with your workspace today.
                  </Text>
                </View>

                {isDesktop && (
                  <Badge
                    label={`@${APP_CONFIG.allowedDomain} Verified`}
                    variant="success"
                    icon={<Text style={styles.badgeCheck}>✓</Text>}
                  />
                )}
              </View>

              {/* FOREST GREEN HERO BANNER (Matches Figma Screen 2 & 4) */}
              <View style={styles.forestHeroBanner}>
                <View style={styles.forestHeroLeft}>
                  <View style={styles.heroPill}>
                    <View style={styles.heroPillDot} />
                    <Text style={styles.heroPillText}>DOMAIN VERIFIED</Text>
                  </View>
                  <Text style={styles.forestHeroTitle}>One team. Connected securely.</Text>
                  <Text style={styles.forestHeroSubtitle}>
                    Your session is authenticated and protected under @{APP_CONFIG.allowedDomain}.
                  </Text>
                </View>

                <View style={styles.forestHeroRight}>
                  <View style={styles.lockBadgeCircle}>
                    <Text style={styles.lockBadgeIcon}>🔒</Text>
                  </View>
                </View>
              </View>

              {/* Admin Announcement Callout (If user is Admin) */}
              {user?.role === 'admin' && (
                <Pressable
                  onPress={() => navigateTo('admin')}
                  style={({ pressed }) => [styles.adminNotice, pressed && { opacity: 0.85 }]}
                >
                  <View style={styles.adminNoticeContent}>
                    <Text style={styles.adminNoticeIcon}>🛡️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adminNoticeTitle}>Administrator Controls Active</Text>
                      <Text style={styles.adminNoticeBody}>
                        You have permission to manage team accounts, toggle roles, and review security audit logs.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.adminNoticeBtn}>
                    <Text style={styles.adminNoticeBtnText}>Open Panel →</Text>
                  </View>
                </Pressable>
              )}

              {/* CARD: YOUR ACCOUNT (From Figma Screen 2 & 4) */}
              <View style={styles.cardContainer}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>Your account</Text>
                  <Badge label="ACTIVE" variant="sage" />
                </View>

                <View style={styles.accountTable}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Email address</Text>
                    <Text style={styles.tableValueBold}>{user?.email}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Domain status</Text>
                    <View style={styles.domainValueRow}>
                      <Text style={styles.tableValue}>{user?.domain}</Text>
                      <Badge label="Allowed Domain" variant="success" />
                    </View>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Assigned role</Text>
                    <Badge
                      label={user?.role === 'admin' ? 'Administrator' : 'Team Member'}
                      variant={user?.role === 'admin' ? 'admin' : 'sage'}
                    />
                  </View>

                  <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.tableLabel}>Last sign-in</Text>
                    <Text style={styles.tableValue}>
                      {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Just now'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* BOTTOM GRID: WORKPLACE MODULES (From Figma Screen 2) */}
              <View style={styles.modulesSection}>
                <Text style={styles.sectionHeader}>Workspace quick access</Text>

                <View style={[styles.modulesGrid, !isDesktop && styles.modulesGridMobile]}>
                  {/* Module 1: Team Directory */}
                  <Pressable
                    onPress={() => user?.role === 'admin' ? navigateTo('admin') : alert('Directory contains authorized @hbplus.fit members.')}
                    style={styles.moduleCard}
                  >
                    <View style={styles.moduleIconWrapper}>
                      <Text style={styles.moduleIcon}>👥</Text>
                    </View>
                    <Text style={styles.moduleTitle}>Team Directory</Text>
                    <Text style={styles.moduleDesc}>
                      View members and administrators verified on @{APP_CONFIG.allowedDomain}.
                    </Text>
                  </Pressable>

                  {/* Module 2: Security Policy */}
                  <Pressable
                    onPress={() => alert(`Policy: Access restricted exclusively to @${APP_CONFIG.allowedDomain}. Non-official emails are rejected immediately.`)}
                    style={styles.moduleCard}
                  >
                    <View style={[styles.moduleIconWrapper, { backgroundColor: '#F0FDF4' }]}>
                      <Text style={styles.moduleIcon}>🔒</Text>
                    </View>
                    <Text style={styles.moduleTitle}>Domain Security</Text>
                    <Text style={styles.moduleDesc}>
                      Strict Google OAuth domain validation active with automated session revocation.
                    </Text>
                  </Pressable>

                  {/* Module 3: Session State */}
                  <Pressable
                    onPress={signOut}
                    style={styles.moduleCard}
                  >
                    <View style={[styles.moduleIconWrapper, { backgroundColor: '#FEF2F2' }]}>
                      <Text style={styles.moduleIcon}>🚪</Text>
                    </View>
                    <Text style={styles.moduleTitle}>Terminate Session</Text>
                    <Text style={styles.moduleDesc}>
                      Securely sign out and clear active authentication tokens.
                    </Text>
                  </Pressable>
                </View>
              </View>

            </View>
          </ScrollView>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootWrapper: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  dashboardLayout: {
    flex: 1,
  },
  layoutDesktop: {
    flexDirection: 'row',
  },
  layoutMobile: {
    flexDirection: 'column',
  },

  // Sidebar Styles (Figma Screen 2)
  sidebar: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: THEME.colors.cardBorder,
    padding: THEME.spacing.lg,
    justifyContent: 'space-between',
  },
  sidebarTop: {},
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.forestGreenHighlight,
    marginRight: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.forestGreen,
    letterSpacing: -0.5,
  },
  brandNameDark: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.forestGreen,
  },
  menuList: {
    gap: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
  },
  menuItemActive: {
    backgroundColor: THEME.colors.sageBg,
  },
  menuIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  menuItemTextActive: {
    color: THEME.colors.forestGreen,
    fontWeight: '700',
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.divider,
    paddingTop: THEME.spacing.md,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  userMetaCol: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  userRoleText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  signOutLink: {
    paddingVertical: 4,
  },
  signOutText: {
    fontSize: 12,
    color: THEME.colors.error,
    fontWeight: '600',
  },

  // Main Content Area
  contentArea: {
    flex: 1,
  },
  mobileTopBar: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
  },
  mobileSignOut: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: '#FEF2F2',
  },
  mobileSignOutText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.error,
  },
  scrollContent: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
  },
  innerContainer: {
    maxWidth: 960,
    width: '100%',
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    flexWrap: 'wrap',
    gap: 12,
  },
  greetingTitle: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  badgeCheck: {
    color: '#059669',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Forest Hero Banner (Figma Screen 2)
  forestHeroBanner: {
    backgroundColor: THEME.colors.forestGreen,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.md,
  },
  forestHeroLeft: {
    flex: 1,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.forestGreenHighlight,
    marginRight: 6,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D1FAE5',
    letterSpacing: 0.5,
  },
  forestHeroTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  forestHeroSubtitle: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textLightMuted,
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 520,
  },
  forestHeroRight: {
    marginLeft: THEME.spacing.md,
  },
  lockBadgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadgeIcon: {
    fontSize: 22,
  },

  // Admin Announcement
  adminNotice: {
    backgroundColor: '#FAF5FF',
    borderColor: '#DDD6FE',
    borderWidth: 1.5,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.sm,
  },
  adminNoticeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminNoticeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  adminNoticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6D28D9',
  },
  adminNoticeBody: {
    fontSize: 12,
    color: '#7C3AED',
    marginTop: 2,
  },
  adminNoticeBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
    marginLeft: 12,
  },
  adminNoticeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },

  // Account Card
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.lg,
    borderColor: THEME.colors.cardBorder,
    borderWidth: 1,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  cardTitle: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  accountTable: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.divider,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  tableLabel: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  tableValue: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: '500',
  },
  tableValueBold: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  domainValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Modules Section
  modulesSection: {
    marginTop: THEME.spacing.sm,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  modulesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  modulesGridMobile: {
    flexDirection: 'column',
  },
  moduleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    padding: THEME.spacing.md,
    ...THEME.shadows.sm,
  },
  moduleIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: THEME.colors.sageBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  moduleIcon: {
    fontSize: 18,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  moduleDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
});
