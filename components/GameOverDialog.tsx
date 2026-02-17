import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import THEME from '../styles/Theme';

interface GameOverDialogProps {
  visible: boolean;
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({
  visible,
  score,
  highScore,
  onRestart,
}) => {
  const isNewRecord = score === highScore && score > 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            THEME.effects.shadow.large,
          ]}
        >
          <Text style={styles.title}>游戏结束</Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>你的分数</Text>
            <Text style={styles.score}>{score}</Text>
          </View>

          {isNewRecord && (
            <View style={styles.newRecordContainer}>
              <Text style={styles.newRecord}>新纪录！</Text>
            </View>
          )}

          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreLabel}>最高分</Text>
            <Text style={styles.highScore}>{highScore}</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, THEME.effects.shadow.medium]}
            onPress={onRestart}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>再玩一次</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  container: {
    backgroundColor: THEME.colors.boardBackground,
    padding: THEME.spacing.xl,
    borderRadius: THEME.board.borderRadius,
    borderWidth: THEME.board.borderWidth,
    borderColor: THEME.colors.boardBorder,
    minWidth: 280,
    alignItems: 'center',
  },
  title: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.error,
    marginBottom: THEME.spacing.lg,
    fontFamily: THEME.fonts.bold,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  scoreLabel: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.sm,
  },
  score: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text,
    fontFamily: THEME.fonts.bold,
  },
  newRecordContainer: {
    backgroundColor: THEME.colors.success,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.board.borderRadius,
    marginBottom: THEME.spacing.lg,
  },
  newRecord: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: THEME.fonts.bold,
  },
  highScoreContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: THEME.spacing.md,
    borderRadius: THEME.board.borderRadius,
    width: '100%',
  },
  highScoreLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.xs,
    textAlign: 'center',
  },
  highScore: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.highlight,
    textAlign: 'center',
    fontFamily: THEME.fonts.bold,
  },
  button: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.board.borderRadius,
    borderWidth: 2,
    borderColor: THEME.colors.primaryDark,
    marginTop: THEME.spacing.lg,
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

export default GameOverDialog;
