import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Circle from './Circle';
import Cross from './Cross';

type CellProps = {
  cell: string;
  onPress: () => void;
};

const Cell: React.FC<CellProps> = (props) => {
  const { onPress, cell } = props;
  return (
    <Pressable onPress={onPress} style={styles.cell}>
      {cell === 'o' && <Circle />}
      {cell === 'x' && <Cross />}
    </Pressable>
  );
};

export default Cell;

const styles = StyleSheet.create({
  cell: {
    width: '100%',
    height: '100%',
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
  },
});
