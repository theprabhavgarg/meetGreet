import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const LandingScreen = ({ navigation }: any) => {
  const features = [
    {
      icon: 'shield-checkmark',
      title: '100% Verified',
      description: 'Triple verification ensures authentic profiles only',
    },
    {
      icon: 'people',
      title: 'Smart Matching',
      description: 'Advanced algorithm based on location and interests',
    },
    {
      icon: 'star',
      title: 'Safe Meetups',
      description: 'Meet at verified venues with SOS support',
    },
    {
      icon: 'hand-right',
      title: 'Real Connections',
      description: 'For friendships and networking, not dating',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>
        </View>
        <Text style={styles.title}>Connect Beyond{'\n'}Boundaries</Text>
        <Text style={styles.subtitle}>
          Find meaningful connections, professional networks, and friends for casual hangouts.
        </Text>
        <Text style={styles.tagline}>Not a dating app - it's about genuine friendships.</Text>
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Why MeetUp Network?</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: index % 2 === 0 ? colors.primary : colors.secondary }]}>
              <Ionicons name={feature.icon as any} size={28} color={colors.text} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Safety Message */}
      <View style={styles.safetyBanner}>
        <Ionicons name="shield-checkmark" size={24} color={colors.text} />
        <Text style={styles.safetyText}>
          Safety First - Triple verified profiles, SOS support, and safe meetup locations
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 18,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  tagline: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    fontStyle: 'italic',
  },
  ctaContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  featuresContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 12,
  },
  safetyText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default LandingScreen;



