import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Block as BlockType } from '../types/Block';
import { getColorByIndex } from '../utils/BlockColor';
import THEME from '../styles/Theme';

interface BlockProps {
  block: BlockType;
  size: number;
  selected?: boolean;
}

const Block: React.FC<BlockProps> = ({ block, size, selected }) => {
  const backgroundColor = getColorByIndex(block.colorIndex);
  const isSelected = selected || false;

  return (
    <View
      style={[
        styles.blockContainer,
        {
          width: size,
          height: size,
        },
        isSelected && styles.selectedContainer,
      ]}
    >
      <View
        style={[
          styles.block,
          {
            width: size - 4,
            height: size - 4,
            backgroundColor,
            borderColor: isSelected ? THEME.colors.highlight : 'transparent',
            borderWidth: isSelected ? 3 : 0,
          },
          isSelected && styles.selectedBlock,
        ]}
      >
        {isSelected && <View style={styles.selectionRing} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  blockContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedContainer: {
    transform: [{ scale: 1.1 }],
  },
  block: {
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.block,
  },
  selectedBlock: {
    shadowColor: THEME.colors.highlightGlow,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 12,
  },
  selectionRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: THEME.block.innerBorderRadius,
    borderWidth: 2,
    borderColor: THEME.colors.highlight,
    opacity: 0.5,
  },
});

export default Block;
