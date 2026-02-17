import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import THEME from '../styles/Theme';

interface ControlsProps {
  onRestart: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onRestart }) => {
  return (
    <TouchableOpacity
      style={[styles.button, THEME.effects.shadow.medium]}
      onPress={onRestart}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.buttonContent}>
        <Text style={styles.buttonText}>重新开始</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: THEME.spacing.lg,
  },
  button: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: Platform.OS === 'android' ? THEME.spacing.md : THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.board.borderRadius,
    borderWidth: 2,
    borderColor: THEME.colors.primaryDark,
    minWidth: Platform.OS === 'android' ? 140 : 160,
    minHeight: Platform.OS === 'android' ? 48 : 56,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.bold,
  },
});

export default Controls;
