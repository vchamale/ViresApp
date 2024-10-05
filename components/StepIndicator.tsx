import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
  onStepPress?: (index: number) => void;
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepPress }) => {
  const renderStep = ({ item, index }: { item: string; index: number }) => {
    const isActive = index <= currentStep;
    const isCurrent = index === currentStep;

    return (
      <TouchableOpacity
        style={styles.stepContainer}
        onPress={() => onStepPress && onStepPress(index)}
        disabled={!onStepPress}
      >
        <View>
          <View style={[styles.circle, isActive ? styles.activeCircle : styles.inactiveCircle]}>
            <Text style={[styles.stepText, isCurrent && styles.currentStepText]}>
              {index + 1}
            </Text>
          </View>
          <Text style={styles.label}>{item}</Text>
          {index < steps.length - 1 && (
            <View style={isActive ? styles.activeLine : styles.inactiveLine} />
          )}

        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={steps}
      renderItem={renderStep}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activeCircle: {
    backgroundColor: '#4caf50',
  },
  inactiveCircle: {
    backgroundColor: '#e0e0e0',
  },
  stepText: {
    color: '#fff',
    fontSize: 16,
  },
  currentStepText: {
    fontWeight: 'bold',
  },
  label: {
    marginRight: 20,
    fontSize: 14,
    color: '#000',
  },
  activeLine: {
    height: 2,
    flex: 1,
    backgroundColor: '#4caf50',
  },
  inactiveLine: {
    height: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default StepIndicator;
