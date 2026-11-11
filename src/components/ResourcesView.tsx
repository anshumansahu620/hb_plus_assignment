import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from './Badge';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: 'clinical' | 'brand' | 'security' | 'operations';
  categoryLabel: string;
  format: 'PDF' | 'DOCX' | 'ZIP' | 'FIG' | 'CAL';
  size: string;
  updatedAt: string;
  iconName: keyof typeof Ionicons.glyphMap;
  featured?: boolean;
}

const RESOURCES_DATA: ResourceItem[] = [
  // Clinical Protocols
  {
    id: 'res-1',
    title: 'Gut-Brain Axis Assessment Framework v2.4',
    description: 'Standard diagnostic protocol evaluating microbiome health, stress biomarkers, and cognitive fatigue in performance clients.',
    category: 'clinical',
    categoryLabel: 'Clinical Protocol',
    format: 'PDF',
    size: '4.2 MB',
    updatedAt: 'Updated 3 days ago',
    iconName: 'fitness-outline',
    featured: true,
  },
  {
    id: 'res-2',
    title: 'Biomechanics & Postural Restoration SOP',
    description: 'Kinetic chain assessment methodologies, joint angle protocols, and corrective movement prescriptions.',
    category: 'clinical',
    categoryLabel: 'Clinical Protocol',
    format: 'PDF',
    size: '8.1 MB',
    updatedAt: 'Updated last week',
    iconName: 'body-outline',
  },
  {
    id: 'res-3',
    title: 'Prenatal & Postnatal Movement Guidelines',
    description: 'Trimester-by-trimester exercise safety criteria, pelvic floor rehabilitation framework, and contraindicated exercises.',
    category: 'clinical',
    categoryLabel: 'Clinical Protocol',
    format: 'DOCX',
    size: '1.6 MB',
    updatedAt: 'Updated 2 weeks ago',
    iconName: 'heart-outline',
  },
  {
    id: 'res-4',
    title: 'Circadian Nutrition & Fasting Protocols',
    description: 'Tailored macronutrient partitioning, sleep chronotype alignment, and cellular recovery nutrition standards.',
    category: 'clinical',
    categoryLabel: 'Clinical Protocol',
    format: 'PDF',
    size: '5.5 MB',
    updatedAt: 'Updated Oct 2026',
    iconName: 'nutrition-outline',
  },

  // Brand & Design
  {
    id: 'res-5',
    title: 'Hop with HB Brand Identity Guidelines v2.4',
    description: 'Official color palettes (Warm Linen, Onyx, Terracotta), typography rules for The Seasons & Gilroy, and visual layouts.',
    category: 'brand',
    categoryLabel: 'Brand Toolkit',
    format: 'PDF',
    size: '12.4 MB',
    updatedAt: 'Master Brand Kit',
    iconName: 'color-palette-outline',
    featured: true,
  },
  {
    id: 'res-6',
    title: 'Official Vector Logo & Asset Suite',
    description: 'Production vector SVGs, high-resolution transparent PNGs, and responsive favicons for official corporate usage.',
    category: 'brand',
    categoryLabel: 'Brand Toolkit',
    format: 'ZIP',
    size: '24.8 MB',
    updatedAt: 'Updated Nov 2026',
    iconName: 'image-outline',
  },
  {
    id: 'res-7',
    title: 'Typography & Design System Figma Tokens',
    description: 'Pre-linked component library, spacing scales, and UI tokens used across the HB+ digital ecosystem.',
    category: 'brand',
    categoryLabel: 'Brand Toolkit',
    format: 'FIG',
    size: '6.8 MB',
    updatedAt: 'Updated 2 weeks ago',
    iconName: 'layers-outline',
  },

  // Security & Compliance
  {
    id: 'res-8',
    title: 'Corporate Domain & Google OAuth Security Policy',
    description: 'Mandatory authentication governance, @hbplus.fit domain whitelisting, and SSO access management procedures.',
    category: 'security',
    categoryLabel: 'Security & Access',
    format: 'PDF',
    size: '850 KB',
    updatedAt: 'Active Security Standard',
    iconName: 'shield-checkmark-outline',
    featured: true,
  },
  {
    id: 'res-9',
    title: 'Client Data Privacy & HIPAA Compliance Manual',
    description: 'Medical confidentiality protocols, encrypted record keeping requirements, and legal compliance guidelines.',
    category: 'security',
    categoryLabel: 'Security & Access',
    format: 'PDF',
    size: '2.1 MB',
    updatedAt: 'Mandatory Compliance',
    iconName: 'lock-closed-outline',
  },
  {
    id: 'res-10',
    title: 'Role-Based Access Control (RBAC) Governance',
    description: 'Privilege elevation policies, Administrator credentials oversight, and audit log inspection cadence.',
    category: 'security',
    categoryLabel: 'Security & Access',
    format: 'PDF',
    size: '1.4 MB',
    updatedAt: 'Updated this month',
    iconName: 'key-outline',
  },
  {
    id: 'res-11',
    title: 'IT Incident Response & Escalation Matrix',
    description: 'Emergency security contacts, on-call protocol for it-support@hbplus.fit, and zero-day containment procedures.',
    category: 'security',
    categoryLabel: 'Security & Access',
    format: 'DOCX',
    size: '940 KB',
    updatedAt: 'Updated 1 week ago',
    iconName: 'alert-circle-outline',
  },

  // Team Operations
  {
    id: 'res-12',
    title: 'HB+ New Team Member Welcome Handbook',
    description: 'Complete onboarding roadmap, corporate culture values, tool setup guide, and key stakeholder directories.',
    category: 'operations',
    categoryLabel: 'Team Operations',
    format: 'PDF',
    size: '3.4 MB',
    updatedAt: 'Updated this month',
    iconName: 'people-outline',
  },
  {
    id: 'res-13',
    title: 'Internal Communication & Slack Taxonomy',
    description: 'Channel directory, asynchronous communication standards, meeting etiquette, and daily team check-in rituals.',
    category: 'operations',
    categoryLabel: 'Team Operations',
    format: 'PDF',
    size: '1.1 MB',
    updatedAt: 'Updated 3 weeks ago',
    iconName: 'chatbubbles-outline',
  },
  {
    id: 'res-14',
    title: 'Bi-Weekly Clinical Grand Rounds Schedule',
    description: 'Roster of multidisciplinary case study reviews, guest speaker presentations, and team peer evaluations.',
    category: 'operations',
    categoryLabel: 'Team Operations',
    format: 'CAL',
    size: '320 KB',
    updatedAt: 'Q4 2026 Schedule',
    iconName: 'calendar-outline',
  },
];

