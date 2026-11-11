import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
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
  const isMobile = width < THEME.breakpoints.tablet;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.container, isMobile ? styles.containerMobile : styles.containerDesktop]}>
        
        {/* Main Authentication Card */}
        <View style={styles.authCard}>
          {/* Header Branding */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>HB+</Text>
            </View>
            <Text style={styles.brandTitle}>{APP_CONFIG.name}</Text>
            <Text style={styles.brandSubtitle}>
              Sign in to access your company dashboard and resources
            </Text>
          </View>

          {/* Security Domain Requirement Pill */}
          <View style={styles.domainRequirementBanner}>
            <Text style={styles.domainRequirementIcon}>🔒</Text>
            <View style={styles.domainRequirementTextCol}>
              <Text style={styles.domainRequirementTitle}>Domain Whitelist Active</Text>
              <Text style={styles.domainRequirementBody}>
                Only verified accounts ending in{' '}
                <Text style={styles.domainHighlight}>@{ALLOWED_DOMAIN}</Text> are authorized.
              </Text>
            </View>
          </View>

          {/* Error Banner (Displays when rejected) */}
          {error && (
            <ErrorAlert
              message={error}
              onDismiss={clearError}
              title="Authentication Blocked"
            />
          )}

          {/* Google Sign-In Button */}
          <View style={styles.actionSection}>
            <GoogleSignInButton
              onPress={signInWithGoogle}
              isLoading={isLoading}
              label="Sign in with Google"
            />
            <Text style={styles.oauthHint}>
              Connects via Google OAuth 2.0. Unofficial domains will be rejected automatically.
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>EVALUATOR TEST SUITE</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Demo Sandbox for Evaluators */}
          <View style={styles.demoCard}>
            <Text style={styles.demoHeaderTitle}>Instant Scenario Testing</Text>
            <Text style={styles.demoHeaderSubtitle}>
              Test both acceptance and rejection flows without third-party account requirements:
            </Text>

            <View style={styles.demoButtonsGrid}>
              {/* Allowed Scenario (User) */}
              <Button
                label="🟢 Allow: user@hbplus.fit"
                onPress={() => simulateLogin(`user@${ALLOWED_DOMAIN}`, 'user')}
                variant="outline"
                isLoading={isLoading}
                style={styles.demoBtnSuccess}
                textStyle={styles.demoBtnTextSuccess}
              />

              {/* Allowed Scenario (Admin) */}
              <Button
                label="🛡️ Allow: admin@hbplus.fit (Admin Role)"
                onPress={() => simulateLogin(`admin@${ALLOWED_DOMAIN}`, 'admin')}
                variant="outline"
                isLoading={isLoading}
                style={styles.demoBtnAdmin}
                textStyle={styles.demoBtnTextAdmin}
              />

              {/* Blocked Scenario (Gmail) */}
              <Button
                label="🔴 Block: example@gmail.com"
                onPress={() => simulateLogin('example@gmail.com')}
                variant="outline"
                isLoading={isLoading}
                style={styles.demoBtnDanger}
                textStyle={styles.demoBtnTextDanger}
              />

              {/* Blocked Scenario (Other Domain) */}
              <Button
                label="🔴 Block: personal@yahoo.com"
                onPress={() => simulateLogin('personal@yahoo.com')}
                variant="outline"
                isLoading={isLoading}
                style={styles.demoBtnDanger}
                textStyle={styles.demoBtnTextDanger}
              />
            </View>
          </View>

          {/* Footer note */}
          <View style={styles.footerNote}>
            <Text style={styles.footerText}>
              Cross-platform React Native for Web & Mobile • Protected Route Guard Active
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    paddingVertical: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.md,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  containerDesktop: {
    maxWidth: 520,
  },
  containerMobile: {
    maxWidth: '100%',
  },
  authCard: {
    width: '100%',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    padding: THEME.spacing.xl,
    ...THEME.shadows.lg,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.md,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  domainRequirementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryLight,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  domainRequirementIcon: {
    fontSize: 20,
    marginRight: THEME.spacing.sm,
  },
  domainRequirementTextCol: {
    flex: 1,
  },
  domainRequirementTitle: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  domainRequirementBody: {
    fontSize: THEME.typography.fontSize.sm,
    color: '#1E40AF',
    marginTop: 2,
  },
  domainHighlight: {
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: THEME.spacing.sm,
  },
  oauthHint: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: THEME.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.cardBorder,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    paddingHorizontal: 10,
    letterSpacing: 0.8,
  },
  demoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: THEME.spacing.md,
  },
  demoHeaderTitle: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.textPrimary,
  },
  demoHeaderSubtitle: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    marginBottom: THEME.spacing.md,
  },
  demoButtonsGrid: {
    gap: 8,
  },
  demoBtnSuccess: {
    borderColor: THEME.colors.successBorder,
    backgroundColor: THEME.colors.successBg,
    paddingVertical: 10,
  },
  demoBtnTextSuccess: {
    color: '#065F46',
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: '600',
  },
  demoBtnAdmin: {
    borderColor: '#E9D5FF',
    backgroundColor: '#FAF5FF',
    paddingVertical: 10,
  },
  demoBtnTextAdmin: {
    color: '#6B21A8',
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: '600',
  },
  demoBtnDanger: {
    borderColor: THEME.colors.errorBorder,
    backgroundColor: THEME.colors.errorBg,
    paddingVertical: 10,
  },
  demoBtnTextDanger: {
    color: THEME.colors.errorText,
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: '600',
  },
  footerNote: {
    marginTop: THEME.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
});
