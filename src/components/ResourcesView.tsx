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
    iconName: 'lock-closed-outline',
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

  const categories = [
    { id: 'all', label: `All (${RESOURCES_DATA.length})` },
    { id: 'clinical', label: 'Clinical Protocols (4)' },
    { id: 'brand', label: 'Brand & Design (3)' },
    { id: 'security', label: 'Security & Access (4)' },
    { id: 'operations', label: 'Operations (3)' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>Knowledge & Operational Library</Text>
        <Text style={styles.pageSubtitle}>
          Official clinical protocols, brand toolkits, security compliance handbooks, and onboarding documentation for verified @{APP_CONFIG.allowedDomain} team members.
        </Text>
      </View>

      {/* Toast */}
      {actionToast && (
        <View style={[styles.toastBanner, actionToast.type === 'download' ? styles.toastDownload : styles.toastView]}>
          <Ionicons
            name={actionToast.type === 'download' ? 'cloud-download-outline' : 'eye-outline'}
            size={16}
            color={THEME.colors.textPrimary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.toastText}>{actionToast.message}</Text>
          <Pressable onPress={() => setActionToast(null)} style={{ padding: 4 }}>
            <Ionicons name="close" size={16} color={THEME.colors.textMuted} />
          </Pressable>
        </View>
      )}

      {/* Search & Filters */}
      <View style={styles.controls}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={16} color={THEME.colors.textMuted} style={{ marginRight: 8 }} />
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

        <View style={styles.filterPillsRow}>
          {categories.map(cat => {
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

      {/* Grid */}
      <View style={[styles.resourcesGrid, !isDesktop && styles.resourcesGridMobile]}>
        {filteredResources.map(item => (
          <View key={item.id} style={styles.resourceCard}>
            <Text style={styles.categoryText}>{item.categoryLabel}</Text>
            <Text style={styles.resourceTitle}>{item.title}</Text>
            <Text style={styles.resourceDesc}>{item.description}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.metaText}>
                {item.format} · {item.size} · {item.updatedAt}
              </Text>

              <View style={styles.actionButtonsRow}>
                <Pressable
                  onPress={() => handleAction(item, 'view')}
                  style={({ pressed }) => [styles.actionBtn, styles.actionBtnOutline, pressed && { opacity: 0.7 }]}
                >
                  <Ionicons name="eye-outline" size={14} color={THEME.colors.textPrimary} style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnTextOutline}>Preview</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleAction(item, 'download')}
                  style={({ pressed }) => [styles.actionBtn, styles.actionBtnPrimary, pressed && { opacity: 0.85 }]}
                >
                  <Ionicons name="download-outline" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnTextPrimary}>Download</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        {filteredResources.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={32} color={THEME.colors.textMuted} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No matching resources found</Text>
            <Text style={styles.emptySubtitle}>Try a different keyword or select another category.</Text>
          </View>
        )}
      </View>

      {/* Footer Notice */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  // Header
  headerBlock: {
    marginBottom: THEME.spacing.xl,
  },
  pageTitle: {
    fontFamily: THEME.typography.fontFamily.serif,
    fontSize: 28,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 640,
  },

  // Toast
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
  },
  toastView: {
    backgroundColor: '#FAF8F5',
    borderColor: THEME.colors.cardBorder,
  },
  toastDownload: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  toastText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: THEME.colors.textPrimary,
  },

  // Controls
  controls: {
    marginBottom: THEME.spacing.xl,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    backgroundColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: THEME.colors.onyx,
    borderColor: THEME.colors.onyx,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '500',
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
    padding: 20,
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  resourceTitle: {
    fontFamily: THEME.typography.fontFamily.serif,
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 23,
    marginBottom: 8,
  },
  resourceDesc: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  cardFooter: {
    gap: 14,
  },
  metaText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: THEME.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  actionBtnPrimary: {
    backgroundColor: THEME.colors.terracotta,
  },
  actionBtnTextOutline: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  actionBtnTextPrimary: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Empty state
  emptyCard: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },

  // Footer notice
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: THEME.borderRadius.card,
    backgroundColor: THEME.colors.creamDark,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.onyx,
    marginBottom: 4,
  },
  noticeDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
});