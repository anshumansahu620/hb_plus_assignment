import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { ErrorAlert } from '../components/ErrorAlert';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { THEME } from '../constants/theme';
import { APP_CONFIG, ALLOWED_DOMAIN } from '../constants/config';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, simulateLogin, error, clearError, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.tablet;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollRoot}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.mainLayout, isDesktop ? styles.layoutDesktop : styles.layoutMobile]}>
        
        {/* LEFT / TOP HERO PANEL (Forest Green from Figma) */}
        <View style={[styles.heroPanel, isDesktop ? styles.heroPanelDesktop : styles.heroPanelMobile]}>
          <View style={styles.heroTop}>
            <View style={styles.brandRow}>
              <View style={styles.brandDot} />
              <Text style={styles.brandName}>hbplus</Text>
            </View>
            <View style={styles.workspacePill}>
              <Text style={styles.workspacePillText}>Workspace Security</Text>
            </View>
          </View>

          <View style={styles.heroMiddle}>
            <Text style={styles.heroTitle}>Good work.{'\n'}Stronger together.</Text>
            <Text style={styles.heroDescription}>
              Your team, your tools, your workday. All in one secure place.
            </Text>
          </View>

          {/* Bottom Card inside Hero from Figma */}
          <View style={styles.heroCard}>
            <View style={styles.heroCardTop}>
              <Text style={styles.heroCardDomain}>{ALLOWED_DOMAIN}</Text>
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagText}>✓ Official workspace</Text>
              </View>
            </View>
            <Text style={styles.heroCardNotice}>
              Restricted exclusively to authorized organizational members.
            </Text>
          </View>

          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterText}>Built for teams that move fast.</Text>
          </View>
        </View>

        {/* RIGHT / BOTTOM AUTH PANEL (Clean Sage from Figma) */}
        <View style={[styles.authPanel, isDesktop ? styles.authPanelDesktop : styles.authPanelMobile]}>
          {/* Top Support link */}
          <View style={styles.authTopBar}>
            <Pressable
              onPress={() => alert(`IT Support: ${APP_CONFIG.supportEmail}`)}
              style={({ pressed }) => [styles.supportLink, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.supportLinkText}>Need help? Contact support</Text>
            </Pressable>
          </View>

          <View style={styles.authContentContainer}>
            {/* Kicker & Headline from Figma */}
            <View style={styles.authHeader}>
              <Text style={styles.kickerText}>WELCOME BACK</Text>
              <Text style={styles.authTitle}>Your workspace awaits.</Text>
              <Text style={styles.authSubtitle}>
                Sign in with your official Google account to continue to your dashboard.
              </Text>
            </View>

            {/* Error banner (Displays when non-domain email like @gmail.com is attempted) */}
            {error && (
              <View style={styles.errorContainer}>
                <ErrorAlert
                  message={error}
                  onDismiss={clearError}
                  title="Access Restricted"
                />
              </View>
            )}

            {/* Google OAuth Action Button */}
            <View style={styles.buttonWrapper}>
              <GoogleSignInButton
                onPress={signInWithGoogle}
                isLoading={isLoading}
                label="Continue with Google"
              />
            </View>

            {/* Exclusive to @hbplus.fit Notice Card from Figma */}
            <View style={styles.domainNoticeCard}>
              <View style={styles.domainNoticeHeader}>
                <View style={styles.greenDot} />
                <Text style={styles.domainNoticeTitle}>
                  Exclusive to @{ALLOWED_DOMAIN}
                </Text>
              </View>
              <Text style={styles.domainNoticeBody}>
                Please sign in with your official @{ALLOWED_DOMAIN} email address. External accounts will be automatically blocked.
              </Text>
            </View>

            {/* Evaluator & Recruiter Sandbox Suite */}
            <View style={styles.evaluatorSection}>
              <View style={styles.evaluatorDividerRow}>
                <View style={styles.evaluatorLine} />
                <Text style={styles.evaluatorLabel}>EVALUATOR TEST SCENARIOS</Text>
                <View style={styles.evaluatorLine} />
              </View>

              <View style={styles.testButtonsGrid}>
                {/* 1. Allowed User */}
                <Button
                  label="Allow: user@hbplus.fit (Team Member)"
                  variant="outline"
                  onPress={() => simulateLogin(`alex.trainer@${ALLOWED_DOMAIN}`, 'user')}
                  isLoading={isLoading}
                  style={styles.testBtnSuccess}
                  textStyle={styles.testBtnTextSuccess}
                />

                {/* 2. Allowed Admin */}
                <Button
                  label="Allow: admin@hbplus.fit (Admin Role)"
                  variant="outline"
                  onPress={() => simulateLogin(`admin@${ALLOWED_DOMAIN}`, 'admin')}
                  isLoading={isLoading}
                  style={styles.testBtnAdmin}
                  textStyle={styles.testBtnTextAdmin}
                />

                {/* 3. Blocked Gmail */}
                <Button
                  label="Block: example@gmail.com (Restricted)"
                  variant="outline"
                  onPress={() => simulateLogin('example@gmail.com')}
                  isLoading={isLoading}
                  style={styles.testBtnDanger}
                  textStyle={styles.testBtnTextDanger}
                />
              </View>
            </View>

            {/* Terms and Privacy Footer */}
            <View style={styles.termsFooter}>
              <Text style={styles.termsText}>
                Privacy Policy  •  Terms of Service  •  Protected Route Guard Active
              </Text>
            </View>

          </View>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollRoot: {
    flexGrow: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  mainLayout: {
    width: '100%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xxl,
    overflow: 'hidden',
    ...THEME.shadows.lg,
  },
  layoutDesktop: {
    maxWidth: 1040,
    minHeight: 640,
    flexDirection: 'row',
  },
  layoutMobile: {
    maxWidth: 480,
    flexDirection: 'column',
  },
  
  // Hero Panel Styles (Figma Forest Green)
  heroPanel: {
    backgroundColor: THEME.colors.forestGreen,
    padding: THEME.spacing.xl,
    justifyContent: 'space-between',
  },
  heroPanelDesktop: {
    width: '46%',
  },
  heroPanelMobile: {
    width: '100%',
    paddingVertical: THEME.spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  workspacePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  workspacePillText: {
    color: '#D1FAE5',
    fontSize: 11,
    fontWeight: '600',
  },
  heroMiddle: {
    marginVertical: THEME.spacing.lg,
  },
  heroTitle: {
    fontSize: THEME.typography.fontSize.hero,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  heroDescription: {
    fontSize: THEME.typography.fontSize.base,
    color: THEME.colors.textLightMuted,
    marginTop: 14,
    lineHeight: 22,
    maxWidth: 340,
  },
  heroCard: {
    backgroundColor: THEME.colors.forestGreenCard,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: THEME.spacing.md,
  },
  heroCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroCardDomain: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedTag: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6EE7B7',
  },
  heroCardNotice: {
    fontSize: 12,
    color: THEME.colors.textLightMuted,
    lineHeight: 16,
  },
  heroFooter: {
    marginTop: THEME.spacing.lg,
  },
  heroFooterText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
  },

  // Auth Panel Styles (Clean Sage Right side from Figma)
  authPanel: {
    backgroundColor: '#FFFFFF',
    padding: THEME.spacing.xl,
    justifyContent: 'space-between',
  },
  authPanelDesktop: {
    width: '54%',
  },
  authPanelMobile: {
    width: '100%',
    padding: THEME.spacing.lg,
  },
  authTopBar: {
    alignItems: 'flex-end',
    marginBottom: THEME.spacing.md,
  },
  supportLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  supportLinkText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  authContentContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  authHeader: {
    marginBottom: THEME.spacing.lg,
  },
  kickerText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.forestGreen,
    letterSpacing: 1,
    marginBottom: 6,
  },
  authTitle: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  authSubtitle: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  errorContainer: {
    marginBottom: THEME.spacing.md,
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: THEME.spacing.md,
  },
  domainNoticeCard: {
    backgroundColor: '#F2F7F2',
    borderWidth: 1,
    borderColor: '#D7E7D6',
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginBottom: THEME.spacing.lg,
  },
  domainNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  domainNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#154436',
  },
  domainNoticeBody: {
    fontSize: 12,
    color: '#3C5C4E',
    lineHeight: 17,
  },
  evaluatorSection: {
    marginBottom: THEME.spacing.md,
  },
  evaluatorDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  evaluatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.divider,
  },
  evaluatorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    paddingHorizontal: 8,
    letterSpacing: 0.6,
  },
  testButtonsGrid: {
    gap: 8,
  },
  testBtnSuccess: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    paddingVertical: 9,
  },
  testBtnTextSuccess: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '600',
  },
  testBtnAdmin: {
    borderColor: '#DDD6FE',
    backgroundColor: '#F5F3FF',
    paddingVertical: 9,
  },
  testBtnTextAdmin: {
    color: '#6D28D9',
    fontSize: 12,
    fontWeight: '600',
  },
  testBtnDanger: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    paddingVertical: 9,
  },
  testBtnTextDanger: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
  },
  termsFooter: {
    alignItems: 'center',
    marginTop: THEME.spacing.md,
  },
  termsText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
});
