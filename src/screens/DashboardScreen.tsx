import React from 'react';
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
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';

export const DashboardScreen: React.FC = () => {
  const { user, signOut, navigateTo } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < THEME.breakpoints.tablet;

  return (
    <View style={styles.screenWrapper}>
      <Navbar />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.mainContainer, isMobile ? styles.containerMobile : styles.containerDesktop]}>
          
          {/* Welcome Hero Banner */}
          <View style={styles.heroBanner}>
            <View style={styles.heroLeft}>
              <View style={styles.heroUserRow}>
                {user?.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={styles.heroAvatar} />
                ) : (
                  <View style={styles.heroAvatarFallback}>
                    <Text style={styles.heroAvatarText}>
                      {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.heroUserMeta}>
                  <View style={styles.badgeRow}>
                    <Badge
                      label={`@${user?.domain || APP_CONFIG.allowedDomain} Verified`}
                      variant="success"
                      icon={<Text style={styles.badgeCheck}>✓</Text>}
                    />
                    <View style={{ width: 8 }} />
                    <Badge
                      label={user?.role === 'admin' ? 'Administrator' : 'Team Member'}
                      variant={user?.role === 'admin' ? 'admin' : 'primary'}
                    />
                  </View>
                  <Text style={styles.heroWelcomeTitle}>
                    Welcome back, {user?.fullName || user?.email.split('@')[0]}!
                  </Text>
                  <Text style={styles.heroWelcomeEmail}>{user?.email}</Text>
                </View>
              </View>
            </View>

            <View style={styles.heroRight}>
              <Text style={styles.sessionTimestamp}>
                Authenticated via Google OAuth 2.0
              </Text>
              <Text style={styles.sessionDate}>
                {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Just now'}
              </Text>
            </View>
          </View>

          {/* Admin Announcement Banner (if user has Admin role) */}
          {user?.role === 'admin' && (
            <Pressable
              onPress={() => navigateTo('admin')}
              style={({ pressed }) => [styles.adminCallout, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.adminCalloutContent}>
                <Text style={styles.adminCalloutIcon}>🛡️</Text>
                <View style={styles.adminCalloutTextCol}>
                  <Text style={styles.adminCalloutTitle}>Administrator Privileges Detected</Text>
                  <Text style={styles.adminCalloutSubtitle}>
                    You have elevated access. Click here to open the User Management & Security Audit Panel.
                  </Text>
                </View>
              </View>
              <View style={styles.adminCalloutArrow}>
                <Text style={styles.adminArrowText}>Manage →</Text>
              </View>
            </Pressable>
          )}

          {/* Metric Cards Row */}
          <View style={[styles.statsGrid, isMobile && styles.statsGridMobile]}>
            <Card style={styles.statCard}>
              <View style={styles.statIconBadge}>
                <Text style={styles.statIcon}>🔒</Text>
              </View>
              <Text style={styles.statLabel}>Domain Policy</Text>
              <Text style={styles.statValue}>@{APP_CONFIG.allowedDomain}</Text>
              <Text style={styles.statSubtext}>100% Enforced</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={[styles.statIconBadge, { backgroundColor: '#ECFDF5' }]}>
                <Text style={styles.statIcon}>✅</Text>
              </View>
              <Text style={styles.statLabel}>Account Status</Text>
              <Text style={styles.statValue}>Verified</Text>
              <Text style={styles.statSubtext}>Official Corporate Email</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={[styles.statIconBadge, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.statIcon}>🔑</Text>
              </View>
              <Text style={styles.statLabel}>Auth Protocol</Text>
              <Text style={styles.statValue}>OAuth 2.0</Text>
              <Text style={styles.statSubtext}>Supabase JWT Session</Text>
            </Card>

            <Card style={styles.statCard}>
              <View style={[styles.statIconBadge, { backgroundColor: '#FAF5FF' }]}>
                <Text style={styles.statIcon}>👤</Text>
              </View>
              <Text style={styles.statLabel}>Assigned Role</Text>
              <Text style={styles.statValue}>{user?.role.toUpperCase()}</Text>
              <Text style={styles.statSubtext}>RBAC Active</Text>
            </Card>
          </View>

          {/* Security & Overview Section */}
          <View style={[styles.contentColumns, isMobile && styles.contentColumnsMobile]}>
            {/* Left Column: Security Information */}
            <Card
              title="Security & Verification Details"
              subtitle="Identity and domain validation metadata"
              style={styles.detailsCard}
            >
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>User Email:</Text>
                <Text style={styles.infoVal}>{user?.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Email Domain:</Text>
                <View style={styles.infoValWithBadge}>
                  <Text style={styles.infoVal}>{user?.domain}</Text>
                  <Text style={styles.matchBadge}>✓ Allowed</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>OAuth Provider:</Text>
                <Text style={styles.infoVal}>Google (accounts.google.com)</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>User ID:</Text>
                <Text style={[styles.infoVal, styles.monoText]}>{user?.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Route Protection:</Text>
                <Text style={styles.infoVal}>Active (Guarded against unauthorized access)</Text>
              </View>
            </Card>

            {/* Right Column: Portal Guidelines */}
            <Card
              title="HB+ Domain Protection Rules"
              subtitle="How unauthorized domain restriction works"
              style={styles.detailsCard}
            >
              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>1.</Text>
                <Text style={styles.ruleText}>
                  Any login attempt from <Text style={{ fontWeight: 'bold' }}>@gmail.com</Text> or other non-official domains is intercepted immediately upon Google OAuth callback.
                </Text>
              </View>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>2.</Text>
                <Text style={styles.ruleText}>
                  The system automatically revokes the session token, logs an unauthorized attempt, and redirects to login with:
                  {'\n'}
                  <Text style={styles.ruleQuote}>
                    "Access restricted. Please login using your official domain email."
                  </Text>
                </Text>
              </View>

              <View style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>3.</Text>
                <Text style={styles.ruleText}>
                  Direct URL navigation to <Text style={{ fontFamily: 'monospace' }}>/dashboard</Text> without an active domain-verified session is blocked by the route guard.
                </Text>
              </View>

              <View style={styles.actionRow}>
                <Button
                  label="Sign Out Session"
                  variant="outline"
                  onPress={signOut}
                  style={{ alignSelf: 'flex-start', marginTop: 12 }}
                />
              </View>
            </Card>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.md,
    alignItems: 'center',
  },
  mainContainer: {
    width: '100%',
  },
  containerDesktop: {
    maxWidth: 1100,
  },
  containerMobile: {
    maxWidth: '100%',
  },
  heroBanner: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.md,
  },
  heroLeft: {
    flex: 1,
    minWidth: 280,
  },
  heroUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    marginRight: THEME.spacing.md,
  },
  heroAvatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  heroAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroUserMeta: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeCheck: {
    fontSize: 10,
    color: THEME.colors.success,
    fontWeight: 'bold',
  },
  heroWelcomeTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.textPrimary,
  },
  heroWelcomeEmail: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  heroRight: {
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sessionTimestamp: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.primary,
    textTransform: 'uppercase',
  },
  sessionDate: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  adminCallout: {
    backgroundColor: '#FAF5FF',
    borderColor: '#D8B4FE',
    borderWidth: 1.5,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.sm,
  },
  adminCalloutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminCalloutIcon: {
    fontSize: 28,
    marginRight: THEME.spacing.md,
  },
  adminCalloutTextCol: {
    flex: 1,
  },
  adminCalloutTitle: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.bold,
    color: '#6B21A8',
  },
  adminCalloutSubtitle: {
    fontSize: THEME.typography.fontSize.xs,
    color: '#7E22CE',
    marginTop: 2,
  },
  adminCalloutArrow: {
    marginLeft: THEME.spacing.md,
    backgroundColor: '#8B5CF6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
  },
  adminArrowText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: THEME.spacing.lg,
  },
  statsGridMobile: {
    flexDirection: 'column',
  },
  statCard: {
    flex: 1,
    minWidth: 160,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  statSubtext: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  contentColumns: {
    flexDirection: 'row',
    gap: 16,
  },
  contentColumnsMobile: {
    flexDirection: 'column',
  },
  detailsCard: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  infoKey: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  infoValWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchBadge: {
    fontSize: 11,
    color: THEME.colors.success,
    backgroundColor: THEME.colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleBullet: {
    width: 20,
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  ruleText: {
    flex: 1,
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
  },
  ruleQuote: {
    color: THEME.colors.errorText,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  actionRow: {
    marginTop: 8,
  },
});
