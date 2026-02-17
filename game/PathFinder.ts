import { Board } from '../types/Board';
import { Position } from '../types/Block';

const BOARD_SIZE = 9;

// 8个方向
const DIRECTIONS: Position[] = [
  { row: -1, col: 0 },   // 上
  { row: 1, col: 0 },    // 下
  { row: 0, col: -1 },   // 左
  { row: 0, col: 1 },    // 右
];

export const findPath = (board: Board, from: Position, to: Position): Position[] | null => {
  // 如果起点和终点相同，返回空路径
  if (from.row === to.row && from.col === to.col) {
    return [];
  }

  // 如果目标位置不是空位，无法移动
  if (board[to.row][to.col] !== null) {
    return null;
  }

  // 使用 BFS 查找最短路径
  const queue: Position[] = [from];
  const visited: Set<string> = new Set();
  const parent: Map<string, Position> = new Map();

  visited.add(`${from.row},${from.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;

    // 到达目标
    if (current.row === to.row && current.col === to.col) {
      // 回溯路径
      const path: Position[] = [];
      let pos: Position | undefined = current;

      while (pos) {
        path.unshift(pos);
        pos = parent.get(`${pos.row},${pos.col}`);
      }

      // 移除起点，只返回移动路径
      return path.slice(1);
    }

    // 探索相邻位置
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

      // 检查是否可通行（空位）
      if (board[newRow][newCol] !== null) {
        continue;
      }

      // 添加到队列
      visited.add(key);
      parent.set(key, current);
      queue.push({ row: newRow, col: newCol });
    }
  }

  return null; // 无法到达
};

export const getReachablePositions = (board: Board, from: Position): Position[] => {
  const positions: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        const path = findPath(board, from, { row, col });
        if (path !== null) {
          positions.push({ row, col });
        }
      }
    }
  }

  return positions;
};
