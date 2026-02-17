import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../types/GameState';
import { Block } from '../types/Block';
import { Position } from '../types/Block';
import { initializeGame, moveBlock, eliminateMatches, checkGameOver, generateBlocksAfterNoMatch, getRandomNewBlockCount } from '../game/BoardState';
import { getReachablePositions } from '../game/PathFinder';
import { hasMatches } from '../game/BlockMatcher';
import GameBoard from '../components/GameBoard';
import ScoreBoard from '../components/ScoreBoard';
import Controls from '../components/Controls';
import GameOverDialog from '../components/GameOverDialog';
import THEME from '../styles/Theme';

const GameScreen: React.FC = () => {
  // 统计方块数量的辅助函数
  const countBlocks = (board: GameState['board']): number => {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col]) count++;
      }
    }
    return count;
  };

  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [showGameOver, setShowGameOver] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // 加载最高分
  useEffect(() => {
    loadHighScore();
    console.log('Game initialized. Blocks:', countBlocks(gameState.board));
  }, []);

  // 更新最高分
  useEffect(() => {
    if (gameState.score > gameState.highScore) {
      const newHighScore = gameState.score;
      console.log('New high score:', newHighScore);
      setGameState(prev => ({ ...prev, highScore: newHighScore }));
      saveHighScore(newHighScore);
    }
  }, [gameState.score, gameState.highScore]);

  const loadHighScore = async () => {
    try {
      const savedHighScore = await AsyncStorage.getItem('highScore');
      if (savedHighScore) {
        const highScore = parseInt(savedHighScore);
        setGameState(prev => ({ ...prev, highScore }));
        console.log('Loaded high score:', highScore);
      }
    } catch (error) {
      console.error('Failed to load high score:', error);
    }
  };

  const saveHighScore = async (score: number) => {
    try {
      await AsyncStorage.setItem('highScore', score.toString());
      console.log('Saved high score:', score);
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };

  const handleBlockPress = useCallback((block: Block) => {
    console.log('Block pressed:', block.id, 'at', block.row, block.col);

    if (gameState.gameOver) return;

    if (gameState.selectedBlock?.id === block.id) {
      // 取消选中
      console.log('Deselecting block');
      setGameState(prev => ({ ...prev, selectedBlock: null, reachablePositions: [] }));
    } else {
      // 选中方块，计算可到达位置
      const reachablePositions = getReachablePositions(gameState.board, {
        row: block.row,
        col: block.col,
      });
      console.log('Selecting block, reachable positions:', reachablePositions.length);
      setGameState(prev => ({ ...prev, selectedBlock: block, reachablePositions }));
    }
  }, [gameState]);

  const handleEmptyCellPress = useCallback((position: Position) => {
    console.log('=== handleEmptyCellPress called ===');
    console.log('Empty cell pressed at:', position.row, position.col);

    if (gameState.gameOver) return;
    if (!gameState.selectedBlock) {
      console.log('No block selected');
      return;
    }

    // 检查目标位置是否可到达
    const isReachable = gameState.reachablePositions.some(
      pos => pos.row === position.row && pos.col === position.col
    );
    if (!isReachable) {
      console.log('Position is not reachable');
      return;
    }

    console.log('Starting move operation...');
    // 执行移动
    let newState = moveBlock(gameState, {
      row: gameState.selectedBlock.row,
      col: gameState.selectedBlock.col,
    }, position);

    console.log('Block moved to:', position.row, position.col);
    console.log('Board state after move:', countBlocks(newState.board), 'blocks');

    // 检测消除
    const hadMatches = hasMatches(newState.board);
    console.log('Has matches after move:', hadMatches);

    if (hadMatches) {
      console.log('=== Eliminating matches ===');
      // 有消除，继续消除
      newState = eliminateMatches(newState);
      console.log('Board state after elimination:', countBlocks(newState.board), 'blocks');
      
      // 显示消除详情
      if (newState.eliminationDetails && newState.eliminationDetails.length > 0) {
        const colorNames = ['红色', '青色', '蓝色', '绿色', '黄色', '粉色', '紫色'];
        const detailsText = newState.eliminationDetails
          .map(d => `${colorNames[d.colorIndex]}: ${d.count}个`)
          .join(', ');
        setDebugInfo(`移动后消除\n移动: (${gameState.selectedBlock.row},${gameState.selectedBlock.col}) → (${position.row},${position.col})\n消除: ${detailsText}\n消除后方块数: ${countBlocks(newState.board)}`);
      } else {
        setDebugInfo(`移动后消除\n移动: (${gameState.selectedBlock.row},${gameState.selectedBlock.col}) → (${position.row},${position.col})\n消除后方块数: ${countBlocks(newState.board)}`);
      }
      
      setGameState(newState);
      return;
    }

    console.log('=== No matches, generating new blocks ===');
    // 无消除，生成新方块
    const newBlockCount = getRandomNewBlockCount();
    console.log('Before generating new blocks, checking for matches...');
    const hasMatchesBefore = hasMatches(newState.board);
    console.log('Has matches before generating new blocks:', hasMatchesBefore);
    
    newState = generateBlocksAfterNoMatch(newState);
    console.log('Generated new blocks:', newBlockCount);
    console.log('Board state after generation:', countBlocks(newState.board), 'blocks');

    // 生成新方块后再次检查是否有消除
    const hasMatchesAfter = hasMatches(newState.board);
    console.log('Has matches after generating new blocks:', hasMatchesAfter);

    // 如果生成新方块后有匹配，立即消除
    if (hasMatchesAfter) {
      console.log('=== New blocks created matches! Eliminating... ===');
      newState = eliminateMatches(newState);
      console.log('Board state after eliminating new blocks:', countBlocks(newState.board), 'blocks');
      
      // 显示消除详情
      if (newState.eliminationDetails && newState.eliminationDetails.length > 0) {
        const colorNames = ['红色', '青色', '蓝色', '绿色', '黄色', '粉色', '紫色'];
        const detailsText = newState.eliminationDetails
          .map(d => `${colorNames[d.colorIndex]}: ${d.count}个`)
          .join(', ');
        setDebugInfo(`生成后消除\n移动: (${gameState.selectedBlock.row},${gameState.selectedBlock.col}) → (${position.row},${position.col})\n生成方块数: ${newBlockCount}\n消除: ${detailsText}\n消除后方块数: ${countBlocks(newState.board)}`);
      } else {
        setDebugInfo(`生成后消除\n移动: (${gameState.selectedBlock.row},${gameState.selectedBlock.col}) → (${position.row},${position.col})\n生成方块数: ${newBlockCount}\n消除后方块数: ${countBlocks(newState.board)}`);
      }
    } else {
      setDebugInfo(`移动后生成\n移动: (${gameState.selectedBlock.row},${gameState.selectedBlock.col}) → (${position.row},${position.col})\n生成方块数: ${newBlockCount}\n生成后方块数: ${countBlocks(newState.board)}\n是否有匹配: ${hasMatchesAfter}`);
    }

    // 检测游戏结束
    if (checkGameOver(newState, newBlockCount)) {
      newState.gameOver = true;
      setShowGameOver(true);
      console.log('Game over!');
    }

    console.log('=== handleEmptyCellPress complete ===');
    setGameState(newState);
  }, [gameState]);

  const handleRestart = useCallback(() => {
    const newHighScore = Math.max(gameState.highScore, gameState.score);
    const newState = initializeGame();
    newState.highScore = newHighScore;
    setGameState(newState);
    setShowGameOver(false);
    console.log('Game restarted. High score:', newHighScore);
  }, [gameState.highScore, gameState.score]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>超级方块</Text>
          <Text style={styles.subtitle}>连接5个同色方块消除</Text>
        </View>

        <ScoreBoard
          score={gameState.score}
          highScore={gameState.highScore}
          combo={gameState.combo}
        />

        {/* <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>调试信息</Text>
          <Text style={styles.debugText}>{debugInfo}</Text>
        </View> */}

        <GameBoard
          board={gameState.board}
          selectedBlock={gameState.selectedBlock}
          reachablePositions={gameState.reachablePositions}
          onBlockPress={handleBlockPress}
          onEmptyCellPress={handleEmptyCellPress}
        />

        <Controls onRestart={handleRestart} />
      </ScrollView>

      <GameOverDialog
        visible={showGameOver}
        score={gameState.score}
        highScore={gameState.highScore}
        onRestart={handleRestart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: THEME.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text,
    fontFamily: THEME.fonts.bold,
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
  },
  debugPanel: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: 5,
  },
  debugText: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.textSecondary,
    fontFamily: 'monospace',
  },
});

export default GameScreen;
