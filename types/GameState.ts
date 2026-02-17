import { Block, Position } from './Block';
import { Board } from './Board';

export interface GameState {
  board: Board;
  score: number;
  selectedBlock: Block | null;
  reachablePositions: Position[];
  gameOver: boolean;
  highScore: number;
  combo: number;
  newBlocksGenerated: boolean;
  eliminationDetails?: Array<{ colorIndex: number; count: number }>;
}
