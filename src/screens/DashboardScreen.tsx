import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { ResourcesView } from '../components/ResourcesView';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';

const hbplusLogo = require('../../assets/hbplus-logo.png');

export const DashboardScreen: React.FC = () => {
  const { user, signOut, navigateTo, setPassword, grantAdminAccess, elevateToAdmin, activeRoute } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.tablet;

  const [activeTab, setActiveTab] = useState<'overview' | 'resources'>(
    activeRoute === 'resources' ? 'resources' : 'overview'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (activeRoute === 'resources') {
      setActiveTab('resources');
    } else if (activeRoute === 'dashboard') {
      setActiveTab('overview');
    }
  }, [activeRoute]);

  // Quick Grant Admin State on Dashboard
  const [quickAdminEmail, setQuickAdminEmail] = useState('');
  const [quickAdminMsg, setQuickAdminMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isQuickGranting, setIsQuickGranting] = useState(false);

  const handleQuickGrantAdmin = async () => {
    const trimmed = quickAdminEmail.trim();
    if (!trimmed) {
      setQuickAdminMsg({ text: 'Please enter a valid corporate email.', type: 'error' });
      return;
    }
    if (!trimmed.toLowerCase().endsWith(`@${APP_CONFIG.allowedDomain}`)) {
      setQuickAdminMsg({
        text: `Access restricted. Only @${APP_CONFIG.allowedDomain} corporate emails can receive admin permissions.`,
        type: 'error',
      });
      return;
    }

    setIsQuickGranting(true);
    setQuickAdminMsg(null);
    const res = await grantAdminAccess(trimmed);
    setQuickAdminMsg({ text: res.message, type: res.success ? 'success' : 'error' });
    if (res.success) {
      setQuickAdminEmail('');
    }
    setIsQuickGranting(false);
  };

  // Custom Password Setting State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSavePassword = async () => {
    setPwdMessage(null);
    if (!newPassword) {
      setPwdMessage({ text: 'Please enter a password.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMessage({ text: 'Passwords do not match. Please re-enter.', type: 'error' });
      return;
    }

    setPwdLoading(true);
    const result = await setPassword(newPassword);
    setPwdLoading(false);

    if (result.success) {
      setPwdMessage({
        text: result.message || 'Password saved successfully! You can now log in using your work email.',
        type: 'success',
      });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPwdMessage({
        text: result.message || 'Failed to update password.',
        type: 'error',
      });
    }
  };

  const firstName = user?.fullName
    ? user.fullName.split(' ')[0]
    : user?.email.split('@')[0] || 'Member';

  return (
    <View style={styles.rootWrapper}>
      <View style={styles.dashboardLayout}>

        {/* TOP HEADER BAR WITH HAMBURGER BUTTON */}
        <View style={styles.topHeaderBar}>
          <View style={styles.topHeaderLeft}>
            <Pressable
              onPress={() => setIsMenuOpen(prev => !prev)}
              style={({ pressed }) => [styles.hamburgerButton, pressed && { opacity: 0.7 }]}
              accessibilityLabel="Toggle navigation menu"
            >
              <Ionicons
                name={isMenuOpen ? "close-outline" : "menu-outline"}
                size={24}
                color={THEME.colors.onyx}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                setActiveTab('overview');
                navigateTo('dashboard');
              }}
              style={styles.brandRowTop}
            >
              <Image
                source={hbplusLogo}
                style={styles.brandLogoTop}
                resizeMode="contain"
              />
              <View style={styles.brandTextCol}>
                <Text style={styles.brandNameTop}>hbplus</Text>
                <Text style={styles.brandSubtitleTop}>Hop with HB</Text>
              </View>
            </Pressable>
          </View>

          {/* Desktop Navigation Tabs */}
          {isDesktop && (
            <View style={styles.desktopNavPills}>
              <Pressable
                onPress={() => {
                  setActiveTab('overview');
                  navigateTo('dashboard');
                }}
                style={[styles.desktopNavPill, activeTab === 'overview' && styles.desktopNavPillActive]}
              >
                <Ionicons
                  name="grid-outline"
                  size={14}
                  color={activeTab === 'overview' ? '#FFFFFF' : THEME.colors.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.desktopNavPillText, activeTab === 'overview' && styles.desktopNavPillTextActive]}>
                  Overview
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setActiveTab('resources');
                  navigateTo('resources');
                }}
                style={[styles.desktopNavPill, activeTab === 'resources' && styles.desktopNavPillActive]}
              >
                <Ionicons
                  name="folder-outline"
                  size={14}
                  color={activeTab === 'resources' ? '#FFFFFF' : THEME.colors.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.desktopNavPillText, activeTab === 'resources' && styles.desktopNavPillTextActive]}>
                  Resources
                </Text>
                <View style={styles.pillBadge}>
                  <Text style={styles.pillBadgeText}>14</Text>
                </View>
              </Pressable>

              {user?.role === 'admin' && (
                <Pressable
                  onPress={() => navigateTo('admin')}
                  style={styles.desktopNavPill}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={14}
                    color={THEME.colors.textSecondary}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.desktopNavPillText}>Admin Panel</Text>
                  <View style={styles.pillBadgeAdmin}>
                    <Text style={styles.pillBadgeAdminText}>RBAC</Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}

          {/* Right Section: Role Badge, Profile & Sign Out */}
          <View style={styles.topHeaderRight}>
            <View style={styles.userBadgeWrapper}>
              <Badge
                label={user?.role === 'admin' ? 'ADMIN' : `@${user?.domain || APP_CONFIG.allowedDomain}`}
                variant={user?.role === 'admin' ? 'admin' : 'sage'}
              />
            </View>

            <View style={styles.topUserAvatarRow}>
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.topUserAvatar} />
              ) : (
                <View style={styles.topAvatarFallback}>
                  <Text style={styles.topAvatarInitial}>{firstName[0].toUpperCase()}</Text>
                </View>
              )}
              {isDesktop && (
                <Text style={styles.topUserName} numberOfLines={1}>{user?.fullName || firstName}</Text>
              )}
            </View>

            <Pressable
              onPress={signOut}
              style={({ pressed }) => [styles.topSignOutBtn, pressed && { opacity: 0.7 }]}
              accessibilityLabel="Sign out"
            >
              <Ionicons name="log-out-outline" size={16} color={THEME.colors.error} />
              {isDesktop && <Text style={styles.topSignOutText}>Sign out</Text>}
            </Pressable>
          </View>
        </View>

        {/* COLLAPSIBLE HAMBURGER DRAWER MENU */}
        {isMenuOpen && (
          <View style={styles.drawerOverlayContainer}>
            <Pressable
              style={styles.drawerBackdrop}
              onPress={() => setIsMenuOpen(false)}
              accessibilityLabel="Close navigation menu"
            />

            <View style={styles.collapsibleDrawer}>
              {/* Drawer Top Header with Brand & Close Button */}
              <View style={styles.drawerHeader}>
                <View style={styles.drawerBrandRow}>
                  <Image
                    source={hbplusLogo}
                    style={styles.drawerBrandLogo}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.drawerBrandName}>hbplus</Text>
                    <Text style={styles.drawerBrandSubtitle}>Hop with HB</Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => setIsMenuOpen(false)}
                  style={({ pressed }) => [styles.drawerCloseBtn, pressed && { opacity: 0.7 }]}
                  accessibilityLabel="Close menu"
                >
                  <Ionicons name="close" size={20} color={THEME.colors.onyx} />
                </Pressable>
              </View>

              {/* Drawer Navigation Section */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionLabel}>WORKSPACE NAVIGATION</Text>

                <View style={styles.drawerMenuList}>
                  <Pressable
                    onPress={() => {
                      setActiveTab('overview');
                      navigateTo('dashboard');
                      setIsMenuOpen(false);
                    }}
                    style={[styles.drawerMenuItem, activeTab === 'overview' && styles.drawerMenuItemActive]}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={18}
                      color={activeTab === 'overview' ? THEME.colors.terracotta : THEME.colors.textSecondary}
                      style={styles.drawerMenuIcon}
                    />
                    <Text style={[styles.drawerMenuItemText, activeTab === 'overview' && styles.drawerMenuItemTextActive]}>
                      Overview Dashboard
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setActiveTab('resources');
                      navigateTo('resources');
                      setIsMenuOpen(false);
                    }}
                    style={[styles.drawerMenuItem, activeTab === 'resources' && styles.drawerMenuItemActive]}
                  >
                    <Ionicons
                      name="folder-outline"
                      size={18}
                      color={activeTab === 'resources' ? THEME.colors.terracotta : THEME.colors.textSecondary}
                      style={styles.drawerMenuIcon}
                    />
                    <Text style={[styles.drawerMenuItemText, activeTab === 'resources' && styles.drawerMenuItemTextActive]}>
                      Resource Library
                    </Text>
                    <Badge label="14 items" variant="sage" />
                  </Pressable>

                  {user?.role === 'admin' && (
                    <Pressable
                      onPress={() => {
                        navigateTo('admin');
                        setIsMenuOpen(false);
                      }}
                      style={styles.drawerMenuItem}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={18}
                        color={THEME.colors.terracotta}
                        style={styles.drawerMenuIcon}
                      />
                      <Text style={[styles.drawerMenuItemText, { fontWeight: '700', color: THEME.colors.onyx }]}>
                        Admin Control Center
                      </Text>
                      <Badge label="RBAC" variant="admin" />
                    </Pressable>
                  )}
                </View>
              </View>

              {/* Drawer User Footer */}
              <View style={styles.drawerFooter}>
                <View style={styles.drawerUserProfileRow}>
                  {user?.avatarUrl ? (
                    <Image source={{ uri: user.avatarUrl }} style={styles.drawerUserAvatar} />
                  ) : (
                    <View style={styles.drawerAvatarFallback}>
                      <Text style={styles.drawerAvatarInitial}>{firstName[0].toUpperCase()}</Text>
                    </View>
                  )}
                  <View style={styles.drawerUserMetaCol}>
                    <Text style={styles.drawerUserName} numberOfLines={1}>{user?.fullName || firstName}</Text>
                    <Text style={styles.drawerUserRoleText}>{user?.role === 'admin' ? 'Administrator' : 'Team Member'}</Text>
                    <Text style={styles.drawerUserEmail} numberOfLines={1}>{user?.email}</Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  style={({ pressed }) => [styles.drawerSignOutBtn, pressed && { opacity: 0.7 }]}
                >
                  <Ionicons name="log-out-outline" size={16} color={THEME.colors.error} style={{ marginRight: 8 }} />
                  <Text style={styles.drawerSignOutText}>Sign out of workspace</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* MAIN DASHBOARD CONTENT AREA */}
        <View style={styles.contentArea}>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.innerContainer}>
              {activeTab === 'resources' ? (
                <ResourcesView />
              ) : (
                <>
                  {/* Header Greeting */}
                  <View style={styles.greetingHeader}>
                    <View>
                      <Text style={[styles.greetingTitle, !isDesktop && styles.greetingTitleMobile]}>
                        Welcome back, {firstName}.
                      </Text>

                    </View>

                  </View>

                  {/* HB+ LUXURY HERO CARD (From example.html) */}
                  <View style={styles.forestHeroBanner}>
                    <View style={styles.forestHeroLeft}>

                      <Text style={styles.forestHeroTitle}>Wellness That Understands Your Lifestyle.</Text>
                      <Text style={styles.forestHeroSubtitle}>
                        Real health goes beyond fitness. It lives at the intersection of body, mind, and gut.
                      </Text>
                    </View>


                  </View>

                  {/* Admin Announcement Callout (If user is Admin) */}


                  {/* CARD: GRANT ADMIN ACCESS & PERMISSIONS (Always inside the view) */}
                  <View style={styles.cardContainer}>
                    <View style={styles.cardHeaderRow}>
                      <View>
                        <Text style={styles.cardTitle}>Grant Admin Access</Text>
                      </View>

                    </View>

                    {quickAdminMsg && (
                      <View style={[styles.pwdAlertBox, quickAdminMsg.type === 'success' ? styles.quickAdminAlertSuccess : styles.pwdAlertError]}>
                        <Ionicons
                          name={quickAdminMsg.type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
                          size={16}
                          color={quickAdminMsg.type === 'success' ? THEME.colors.textPrimary : THEME.colors.error}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.pwdAlertText, quickAdminMsg.type === 'success' ? styles.quickAdminAlertTextSuccess : styles.pwdAlertTextError]}>
                          {quickAdminMsg.text}
                        </Text>
                      </View>
                    )}

                    <View style={[styles.grantAdminRow, !isDesktop && styles.grantAdminRowMobile]}>
                      <View style={styles.grantAdminInputWrapper}>
                        <Ionicons name="mail-outline" size={16} color={THEME.colors.textMuted} style={styles.pwdInputIcon} />
                        <TextInput
                          style={styles.pwdTextInput}
                          placeholder={`colleague@${APP_CONFIG.allowedDomain}`}
                          placeholderTextColor={THEME.colors.textMuted}
                          value={quickAdminEmail}
                          onChangeText={setQuickAdminEmail}
                          autoCapitalize="none"
                          keyboardType="email-address"
                        />
                      </View>
                      <Pressable
                        onPress={handleQuickGrantAdmin}
                        disabled={isQuickGranting}
                        style={({ pressed }) => [
                          styles.quickGrantBtn,
                          pressed && { opacity: 0.8 },
                          isQuickGranting && { opacity: 0.6 },
                        ]}
                      >
                        <Ionicons name="lock-closed-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.quickGrantBtnText}>
                          {isQuickGranting ? 'Granting...' : 'Grant Admin Access'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

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

                      <View style={styles.tableRow}>
                        <Text style={styles.tableLabel}>Admin privileges</Text>
                        <View style={styles.domainValueRow}>
                          <Text style={styles.tableValue}>
                            {user?.role === 'admin' ? 'Full Access' : 'Standard Access'}
                          </Text>
                          {user?.role !== 'admin' && (
                            <Pressable onPress={elevateToAdmin} style={styles.claimAdminPill}>
                              <Text style={styles.claimAdminPillText}>Claim Admin</Text>
                            </Pressable>
                          )}
                        </View>
                      </View>

                      <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.tableLabel}>Last sign-in</Text>
                        <Text style={styles.tableValue}>
                          {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Just now'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* CARD: SET WORKSPACE PASSWORD (Direct Email Login after Google OAuth) */}
                  <View style={[styles.cardContainer, !isDesktop && styles.cardContainerMobile]}>
                    <View style={[styles.cardHeaderRow, !isDesktop && styles.cardHeaderRowMobile]}>
                      <View style={styles.cardHeaderTitleCol}>
                        <Text style={[styles.cardTitle, !isDesktop && styles.cardTitleMobile]}>Set Workspace Password</Text>
                        <Text style={[styles.cardSubtitle, !isDesktop && styles.cardSubtitleMobile]}>
                          Enable direct email sign-in using your @{APP_CONFIG.allowedDomain} account.
                        </Text>
                      </View>
                      <View style={!isDesktop && styles.cardHeaderBadgeMobile}>
                        <Badge
                          label={user?.hasCustomPassword ? 'PASSWORD ACTIVE' : 'GOOGLE SSO ONLY'}
                          variant={user?.hasCustomPassword ? 'sage' : 'neutral'}
                        />
                      </View>
                    </View>

                    {pwdMessage && (
                      <View style={[styles.pwdAlertBox, pwdMessage.type === 'success' ? styles.pwdAlertSuccess : styles.pwdAlertError]}>
                        <Ionicons
                          name={pwdMessage.type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
                          size={16}
                          color={pwdMessage.type === 'success' ? THEME.colors.textPrimary : THEME.colors.error}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.pwdAlertText, pwdMessage.type === 'success' ? styles.pwdAlertTextSuccess : styles.pwdAlertTextError]}>
                          {pwdMessage.text}
                        </Text>
                      </View>
                    )}

                    <View style={[styles.pwdFormGrid, !isDesktop && styles.pwdFormGridMobile]}>
                      <View style={styles.pwdFieldCol}>
                        <Text style={styles.pwdInputLabel}>New Password</Text>
                        <View style={styles.pwdInputWrapper}>
                          <Ionicons name="key-outline" size={16} color={THEME.colors.textMuted} style={styles.pwdInputIcon} />
                          <TextInput
                            style={styles.pwdTextInput}
                            secureTextEntry={!showPwd}
                            placeholder="At least 6 characters"
                            placeholderTextColor={THEME.colors.textMuted}
                            value={newPassword}
                            onChangeText={setNewPassword}
                          />
                        </View>
                      </View>

                      <View style={styles.pwdFieldCol}>
                        <Text style={styles.pwdInputLabel}>Confirm Password</Text>
                        <View style={styles.pwdInputWrapper}>
                          <Ionicons name="lock-closed-outline" size={16} color={THEME.colors.textMuted} style={styles.pwdInputIcon} />
                          <TextInput
                            style={styles.pwdTextInput}
                            secureTextEntry={!showPwd}
                            placeholder="Re-enter password"
                            placeholderTextColor={THEME.colors.textMuted}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.pwdActionRow}>
                      <Pressable
                        onPress={() => setShowPwd(!showPwd)}
                        style={styles.showPwdToggle}
                      >
                        <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={15} color={THEME.colors.textSecondary} style={{ marginRight: 6 }} />
                        <Text style={styles.showPwdText}>{showPwd ? 'Hide' : 'Show'} Password</Text>
                      </Pressable>

                      <Pressable
                        onPress={handleSavePassword}
                        disabled={pwdLoading}
                        style={({ pressed }) => [
                          styles.savePwdBtn,
                          pressed && { opacity: 0.85 },
                          pwdLoading && { opacity: 0.6 },
                        ]}
                      >
                        {pwdLoading ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Text style={styles.savePwdBtnText}>
                            {user?.hasCustomPassword ? 'Update Password' : 'Save Workspace Password'}
                          </Text>
                        )}
                      </Pressable>
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
                          <Ionicons name="people-outline" size={18} color={THEME.colors.onyx} />
                        </View>
                        <Text style={styles.moduleTitle}>Team Directory</Text>
                        <Text style={styles.moduleDesc}>
                          View members and administrators verified on @{APP_CONFIG.allowedDomain}.
                        </Text>
                      </Pressable>

                      {/* Module 2: Resource Library */}
                      <Pressable
                        onPress={() => {
                          setActiveTab('resources');
                          navigateTo('resources');
                        }}
                        style={styles.moduleCard}
                      >
                        <View style={styles.moduleIconWrapper}>
                          <Ionicons name="folder-outline" size={18} color={THEME.colors.terracotta} />
                        </View>
                        <Text style={styles.moduleTitle}>Resource Library</Text>
                        <Text style={styles.moduleDesc}>
                          Access 14 official clinical protocols, brand kits, and security compliance handbooks.
                        </Text>
                      </Pressable>

                      {/* Module 3: Session State */}
                      <Pressable
                        onPress={signOut}
                        style={styles.moduleCard}
                      >
                        <View style={[styles.moduleIconWrapper, { backgroundColor: '#FEF2F2' }]}>
                          <Ionicons name="log-out-outline" size={18} color={THEME.colors.error} />
                        </View>
                        <Text style={styles.moduleTitle}>Terminate Session</Text>
                        <Text style={styles.moduleDesc}>
                          Securely sign out and clear active authentication tokens.
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  {/* SECTION: OUR PATHWAYS (Direct from example.html) */}
                  <View style={styles.pathwaysSection}>
                    <View style={styles.pathwayHeaderRow}>
                      <View>
                        <Text style={styles.pathwaySubheader}>THE HOLY TRIANGLE OF HEALTH</Text>
                        <Text style={styles.sectionHeader}>Our Pathways</Text>
                      </View>
                      <Text style={styles.pathwayKicker}>Integrative Wellness</Text>
                    </View>

                    <View style={[styles.pathwaysGrid, !isDesktop && styles.modulesGridMobile]}>
                      {/* Pathway 1 */}
                      <View style={styles.pathwayCard}>
                        <View style={styles.pathwayIconBox}>
                          <Ionicons name="barbell-outline" size={18} color={THEME.colors.terracotta} />
                        </View>
                        <Text style={styles.moduleTitle}>Pain Management</Text>
                        <Text style={styles.moduleDesc}>
                          Targeted physical therapy, postural correction, and chronic joint relief.
                        </Text>
                      </View>

                      {/* Pathway 2 */}
                      <View style={styles.pathwayCard}>
                        <View style={styles.pathwayIconBox}>
                          <Ionicons name="restaurant-outline" size={18} color={THEME.colors.terracotta} />
                        </View>
                        <Text style={styles.moduleTitle}>Weight Management</Text>
                        <Text style={styles.moduleDesc}>
                          Metabolic testing, sustainable nutrition, and body recomposition.
                        </Text>
                      </View>

                      {/* Pathway 3 */}
                      <View style={styles.pathwayCard}>
                        <View style={styles.pathwayIconBox}>
                          <Ionicons name="heart-outline" size={18} color={THEME.colors.terracotta} />
                        </View>
                        <Text style={styles.moduleTitle}>Pre & Post Natal</Text>
                        <Text style={styles.moduleDesc}>
                          Specialized maternal wellness, core rehab, and guided postpartum strength.
                        </Text>
                      </View>

                      {/* Pathway 4 */}
                      <View style={styles.pathwayCard}>
                        <View style={styles.pathwayIconBox}>
                          <Ionicons name="pulse-outline" size={18} color={THEME.colors.terracotta} />
                        </View>
                        <Text style={styles.moduleTitle}>Lifestyle Management</Text>
                        <Text style={styles.moduleDesc}>
                          Circadian rhythm alignment, stress resilience, and deep restorative sleep.
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}

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
    flexDirection: 'column',
  },

  // Top Header Bar with Hamburger Button
  topHeaderBar: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    zIndex: 10,
    ...THEME.shadows.sm,
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerButton: {
    width: 38,
    height: 38,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.creamDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoTop: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
  brandTextCol: {
    flexDirection: 'column',
  },
  brandNameTop: {
    fontFamily: THEME.typography.fontFamily.gilroy,
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.onyx,
    letterSpacing: -0.5,
    lineHeight: 22,
  },
  brandSubtitleTop: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    lineHeight: 11,
  },

  // Center Desktop Navigation Pills
  desktopNavPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  desktopNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.creamDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  desktopNavPillActive: {
    backgroundColor: THEME.colors.onyx,
    borderColor: THEME.colors.onyx,
  },
  desktopNavPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  desktopNavPillTextActive: {
    color: '#FFFFFF',
  },
  pillBadge: {
    backgroundColor: 'rgba(92, 107, 74, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.borderRadius.full,
    marginLeft: 6,
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.tealAccent,
  },
  pillBadgeAdmin: {
    backgroundColor: 'rgba(159, 64, 34, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.borderRadius.full,
    marginLeft: 6,
  },
  pillBadgeAdminText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.terracotta,
  },

  // Right Header Controls
  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userBadgeWrapper: {
    display: 'flex',
  },
  topUserAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  topAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.onyx,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  topAvatarInitial: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  topUserName: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    maxWidth: 120,
  },
  topSignOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 4,
  },
  topSignOutText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.error,
  },

  // Collapsible Hamburger Drawer
  drawerOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.45)',
  },
  collapsibleDrawer: {
    width: 290,
    maxWidth: '85%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: THEME.colors.cardBorder,
    padding: THEME.spacing.lg,
    justifyContent: 'space-between',
    zIndex: 1000,
    ...THEME.shadows.lg,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  drawerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerBrandLogo: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  drawerBrandName: {
    fontFamily: THEME.typography.fontFamily.gilroy,
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.onyx,
    letterSpacing: -0.5,
  },
  drawerBrandSubtitle: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  drawerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerSection: {
    flex: 1,
    paddingTop: THEME.spacing.lg,
  },
  drawerSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.terracotta,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  drawerMenuList: {
    gap: 6,
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: 'transparent',
  },
  drawerMenuItemActive: {
    backgroundColor: THEME.colors.creamDark,
  },
  drawerMenuIcon: {
    marginRight: 12,
  },
  drawerMenuItemText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  drawerMenuItemTextActive: {
    color: THEME.colors.onyx,
    fontWeight: '700',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.divider,
    paddingTop: THEME.spacing.md,
  },
  drawerUserProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  drawerUserAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  drawerAvatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.colors.onyx,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  drawerAvatarInitial: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  drawerUserMetaCol: {
    flex: 1,
  },
  drawerUserName: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  drawerUserRoleText: {
    fontSize: 11,
    color: THEME.colors.terracotta,
    fontWeight: '600',
  },
  drawerUserEmail: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  drawerSignOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  drawerSignOutText: {
    fontSize: 12,
    color: THEME.colors.error,
    fontWeight: '600',
  },

  // Main Content Area
  contentArea: {
    flex: 1,
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
    fontFamily: THEME.typography.fontFamily.serif,
    fontSize: 32,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  greetingTitleMobile: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  greetingSubtitle: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  badgeCheck: {
    color: THEME.colors.terracotta,
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Hero Banner (Official Warm Stone & Terracotta luxury styling from example.html)
  forestHeroBanner: {
    backgroundColor: THEME.colors.creamDark,
    borderRadius: THEME.borderRadius.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    padding: THEME.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.sm,
  },
  forestHeroLeft: {
    flex: 1,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.terracotta,
    marginRight: 6,
  },
  heroPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.terracotta,
    letterSpacing: 0.8,
  },
  forestHeroTitle: {
    fontFamily: THEME.typography.fontFamily.serif,
    fontSize: 28,
    fontWeight: '700',
    color: THEME.colors.onyx,
    letterSpacing: -0.5,
  },
  forestHeroSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 580,
  },
  forestHeroRight: {
    marginLeft: THEME.spacing.md,
  },
  lockBadgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.sm,
  },

  // Admin Announcement
  adminNotice: {
    backgroundColor: THEME.colors.creamDark,
    borderColor: THEME.colors.cardBorder,
    borderWidth: 1.5,
    borderRadius: THEME.borderRadius.card,
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
  adminIconBox: {
    marginRight: 12,
  },
  adminNoticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.onyx,
  },
  adminNoticeBody: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  adminNoticeBtn: {
    backgroundColor: THEME.colors.terracotta,
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

  // Elevate to Administrator Notice
  elevateNotice: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    borderWidth: 1.5,
    borderRadius: THEME.borderRadius.card,
    padding: THEME.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    flexWrap: 'wrap',
    gap: 12,
    ...THEME.shadows.sm,
  },
  elevateNoticeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 260,
  },
  elevateIconBox: {
    marginRight: 12,
  },
  elevateNoticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9A3412',
  },
  elevateNoticeBody: {
    fontSize: 12,
    color: '#C2410C',
    marginTop: 2,
    lineHeight: 17,
  },
  elevateBtn: {
    backgroundColor: THEME.colors.terracotta,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elevateBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },

  // Quick Grant Admin Row
  grantAdminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  grantAdminRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  grantAdminInputWrapper: {
    flex: 1,
    height: 44,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: THEME.colors.cardBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickGrantBtn: {
    backgroundColor: THEME.colors.onyx,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickGrantBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  quickAdminAlertSuccess: {
    backgroundColor: '#FAF8F5',
    borderColor: THEME.colors.cardBorder,
  },
  quickAdminAlertTextSuccess: {
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  claimAdminPill: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: THEME.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  claimAdminPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.terracotta,
  },

  // Account Card
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.card,
    borderColor: THEME.colors.cardBorder,
    borderWidth: 1,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.sm,
  },
  cardContainerMobile: {
    padding: THEME.spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  cardHeaderRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardHeaderTitleCol: {
    flex: 1,
    minWidth: 0,
    width: '100%',
  },
  cardTitle: {
    fontFamily: THEME.typography.fontFamily.serif,
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  cardTitleMobile: {
    fontSize: 17,
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  cardSubtitleMobile: {
    fontSize: 12,
    lineHeight: 17,
  },
  cardHeaderBadgeMobile: {
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  pwdAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 14,
    width: '100%',
    overflow: 'hidden',
  },
  pwdAlertSuccess: {
    backgroundColor: '#FAF8F5',
    borderColor: THEME.colors.cardBorder,
    borderWidth: 1,
  },
  pwdAlertError: {
    backgroundColor: THEME.colors.errorBg,
    borderColor: THEME.colors.errorBorder,
    borderWidth: 1,
  },
  pwdAlertText: {
    fontSize: 12,
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    lineHeight: 18,
  },
  pwdAlertTextSuccess: {
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  pwdAlertTextError: {
    color: THEME.colors.errorText,
    fontWeight: '600',
  },
  pwdFormGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  pwdFormGridMobile: {
    flexDirection: 'column',
  },
  pwdFieldCol: {
    flex: 1,
    gap: 5,
  },
  pwdInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  pwdInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: THEME.colors.cardBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    height: 42,
  },
  pwdInputIcon: {
    marginRight: 8,
  },
  pwdTextInput: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    outlineWidth: 0,
    height: '100%',
  },
  pwdActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 10,
  },
  showPwdToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  showPwdText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  savePwdBtn: {
    backgroundColor: THEME.colors.terracotta,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savePwdBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
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
    fontFamily: THEME.typography.fontFamily.serif,
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
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
    borderRadius: THEME.borderRadius.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    padding: THEME.spacing.md,
    ...THEME.shadows.sm,
  },
  moduleIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: THEME.colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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

  // Pathways Section (Direct from example.html)
  pathwaysSection: {
    marginTop: THEME.spacing.lg,
  },
  pathwayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  pathwaySubheader: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.terracotta,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  pathwayKicker: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  pathwaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  pathwayCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    padding: THEME.spacing.md,
    ...THEME.shadows.sm,
  },
  pathwayIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
