import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {};

const Cross = () => {
  return (
    <View style={styles.cross}>
      <View style={styles.crossLine} />
      <View style={[styles.crossLine, styles.crossLineReversed]} />
    </View>
  );
};

export default Cross;

const styles = StyleSheet.create({
  cross: {
    flex: 1,
  },
  crossLine: {
    position: 'absolute',
    left: '50%',
    width: 10,
    height: '100%',
    backgroundColor: 'darksalmon',
    transform: [{ rotate: '45deg' }],
    borderRadius: 5,
  },
  crossLineReversed: {
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
});
