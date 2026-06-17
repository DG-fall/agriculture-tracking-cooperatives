import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../lib/theme';

export default function QrCode({ value, size = 200 }: { value: string; size?: number }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {[...Array(8)].map((_, r) => (
        <View key={r} style={styles.row}>
          {[...Array(8)].map((_, c) => (
            <View key={c} style={[
              styles.cell,
              (r + c) % 2 === 0 ? styles.on : styles.off,
            ]} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    borderRadius: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    margin: 1,
  },
  on: {
    backgroundColor: colors.primaryDark,
  },
  off: {
    backgroundColor: '#ffffff',
  },
});
