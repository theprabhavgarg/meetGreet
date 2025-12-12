import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import colors from '../../theme/colors';

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  const stats = [
    { icon: 'heart', label: 'Matches', value: '0', color: colors.primary },
    { icon: 'chatbubbles', label: 'Chats', value: '0', color: colors.secondary },
    { icon: 'calendar', label: 'Meetups', value: '0', color: colors.accent },
    { icon: 'star', label: 'Stars', value: '2', color: colors.primary },
  ];

  const quickActions = [
    { icon: 'people', label: 'Find Matches', screen: 'Matches', color: colors.primary },
    { icon: 'chatbubbles', label: 'Messages', screen: 'Chats', color: colors.secondary },
    { icon: 'calendar', label: 'Plan Meetup', screen: 'Meetups', color: colors.accent },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.fullName}!</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.text} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: stat.color + '30' }]}>
            <Ionicons name={stat.icon as any} size={28} color={colors.text} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionCard}
            onPress={() => navigation.navigate(action.screen)}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon as any} size={24} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Safety Guidelines */}
      <View style={styles.safetyCard}>
        <View style={styles.safetyHeader}>
          <Ionicons name="shield-checkmark" size={24} color={colors.text} />
          <Text style={styles.safetyTitle}>Safety Guidelines</Text>
        </View>
        <Text style={styles.safetyItem}>✓ Use app chat - don't share personal contact initially</Text>
        <Text style={styles.safetyItem}>✓ Meet in well-lit, crowded public places</Text>
        <Text style={styles.safetyItem}>✓ Use app-recommended venues</Text>
        <Text style={styles.safetyItem}>✓ Use SOS button if you feel unsafe</Text>
        <Text style={styles.safetyItem}>✓ For friendships & networking, not dating</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.gray[600],
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    margin: '1.5%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  safetyCard: {
    backgroundColor: colors.accent + '50',
    margin: 24,
    padding: 20,
    borderRadius: 12,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  safetyItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default DashboardScreen;



