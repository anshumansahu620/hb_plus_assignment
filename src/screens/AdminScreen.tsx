import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';
import {
  getAllUserProfiles,
  updateUserRole,
  getAuditLogs,
  AuditLogEntry,
} from '../services/db';
import { UserProfile, UserRole } from '../types/auth';

const hbplusLogo = require('../../assets/hbplus-logo.png');

export const AdminScreen: React.FC = () => {
  const { user, navigateTo, signOut } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.tablet;

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [fetchedProfiles, fetchedLogs] = await Promise.all([
      getAllUserProfiles(),
      getAuditLogs(),
    ]);
    setProfiles(fetchedProfiles);
    setLogs(fetchedLogs);
  };

  const handleRoleToggle = async (targetUser: UserProfile) => {
    const nextRole: UserRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setIsUpdating(targetUser.id);
    await updateUserRole(targetUser.id, nextRole);
    await loadData();
    setIsUpdating(null);
  };

  if (user?.role !== 'admin') {
    return (
      <View style={styles.unauthorizedRoot}>
        <View style={styles.unauthorizedCard}>
          <Ionicons name="lock-closed-outline" size={44} color={THEME.colors.textMuted} style={{ marginBottom: 12 }} />
          <Text style={styles.unauthorizedTitle}>Administrator Access Required</Text>
          <Text style={styles.unauthorizedText}>
            This control center is restricted to @{APP_CONFIG.allowedDomain} administrators.
          </Text>
          <Button
            label="Return to Dashboard"
            onPress={() => navigateTo('dashboard')}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.rootWrapper}>
      {/* Top Header */}
      <View style={styles.adminHeader}>
        <View style={styles.headerBrandRow}>
          <Image
            source={hbplusLogo}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>hbplus</Text>
          <View style={{ width: 12 }} />
          <Badge label="ADMIN CONTROL CENTER" variant="admin" />
        </View>

        <View style={styles.headerActions}>
          <Button
            label="← Back to Dashboard"
            variant="outline"
            onPress={() => navigateTo('dashboard')}
            style={styles.backBtn}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          
          <View style={styles.pageTitleBlock}>
            <Text style={styles.pageTitle}>User Directory & Domain Auditing</Text>
            <Text style={styles.pageSubtitle}>
              Manage corporate identities, role privileges, and inspect real-time domain security logs.
            </Text>
          </View>

          {/* User Directory Table Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Verified Team Members</Text>
                <Text style={styles.cardSubtitle}>Accounts authorized under @{APP_CONFIG.allowedDomain}</Text>
              </View>
              <Badge label={`${profiles.length} Active`} variant="sage" />
            </View>

            <View style={styles.userList}>
              {profiles.map((item) => (
                <View key={item.id} style={styles.userRow}>
                  <View style={styles.userRowLeft}>
                    {item.avatarUrl ? (
                      <Image source={{ uri: item.avatarUrl }} style={styles.userAvatar} />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <Text style={styles.avatarInitial}>{(item.fullName || item.email)[0].toUpperCase()}</Text>
                      </View>
                    )}
                    <View style={styles.userMeta}>
                      <Text style={styles.userName}>{item.fullName || item.email.split('@')[0]}</Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                      <Text style={styles.userLoginTime}>
                        Active: {new Date(item.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.userRowRight}>
                    <Badge
                      label={item.role.toUpperCase()}
                      variant={item.role === 'admin' ? 'admin' : 'sage'}
                    />
                    {item.id !== user.id && (
                      <Pressable
                        onPress={() => handleRoleToggle(item)}
                        disabled={isUpdating === item.id}
                        style={({ pressed }) => [
                          styles.roleToggleBtn,
                          pressed && { opacity: 0.7 },
                        ]}
                      >
                        <Text style={styles.roleToggleText}>
                          {isUpdating === item.id
                            ? 'Updating...'
                            : item.role === 'admin'
                            ? 'Demote to User'
                            : 'Promote to Admin'}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Security Audit Trail Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Security Audit & Domain Interceptions</Text>
                <Text style={styles.cardSubtitle}>Real-time log of permitted @hbplus.fit logins and blocked attempts</Text>
              </View>
              <Badge label="Live Audit" variant="darkGreen" />
            </View>

            <View style={styles.logsList}>
              {logs.map((log) => (
                <View key={log.id} style={styles.logRow}>
                  <View style={styles.logRowLeft}>
                    <View
                      style={[
                        styles.logDot,
                        {
                          backgroundColor:
                            log.status === 'ALLOWED'
                              ? THEME.colors.success
                              : THEME.colors.error,
                        },
                      ]}
                    />
                    <View style={styles.logMeta}>
                      <View style={styles.logHeader}>
                        <Text style={styles.logEmail}>{log.email}</Text>
                        <Badge
                          label={log.status}
                          variant={log.status === 'ALLOWED' ? 'success' : 'danger'}
                        />
                      </View>
                      <Text style={styles.logDetails}>{log.details}</Text>
                    </View>
                  </View>

                  <Text style={styles.logTime}>
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootWrapper: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  adminHeader: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xl,
    ...THEME.shadows.sm,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.terracotta,
    marginRight: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.onyx,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  scrollContent: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
  },
  innerContainer: {
    maxWidth: 960,
    width: '100%',
  },
  pageTitleBlock: {
    marginBottom: THEME.spacing.lg,
  },
  pageTitle: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  cardTitle: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  userList: {
    gap: 10,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
    flexWrap: 'wrap',
    gap: 8,
  },
  userRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.onyx,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  userMeta: {},
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  userLoginTime: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  userRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleToggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.creamDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  roleToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  logsList: {
    gap: 10,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  logRowLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  logDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 10,
  },
  logMeta: {
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logEmail: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  logDetails: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  logTime: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginLeft: 8,
  },
  unauthorizedRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: THEME.colors.background,
  },
  unauthorizedCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: THEME.borderRadius.xl,
    alignItems: 'center',
    maxWidth: 400,
    ...THEME.shadows.md,
  },
  unauthorizedIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  unauthorizedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  unauthorizedText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
});
