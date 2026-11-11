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
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
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

export const AdminScreen: React.FC = () => {
  const { user, navigateTo } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < THEME.breakpoints.tablet;

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

  // Route security guard: regular user cannot access Admin panel
  if (user?.role !== 'admin') {
    return (
      <View style={styles.screenWrapper}>
        <Navbar />
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedIcon}>🚫</Text>
          <Text style={styles.unauthorizedTitle}>Administrator Access Required</Text>
          <Text style={styles.unauthorizedText}>
            This page is restricted to administrators of @{APP_CONFIG.allowedDomain}.
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
    <View style={styles.screenWrapper}>
      <Navbar />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.mainContainer, isMobile ? styles.containerMobile : styles.containerDesktop]}>
          
          {/* Header */}
          <View style={styles.adminHeader}>
            <View>
              <View style={styles.badgeWrapper}>
                <Badge label="RBAC Control Center" variant="admin" />
              </View>
              <Text style={styles.pageTitle}>Admin & Domain Management</Text>
              <Text style={styles.pageSubtitle}>
                Manage authorized team accounts, roles, and real-time security audit trails.
              </Text>
            </View>
            <Button
              label="← Back to Dashboard"
              variant="outline"
              onPress={() => navigateTo('dashboard')}
            />
          </View>

          {/* User Directory Table / Card */}
          <Card
            title="Registered Team Directory"
            subtitle={`Users verified under @${APP_CONFIG.allowedDomain} with stored database profiles`}
            style={styles.sectionCard}
          >
            <View style={styles.userList}>
              {profiles.map((item) => (
                <View key={item.id} style={styles.userItem}>
                  <View style={styles.userItemLeft}>
                    {item.avatarUrl ? (
                      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                    ) : (
                      <View style={styles.avatarFallback}>
                        <Text style={styles.avatarText}>
                          {(item.fullName || item.email)[0].toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.userItemMeta}>
                      <Text style={styles.userItemName}>
                        {item.fullName || item.email.split('@')[0]}
                      </Text>
                      <Text style={styles.userItemEmail}>{item.email}</Text>
                      <Text style={styles.userItemLogin}>
                        Last active: {new Date(item.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.userItemRight}>
                    <Badge
                      label={item.role.toUpperCase()}
                      variant={item.role === 'admin' ? 'admin' : 'neutral'}
                    />
                    {item.id !== user.id && (
                      <Pressable
                        onPress={() => handleRoleToggle(item)}
                        disabled={isUpdating === item.id}
                        style={({ pressed }) => [
                          styles.roleToggleButton,
                          pressed && { opacity: 0.7 },
                        ]}
                      >
                        <Text style={styles.roleToggleText}>
                          {isUpdating === item.id
                            ? 'Saving...'
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
          </Card>

          {/* Real-Time Security Audit Logs */}
          <Card
            title="Security Audit & Domain Interceptions"
            subtitle="Logs of permitted @hbplus.fit logins and blocked non-domain attempts"
            style={styles.sectionCard}
          >
            <View style={styles.logsList}>
              {logs.map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logLeft}>
                    <View
                      style={[
                        styles.logStatusDot,
                        {
                          backgroundColor:
                            log.status === 'ALLOWED'
                              ? THEME.colors.success
                              : THEME.colors.error,
                        },
                      ]}
                    />
                    <View style={styles.logMeta}>
                      <View style={styles.logHeaderRow}>
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
          </Card>

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
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeWrapper: {
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    marginBottom: THEME.spacing.lg,
  },
  userList: {
    gap: 12,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
    flexWrap: 'wrap',
    gap: 10,
  },
  userItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userItemMeta: {},
  userItemName: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.textPrimary,
  },
  userItemEmail: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  userItemLogin: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  userItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleToggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  roleToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  logsList: {
    gap: 10,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.divider,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  logStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 10,
  },
  logMeta: {
    flex: 1,
  },
  logHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logEmail: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.textPrimary,
  },
  logDetails: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  logTime: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginLeft: 8,
  },
  unauthorizedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  unauthorizedIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  unauthorizedTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: 'bold',
    color: THEME.colors.textPrimary,
  },
  unauthorizedText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});

