import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const ProfileSetupScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  return (
    <ScrollView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>Step {step} of {totalSteps}</Text>
          <Text style={styles.progressPercent}>{(step / totalSteps * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-circle" size={80} color={colors.primary} />
        </View>
        
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Step {step}: {
            step === 1 ? 'Verification' :
            step === 2 ? 'Basic Information' :
            step === 3 ? 'Personality Assessment' :
            step === 4 ? 'Preferences' : 'Location Settings'
          }
        </Text>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Profile setup wizard will guide you through:
          </Text>
          <Text style={styles.listItem}>• Phone, Email & LinkedIn verification</Text>
          <Text style={styles.listItem}>• Profile picture and bio</Text>
          <Text style={styles.listItem}>• 10-question personality assessment</Text>
          <Text style={styles.listItem}>• Interest preferences</Text>
          <Text style={styles.listItem}>• Location preferences</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (step < totalSteps) {
              setStep(step + 1);
            } else {
              // Complete setup (implement full flow)
              alert('Profile setup complete!');
            }
          }}
        >
          <Text style={styles.buttonText}>
            {step < totalSteps ? 'Continue' : 'Complete Setup'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  progressContainer: {
    padding: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 32,
    textAlign: 'center',
  },
  placeholder: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    fontWeight: '600',
  },
  listItem: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});

export default ProfileSetupScreen;



