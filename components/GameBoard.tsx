import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Block as BlockType } from '../types/Block';
import { Position } from '../types/Block';
import Block from './Block';
import THEME from '../styles/Theme';

interface GameBoardProps {
  board: (BlockType | null)[][];
  selectedBlock: BlockType | null;
  reachablePositions: Position[];
  onBlockPress: (block: BlockType) => void;
  onEmptyCellPress: (position: Position) => void;
}

const BOARD_SIZE = 9;

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedBlock,
  reachablePositions,
  onBlockPress,
  onEmptyCellPress,
}) => {
  const boardSize = THEME.board.size;
  const gap = THEME.board.gap;
  const borderWidth = THEME.board.borderWidth;
  const cellSize = (boardSize - gap * (BOARD_SIZE - 1) - borderWidth * 2) / BOARD_SIZE;

  const isReachable = (row: number, col: number): boolean => {
    return reachablePositions.some(pos => pos.row === row && pos.col === col);
  };

  return (
    <View style={styles.boardContainer}>
      <View
        style={[
          styles.board,
          {
            width: boardSize,
            height: boardSize,
          },
          THEME.effects.shadow.large,
        ]}
      >
        {board.map((row, rowIndex) => (
          <View key={`row_${rowIndex}`} style={[styles.row, rowIndex === 0 && styles.firstRow]}>
            {row.map((block, colIndex) => {
              if (block) {
                return (
                  <TouchableOpacity
                    key={block.id}
                    activeOpacity={0.8}
                    onPress={() => onBlockPress(block)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.touchable}
                  >
                    <View
                      style={[
                        styles.cell,
                        {
                          width: cellSize,
                          height: cellSize,
                          marginLeft: colIndex > 0 ? gap : 0,
                        },
                      ]}
                    >
                      <Block
                        block={block}
                        size={cellSize}
                        selected={selectedBlock?.id === block.id}
                      />
                    </View>
                  </TouchableOpacity>
                );
              } else {
                const reachable = isReachable(rowIndex, colIndex);
                return (
                  <TouchableOpacity
                    key={`empty_${rowIndex}_${colIndex}`}
                    activeOpacity={0.6}
                    onPress={() => onEmptyCellPress({ row: rowIndex, col: colIndex })}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={[
                      styles.touchable,
                      reachable && styles.reachableTouchable,
                    ]}
                  >
                    <View
                      style={[
                        styles.emptyCell,
                        {
                          width: cellSize,
                          height: cellSize,
                          marginLeft: colIndex > 0 ? gap : 0,
                        },
                        reachable && styles.reachableCell,
                      ]}
                    />
                    {reachable && <View style={styles.reachableIndicator} />}
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.lg,
  },
  board: {
    backgroundColor: THEME.colors.boardBackground,
    padding: THEME.board.gap,
    borderRadius: THEME.board.borderRadius,
    borderWidth: THEME.board.borderWidth,
    borderColor: THEME.colors.boardBorder,
  },
  row: {
    flexDirection: 'row',
    marginTop: THEME.board.gap,
  },
  firstRow: {
    marginTop: 0,
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCell: {
    backgroundColor: THEME.colors.emptyCell,
    borderRadius: THEME.block.innerBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  reachableCell: {
    backgroundColor: THEME.colors.emptyCellHover,
    borderColor: THEME.colors.highlight,
    borderWidth: 2,
  },
  reachableTouchable: {
    transform: [{ scale: 1.05 }],
  },
  reachableIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.colors.highlight,
    opacity: 0.6,
  },
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameBoard;
