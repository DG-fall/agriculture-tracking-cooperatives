import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, radius } from '@/app/lib/theme';
import { shortCode } from '@/app/lib/dakar';

// Renders a QR image for the lot's code_qr using a hosted QR generator.
// The encoded value is a deep link: traceagri://lot/<code_qr>
export default function QRGenerator({ code, size = 180 }: { code: string; size?: number }) {
  const value = `traceagri://lot/${code}`;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(value)}`;
  return (
    <View style={styles.wrap}>
      <View style={[styles.qrBox, { width: size + 24, height: size + 24 }]}>
        <Image source={{ uri: url }} style={{ width: size, height: size }} resizeMode="contain" />
      </View>
      <Text style={styles.code}>Code: {shortCode(code)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  qrBox: { backgroundColor: '#fff', borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  code: { fontSize: 13, fontWeight: '700', color: colors.textMuted, letterSpacing: 1 },
});
