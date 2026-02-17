import { Board } from '../types/Board';
import { Block, Position } from '../types/Block';
import { GameState } from '../types/GameState';
import { getRandomColorIndex } from '../utils/BlockColor';
import { findMatches } from './BlockMatcher';
import { calculateScore } from './ScoreCalculator';

const BOARD_SIZE = 9;
const INITIAL_BLOCKS = 5;
const MIN_NEW_BLOCKS = 2;
const MAX_NEW_BLOCKS = 3;

// 创建空棋盘
export const createEmptyBoard = (): Board => {
  const board: Board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board.push(Array(BOARD_SIZE).fill(null));
  }
  return board;
};

// 生成方块 ID
const generateBlockId = (): string => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 获取随机空位
export const getRandomEmptyPositions = (board: Board, count: number): Position[] => {
  const emptyPositions: Position[] = [];

  // 收集所有空位
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        emptyPositions.push({ row, col });
      }
    }
  }

  // 随机选择
  const result: Position[] = [];
  const shuffled = emptyPositions.sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    result.push(shuffled[i]);
  }

  return result;
};

// 生成新方块
export const generateNewBlocks = (board: Board, count: number): { board: Board; newBlocks: Block[] } => {
  console.log('=== Generating new blocks ===');
  console.log('Requesting', count, 'new blocks');
  
  // 统计当前棋盘状态
  let currentBlockCount = 0;
  const colorCounts: Record<number, number> = {};
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col]) {
        currentBlockCount++;
        const color = board[row][col]!.colorIndex;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }
    }
  }
  console.log('Current board state:', currentBlockCount, 'blocks');
  console.log('Color distribution:', colorCounts);
  
  const newBoard = board.map(row => row.map(block => block ? { ...block } : null));
  const positions = getRandomEmptyPositions(board, count);
  const newBlocks: Block[] = [];

  console.log('Available empty positions:', positions.length);
  console.log('Selected positions:', positions);

  for (const pos of positions) {
    // 再次确认位置是空的（使用新棋盘）
    if (newBoard[pos.row][pos.col] !== null) {
      console.error('Position', pos.row, pos.col, 'is not empty! Skipping.');
      continue;
    }
    const block: Block = {
      id: generateBlockId(),
      colorIndex: getRandomColorIndex(),
      row: pos.row,
      col: pos.col,
    };
    newBoard[pos.row][pos.col] = block;
    newBlocks.push(block);
    console.log(`Generated block #${newBlocks.length}:`);
    console.log('  Position:', pos.row, pos.col);
    console.log('  Color index:', block.colorIndex);
    console.log('  Block ID:', block.id);
  }

  // 统计生成后的棋盘状态
  let newBlockCount = 0;
  const newColorCounts: Record<number, number> = {};
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (newBoard[row][col]) {
        newBlockCount++;
        const color = newBoard[row][col]!.colorIndex;
        newColorCounts[color] = (newColorCounts[color] || 0) + 1;
      }
    }
  }
  console.log('After generation:', newBlockCount, 'blocks');
  console.log('New color distribution:', newColorCounts);
  console.log('=== New blocks generation complete ===');

  return { board: newBoard, newBlocks };
};

// 初始化游戏
export const initializeGame = (): GameState => {
  const board = createEmptyBoard();
  const { board: boardWithBlocks } = generateNewBlocks(board, INITIAL_BLOCKS);

  return {
    board: boardWithBlocks,
    score: 0,
    selectedBlock: null,
    reachablePositions: [],
    gameOver: false,
    highScore: 0,
    combo: 0,
    newBlocksGenerated: false,
  };
};

// 移动方块
export const moveBlock = (state: GameState, from: Position, to: Position): GameState => {
  const block = state.board[from.row][from.col];
  if (!block) {
    return state;
  }

  console.log('=== Moving block ===');
  console.log('From position:', from.row, from.col);
  console.log('To position:', to.row, to.col);
  console.log('Block color index:', block.colorIndex);
  console.log('Block ID:', block.id);

  // 创建新棋盘
  const newBoard = state.board.map(row => row.map(b => b ? { ...b } : null));

  // 创建新的方块对象，避免修改原始对象
  const newBlock = {
    ...block,
    row: to.row,
    col: to.col,
  };

  // 更新方块位置
  newBoard[from.row][from.col] = null;
  newBoard[to.row][to.col] = newBlock;

  console.log('Block moved successfully');
  console.log('=== Move complete ===');

  return {
    ...state,
    board: newBoard,
    selectedBlock: null,
    reachablePositions: [],
    newBlocksGenerated: false,
  };
};

// 检测并消除匹配
export const eliminateMatches = (state: GameState): GameState => {
  console.log('=== Starting eliminateMatches ===');
  const matches = findMatches(state.board);

  if (matches.length === 0) {
    console.log('No matches found, returning early');
    return { ...state, combo: 0 };
  }

  console.log('Found matches:', matches.length, 'groups');
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    console.log(`Match group ${i + 1}:`, match.length, 'blocks, color:', match[0].colorIndex);
    if (match.length < 5) {
      console.error(`ERROR: Match group ${i + 1} has only ${match.length} blocks but is being eliminated!`);
    }
  }

  // 创建新棋盘
  const newBoard = state.board.map(row => row.map(b => b ? { ...b } : null));

  // 收集所有要消除的方块ID
  const blocksToRemove = new Set<string>();
  let totalScore = 0;
  const eliminationDetails: Array<{ colorIndex: number; count: number }> = [];
  
  for (const match of matches) {
    if (match.length >= 5) {
      totalScore += calculateScore(match.length);
      for (const block of match) {
        blocksToRemove.add(block.id);
      }
      // 记录消除详情
      eliminationDetails.push({
        colorIndex: match[0].colorIndex,
        count: match.length
      });
    } else {
      console.error(`ERROR: Skipping match with ${match.length} blocks (less than 5)`);
    }
  }

  console.log('Total blocks to remove:', blocksToRemove.size);
  console.log('Elimination details:', eliminationDetails);

  // 消除所有匹配的方块
  for (const blockId of blocksToRemove) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col]?.id === blockId) {
          newBoard[row][col] = null;
          console.log('Removed block:', blockId, 'at', row, col);
        }
      }
    }
  }

  // 统计剩余方块
  let remainingBlocks = 0;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (newBoard[row][col]) remainingBlocks++;
    }
  }
  console.log('Remaining blocks after elimination:', remainingBlocks);
  console.log('=== eliminateMatches complete ===');

  return {
    ...state,
    board: newBoard,
    score: state.score + totalScore,
    combo: state.combo + 1,
    eliminationDetails,
  };
};

// 检查游戏是否结束
export const checkGameOver = (state: GameState, newBlockCount: number): boolean => {
  let emptyCount = 0;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (state.board[row][col] === null) {
        emptyCount++;
      }
    }
  }

  return emptyCount < newBlockCount;
};

// 获取随机新方块数量
export const getRandomNewBlockCount = (): number => {
  return Math.floor(Math.random() * (MAX_NEW_BLOCKS - MIN_NEW_BLOCKS + 1)) + MIN_NEW_BLOCKS;
};

// 处理无消除时生成新方块
export const generateBlocksAfterNoMatch = (state: GameState): GameState => {
  const count = getRandomNewBlockCount();
  const { board: newBoard } = generateNewBlocks(state.board, count);

  return {
    ...state,
    board: newBoard,
    combo: 0,
    newBlocksGenerated: true,
  };
};
