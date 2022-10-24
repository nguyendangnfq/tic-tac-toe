import React from 'react';
import { StyleSheet, View } from 'react-native';

const Circle: React.FC = () => {
  return <View style={styles.circle} />;
};

export default Circle;

const styles = StyleSheet.create({
  circle: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: '#242D34',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderColor: 'aquamarine',
    borderWidth: 10,
  },
});
