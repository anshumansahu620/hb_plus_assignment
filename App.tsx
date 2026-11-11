import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AdminScreen } from './src/screens/AdminScreen';
import { THEME } from './src/constants/theme';
import { APP_CONFIG } from './src/constants/config';

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, activeRoute, navigateTo } = useAuth();

  // Android Hardware Back Button Handling
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        if (activeRoute === 'admin') {
          navigateTo('dashboard');
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
    }
  }, [activeRoute, navigateTo]);

  // Loading Screen while evaluating session or OAuth redirect
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingLogoBadge}>
          <Text style={styles.loadingLogoText}>HB+</Text>
        </View>
        <ActivityIndicator
          size="large"
          color={THEME.colors.primary}
          style={styles.loadingSpinner}
        />
        <Text style={styles.loadingTitle}>{APP_CONFIG.name}</Text>
        <Text style={styles.loadingSubtitle}>
          Verifying security session & domain whitelist...
        </Text>
      </View>
    );
  }

  // Route Protection & Rendering
  // Unauthenticated users are strictly kept on LoginScreen
  if (!isAuthenticated || activeRoute === 'login') {
    return <LoginScreen />;
  }

  if (activeRoute === 'admin') {
    return <AdminScreen />;
  }

  // Default protected landing page
  return <DashboardScreen />;
};

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.background,
    padding: 24,
  },
  loadingLogoBadge: {
    width: 64,
    height: 64,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...THEME.shadows.md,
  },
  loadingLogoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 26,
    letterSpacing: 0.5,
  },
  loadingSpinner: {
    marginVertical: 12,
  },
  loadingTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.textPrimary,
  },
  loadingSubtitle: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
});