type CategoryFilter = 'all' | 'clinical' | 'brand' | 'security' | 'operations';

export const ResourcesView: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= THEME.breakpoints.tablet;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [actionToast, setActionToast] = useState<{ message: string; type: 'view' | 'download' } | null>(null);

  // Filtered resources based on search and category
  const filteredResources = useMemo(() => {
    return RESOURCES_DATA.filter(item => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleAction = (item: ResourceItem, action: 'view' | 'download') => {
    if (action === 'view') {
      setActionToast({
        message: `Previewing "${item.title}" (${item.format})...`,
        type: 'view',
      });
    } else {
      setActionToast({
        message: `Downloading "${item.title}" (${item.format} • ${item.size})...`,
        type: 'download',
      });
    }

    setTimeout(() => {
      setActionToast(null);
    }, 4000);
  };

  return (
    <View style={styles.container}>
      {/* Page Header */}
      <View style={styles.headerBlock}>
        <View style={styles.kickerRow}>
          <View style={styles.kickerDot} />
          <Text style={styles.kickerText}>HB+ CORPORATE RESOURCE CENTER</Text>
        </View>
        <Text style={styles.pageTitle}>Knowledge & Operational Library</Text>
        <Text style={styles.pageSubtitle}>
          Official clinical protocols, brand toolkits, security compliance handbooks, and onboarding documentation for verified @{APP_CONFIG.allowedDomain} team members.
        </Text>
      </View>

      {/* Action Toast Alert */}
      {actionToast && (
        <View style={[styles.toastBanner, actionToast.type === 'download' ? styles.toastDownload : styles.toastView]}>
          <Ionicons
            name={actionToast.type === 'download' ? 'cloud-download-outline' : 'eye-outline'}
            size={18}
            color={THEME.colors.textPrimary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.toastText}>{actionToast.message}</Text>
          <Pressable onPress={() => setActionToast(null)} style={{ padding: 4 }}>
            <Ionicons name="close" size={16} color={THEME.colors.textMuted} />
          </Pressable>
        </View>
      )}

      {/* Search and Category Filters */}
      <View style={styles.controlsCard}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color={THEME.colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search protocols, brand guidelines, security SOPs..."
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={16} color={THEME.colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Category Filter Pills */}
        <View style={styles.filterPillsRow}>
          {[
            { id: 'all', label: `All (${RESOURCES_DATA.length})` },
            { id: 'clinical', label: 'Clinical Protocols (4)' },
            { id: 'brand', label: 'Brand & Design (3)' },
            { id: 'security', label: 'Security & Access (4)' },
            { id: 'operations', label: 'Operations (3)' },
          ].map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id as CategoryFilter)}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Resources Grid */}
      <View style={[styles.resourcesGrid, !isDesktop && styles.resourcesGridMobile]}>
        {filteredResources.map(item => (
          <View key={item.id} style={styles.resourceCard}>
            {/* Card Header: Icon & Badges */}
            <View style={styles.cardTopRow}>
              <View style={styles.resourceIconBox}>
                <Ionicons name={item.iconName} size={20} color={THEME.colors.terracotta} />
              </View>
              <View style={styles.badgeGroup}>
                <Badge
                  label={item.format}
                  variant={item.format === 'PDF' ? 'primary' : 'sage'}
                />
                <Badge
                  label={item.category.toUpperCase()}
                  variant={item.category === 'security' ? 'admin' : 'neutral'}
                />
              </View>
            </View>

            {/* Card Body */}
            <Text style={styles.resourceTitle}>{item.title}</Text>
            <Text style={styles.resourceDesc}>{item.description}</Text>

            {/* Card Footer: Metadata & Action Buttons */}
            <View style={styles.cardFooter}>
              <View style={styles.metaRow}>
                <Text style={styles.metaSize}>{item.size}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaUpdated}>{item.updatedAt}</Text>
              </View>

              <View style={styles.actionButtonsRow}>
                <Pressable
                  onPress={() => handleAction(item, 'view')}
                  style={({ pressed }) => [styles.actionBtn, styles.actionBtnOutline, pressed && { opacity: 0.7 }]}
                >
                  <Ionicons name="eye-outline" size={13} color={THEME.colors.textPrimary} style={{ marginRight: 4 }} />
                  <Text style={styles.actionBtnTextOutline}>Preview</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleAction(item, 'download')}
                  style={({ pressed }) => [styles.actionBtn, styles.actionBtnPrimary, pressed && { opacity: 0.85 }]}
                >
                  <Ionicons name="download-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.actionBtnTextPrimary}>Download</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        {filteredResources.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={36} color={THEME.colors.textMuted} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>No matching resources found</Text>
            <Text style={styles.emptySubtitle}>Try searching for a different keyword or select another category filter.</Text>
          </View>
        )}
      </View>

      {/* Compliance & Verification Hub Banner */}
      <View style={styles.complianceCard}>
        <View style={styles.complianceContent}>
          <Ionicons name="shield-checkmark" size={24} color={THEME.colors.terracotta} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.complianceTitle}>Official Corporate Knowledge Repository</Text>
            <Text style={styles.complianceDesc}>
              All materials hosted in this portal are proprietary assets of Hop with HB (`hbplus.fit`). Distribution outside the corporate domain without administrator approval is strictly prohibited.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerBlock: {
    marginBottom: THEME.spacing.lg,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  kickerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.terracotta,
    marginRight: 6,
  },
  kickerText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.terracotta,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontFamily: THEME.typography.fontFamily.serif,
    fontSize: 30,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    lineHeight: 21,
    maxWidth: 720,
  },

  // Toast Banner
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    ...THEME.shadows.sm,
  },
  toastView: {
    backgroundColor: '#FAF5FF',
    borderColor: '#DDD6FE',
  },
  toastDownload: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  toastText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },

  // Controls Card
  controlsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.sm,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: THEME.colors.cardBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    outlineWidth: 0,
    height: '100%',
  },
  filterPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.creamDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  filterPillActive: {
    backgroundColor: THEME.colors.onyx,
    borderColor: THEME.colors.onyx,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // Grid
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: THEME.spacing.xl,
  },
  resourcesGridMobile: {
    flexDirection: 'column',
  },
  resourceCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    padding: THEME.spacing.md,
    justifyContent: 'space-between',
    ...THEME.shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  resourceTitle: {
    fontFamily: THEME.typography.fontFamily.serif,
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  resourceDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.divider,
    paddingTop: 10,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaSize: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  metaDot: {
    marginHorizontal: 5,
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  metaUpdated: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 34,
    borderRadius: THEME.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutline: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  actionBtnPrimary: {
    backgroundColor: THEME.colors.terracotta,
  },
  actionBtnTextOutline: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  actionBtnTextPrimary: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Empty state
  emptyCard: {
    width: '100%',
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },

  // Compliance Hub
  complianceCard: {
    backgroundColor: THEME.colors.creamDark,
    borderRadius: THEME.borderRadius.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    padding: THEME.spacing.lg,
    ...THEME.shadows.sm,
  },
  complianceContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  complianceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.onyx,
    marginBottom: 4,
  },
  complianceDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
});

