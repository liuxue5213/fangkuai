import { Board } from '../types/Board';
import { Block } from '../types/Block';
import { Position } from '../types/Block';

const BOARD_SIZE = 9;
const MIN_MATCH = 5;

// 4个直线方向（横向、纵向、对角线）
const LINE_DIRECTIONS: Position[] = [
  { row: 0, col: 1 },    // 横向右
  { row: 1, col: 0 },    // 纵向下
  { row: 1, col: 1 },    // 对角线右下
  { row: 1, col: -1 },   // 对角线左下
];

// 检查某个方向的直线匹配
const findLineMatch = (
  board: Board,
  startBlock: Block,
  direction: Position
): Block[] => {
  const line: Block[] = [startBlock];
  const processedIds = new Set<string>([startBlock.id]);

  // 向前搜索
  let currentRow = startBlock.row;
  let currentCol = startBlock.col;

  while (true) {
    currentRow += direction.row;
    currentCol += direction.col;

    // 检查边界
    if (currentRow < 0 || currentRow >= BOARD_SIZE || currentCol < 0 || currentCol >= BOARD_SIZE) {
      break;
    }

    const neighborBlock = board[currentRow][currentCol];

    // 检查是否为空
    if (!neighborBlock) {
      break;
    }

    // 检查颜色是否相同
    if (neighborBlock.colorIndex !== startBlock.colorIndex) {
      break;
    }

    // 检查是否已处理
    if (processedIds.has(neighborBlock.id)) {
      break;
    }

    line.push(neighborBlock);
    processedIds.add(neighborBlock.id);
  }

  return line;
};

export const findMatches = (board: Board): Block[][] => {
  const allMatches: Block[][] = [];
  const processedIds: Set<string> = new Set();

  console.log('=== findMatches started ===');

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

      // 检查4个直线方向
      for (const direction of LINE_DIRECTIONS) {
        const line = findLineMatch(board, block, direction);

        // 如果找到 >= 5 个，加入匹配
        if (line.length >= MIN_MATCH) {
          console.log(`✅ Found line match at (${row},${col}): ${line.length} blocks, color index: ${block.colorIndex}`);
          allMatches.push(line);

          // 标记所有方块为已处理
          line.forEach(b => processedIds.add(b.id));
          break; // 找到一个匹配就跳出，避免重复
        }
      }
    }
  }

  console.log(`Total matches found: ${allMatches.length}`);
  console.log('=== findMatches complete ===');
  return allMatches;
};

export const hasMatches = (board: Board): boolean => {
  const matches = findMatches(board);
  return matches.length > 0;
};
