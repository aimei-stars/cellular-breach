export type RoomId = 'intro' | 'organelle-match' | 'cell-sort' | 'nucleus-decode' | 'membrane-drag' | 'victory' | 'game-over';

export interface Organelle {
  id: string;
  name: string;
  function: string;
  foundIn: 'both' | 'plant' | 'animal';
  icon: string;
}

export interface GameState {
  currentRoom: RoomId;
  completedRooms: RoomId[];
  inventory: string[];
  startTime: number | null;
  endTime: number | null;
}

export const ORGANELLES: Organelle[] = [
  { id: 'nucleus', name: 'Nucleus', function: 'The control center of the cell, contains DNA.', foundIn: 'both', icon: 'Brain' },
  { id: 'mitochondria', name: 'Mitochondria', function: 'The powerhouse of the cell, produces energy (ATP).', foundIn: 'both', icon: 'Zap' },
  { id: 'chloroplast', name: 'Chloroplast', function: 'Converts sunlight into food via photosynthesis.', foundIn: 'plant', icon: 'Sun' },
  { id: 'cell-wall', name: 'Cell Wall', function: 'Provides rigid structure and protection.', foundIn: 'plant', icon: 'Shield' },
  { id: 'cell-membrane', name: 'Cell Membrane', function: 'Controls what enters and leaves the cell.', foundIn: 'both', icon: 'DoorOpen' },
  { id: 'ribosome', name: 'Ribosome', function: 'Makes proteins for the cell.', foundIn: 'both', icon: 'Hammer' },
  { id: 'vacuole', name: 'Vacuole', function: 'Stores water, nutrients, and waste.', foundIn: 'both', icon: 'Database' },
  { id: 'cytoplasm', name: 'Cytoplasm', function: 'Jelly-like substance that fills the cell.', foundIn: 'both', icon: 'Waves' },
];
