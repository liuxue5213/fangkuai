import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import THEME from '../styles/Theme';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  combo: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore, combo }) => {
  return (
    <View style={[styles.container, THEME.effects.shadow.medium]}>
      <View style={styles.scoreRow}>
        <Text style={styles.label}>分数</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{score}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.scoreRow}>
        <Text style={styles.label}>最高分</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.highScore}>{highScore}</Text>
        </View>
      </View>
      {combo > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.comboRow}>
            <View style={styles.comboBadge}>
              <Text style={styles.comboText}>x{combo}</Text>
            </View>
            <Text style={styles.comboLabel}>连击</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.boardBackground,
    padding: THEME.spacing.lg,
    borderRadius: THEME.board.borderRadius,
    borderWidth: THEME.board.borderWidth,
    borderColor: THEME.colors.boardBorder,
    minWidth: 200,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
  },
  label: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  scoreContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.block.innerBorderRadius,
    minWidth: 60,
    alignItems: 'center',
  },
  score: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text,
    fontFamily: THEME.fonts.bold,
  },
  highScore: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.highlight,
    fontFamily: THEME.fonts.bold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: THEME.spacing.sm,
  },
  comboRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.sm,
  },
  comboBadge: {
    backgroundColor: THEME.colors.success,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.block.innerBorderRadius,
    marginRight: THEME.spacing.sm,
  },
  comboText: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: THEME.fonts.bold,
  },
  comboLabel: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.success,
    fontWeight: '600',
  },
});

export default ScoreBoard;
