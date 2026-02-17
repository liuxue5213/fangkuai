import { Board } from '../types/Board';
import { Block } from '../types/Block';
import { Position } from '../types/Block';

const BOARD_SIZE = 9;
const MIN_MATCH = 5;

// 8个方向
const DIRECTIONS: Position[] = [
  { row: -1, col: 0 },   // 上
  { row: 1, col: 0 },    // 下
  { row: 0, col: -1 },   // 左
  { row: 0, col: 1 },    // 右
  { row: -1, col: -1 }, // 左上
  { row: -1, col: 1 },  // 右上
  { row: 1, col: -1 },  // 左下
  { row: 1, col: 1 },   // 右下
];

const findConnectedBlocks = (
  board: Board,
  startBlock: Block
): Block[] => {
  const connected: Block[] = [];
  const visited: Set<string> = new Set();
  const queue: Block[] = [startBlock];
  visited.add(`${startBlock.row},${startBlock.col}`);

  console.log(`Starting search from (${startBlock.row},${startBlock.col}) with color ${startBlock.colorIndex}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    connected.push(current);

    for (const dir of DIRECTIONS) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;
      const key = `${newRow},${newCol}`;

      // 检查边界
      if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
        continue;
      }

      // 检查是否已访问
      if (visited.has(key)) {
        continue;
      }

      const neighborBlock = board[newRow][newCol];

      // 检查是否为空
      if (!neighborBlock) {
        continue;
      }

      // 检查颜色是否相同
      if (neighborBlock.colorIndex === startBlock.colorIndex) {
        console.log(`  Found neighbor at (${newRow},${newCol}) with same color`);
        visited.add(key);
        queue.push(neighborBlock);
      }
    }
  }

  console.log(`Connected blocks found: ${connected.length}`);
  return connected;
};

export const findMatches = (board: Board): Block[][] => {
  const allMatches: Block[][] = [];
  const processedIds: Set<string> = new Set();

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const block = board[row][col];

      if (!block) {
        continue;
      }

      // 如果已经处理过，跳过
      if (processedIds.has(block.id)) {
        continue;
      }

      // 查找相连的同色方块
      const connected = findConnectedBlocks(board, block);

      // 标记已处理
      connected.forEach(b => processedIds.add(b.id));

      // 如果数量 >= 5，可消除
      if (connected.length >= MIN_MATCH) {
        console.log(`Found match at (${row},${col}): ${connected.length} blocks, color index: ${block.colorIndex}`);
        allMatches.push(connected);
      }
    }
  }

  console.log(`Total matches found: ${allMatches.length}`);
  return allMatches;
};

export const hasMatches = (board: Board): boolean => {
  const matches = findMatches(board);
  return matches.length > 0;
};
