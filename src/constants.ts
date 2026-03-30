import { Organelle, ORGANELLES } from './types';

export interface SortItem {
  id: string;
  name: string;
  type: 'plant' | 'animal' | 'both';
}

export const SORT_BANK: SortItem[] = [
  { id: 's1', name: 'Chloroplast', type: 'plant' },
  { id: 's2', name: 'Cell Wall', type: 'plant' },
  { id: 's3', name: 'Large Central Vacuole', type: 'plant' },
  { id: 's4', name: 'Fixed Rectangular Shape', type: 'plant' },
  { id: 's5', name: 'Photosynthesis', type: 'plant' },
  { id: 's6', name: 'Rigid Outer Layer', type: 'plant' },
  { id: 's7', name: 'Starch Storage', type: 'plant' },
  { id: 's8', name: 'Centrioles', type: 'animal' },
  { id: 's9', name: 'Small Temporary Vacuoles', type: 'animal' },
  { id: 's10', name: 'Irregular Shape', type: 'animal' },
  { id: 's11', name: 'Lysosomes (Common)', type: 'animal' },
  { id: 's12', name: 'Cilia', type: 'animal' },
  { id: 's13', name: 'Flagella', type: 'animal' },
  { id: 's14', name: 'Nucleus', type: 'both' },
  { id: 's15', name: 'Mitochondria', type: 'both' },
  { id: 's16', name: 'Cell Membrane', type: 'both' },
  { id: 's17', name: 'Cytoplasm', type: 'both' },
  { id: 's18', name: 'Ribosomes', type: 'both' },
  { id: 's19', name: 'DNA', type: 'both' },
  { id: 's20', name: 'RNA', type: 'both' },
  { id: 's21', name: 'Protein Synthesis', type: 'both' },
  { id: 's22', name: 'Cellular Respiration', type: 'both' },
  { id: 's23', name: 'Selective Permeability', type: 'both' },
  { id: 's24', name: 'Genetic Material', type: 'both' },
];

export interface DecodeSequence {
  hint: string;
  answer: string;
}

export const DECODE_BANK: DecodeSequence[] = [
  { hint: "I am the blueprint of life. I am a double helix.", answer: "DNA" },
  { hint: "I am the basic building block of all living things.", answer: "CELL" },
  { hint: "I am the control center of the cell (another name for nucleus).", answer: "CORE" },
  { hint: "All living things are made of one or more cells.", answer: "LIFE" },
  { hint: "I have a cell wall and chloroplasts.", answer: "PLANT" },
  { hint: "I do not have a cell wall or chloroplasts.", answer: "ANIMAL" },
  { hint: "I am the stiff outer layer of a plant cell.", answer: "WALL" },
  { hint: "Chloroplasts use sunlight to make this for the plant.", answer: "FOOD" },
  { hint: "The ultimate source of energy for all life on Earth.", answer: "SUN" },
  { hint: "The cell is the basic ____ of life.", answer: "UNIT" },
];

export interface DragFeature {
  id: string;
  name: string;
  target: 'plant' | 'animal';
}

export const DRAG_BANK: DragFeature[] = [
  { id: 'd1', name: 'Chloroplasts', target: 'plant' },
  { id: 'd2', name: 'Cell Wall', target: 'plant' },
  { id: 'd3', name: 'Large Vacuole', target: 'plant' },
  { id: 'd4', name: 'Fixed Shape', target: 'plant' },
  { id: 'd5', name: 'Plasmodesmata', target: 'plant' },
  { id: 'd6', name: 'Centrioles', target: 'animal' },
  { id: 'd7', name: 'Irregular Shape', target: 'animal' },
  { id: 'd8', name: 'Small Vacuoles', target: 'animal' },
  { id: 'd9', name: 'Lysosomes', target: 'animal' },
  { id: 'd10', name: 'Centrosomes', target: 'animal' },
  { id: 'd11', name: 'Cilia', target: 'animal' },
  { id: 'd12', name: 'Flagella', target: 'animal' },
];
