import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { ErrorAlert } from '../components/ErrorAlert';
import { Button } from '../components/Button';
import { THEME } from '../constants/theme';
import { APP_CONFIG, ALLOWED_DOMAIN } from '../constants/config';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, simulateLogin, error, clearError, isLoading } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.tablet;

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = async () => {
    if (!emailInput.trim()) {
      return;
    }
    await signInWithEmail(emailInput.trim(), passwordInput.trim() || undefined);
  };

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
          </View>

          <View style={styles.heroMiddle}>
            <Text style={styles.heroTitle}>Good work.{'\n'}Stronger together.</Text>
            <Text style={styles.heroDescription}>
              Your team, your tools, your workday. All in one secure place.
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
                Sign in with your official @{ALLOWED_DOMAIN} account to continue.
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

            {/* Divider: OR CONTINUE WITH EMAIL */}
            <View style={styles.orDividerRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR CONTINUE WITH EMAIL</Text>
              <View style={styles.orLine} />
            </View>

            {/* EMAIL AUTHENTICATION FORM */}
            <View style={styles.emailFormContainer}>
              {/* Work Email Input */}
              <View style={styles.inputFieldGroup}>
                <Text style={styles.inputLabel}>Work Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={17} color={THEME.colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={`e.g. name@${ALLOWED_DOMAIN}`}
                    placeholderTextColor={THEME.colors.textMuted}
                    value={emailInput}
                    onChangeText={(txt) => {
                      setEmailInput(txt);
                      if (error) clearError();
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputFieldGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={17} color={THEME.colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter password"
                    placeholderTextColor={THEME.colors.textMuted}
                    value={passwordInput}
                    onChangeText={setPasswordInput}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={THEME.colors.textMuted}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Email Sign In Button */}
              <Button
                label="Sign In with Work Email"
                onPress={handleEmailSubmit}
                isLoading={isLoading}
                style={styles.emailSubmitButton}
                textStyle={styles.emailSubmitButtonText}
              />
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
  },

  // Divider: OR CONTINUE WITH EMAIL
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: THEME.spacing.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.cardBorder,
  },
  orText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    paddingHorizontal: 10,
    letterSpacing: 0.6,
  },

  // Email Auth Form
  emailFormContainer: {
    gap: 12,
    marginBottom: THEME.spacing.md,
  },
  inputFieldGroup: {
    gap: 5,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAF8',
    borderColor: THEME.colors.cardBorder,
    borderWidth: 1.5,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: THEME.colors.textPrimary,
    outlineWidth: 0,
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
  },
  emailSubmitButton: {
    backgroundColor: THEME.colors.forestGreen,
    paddingVertical: 12,
    marginTop: 4,
  },
  emailSubmitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Evaluator Section
  evaluatorSection: {
    marginBottom: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
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
