import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, useColorScheme } from 'react-native';

const SkeletonBox = ({ width, height, style }: { width: number | string; height: number; style?: object }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const scheme = useColorScheme();
  const bg = scheme === 'dark' ? '#2a2a4a' : '#ddd6f0';

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[{ width, height, backgroundColor: bg, borderRadius: 8, opacity }, style]} />;
};

export const HomeScreenSkeleton = () => {
  const scheme = useColorScheme();
  const bg = scheme === 'dark' ? '#0a0a12' : '#f8f5ff';
  const card = scheme === 'dark' ? '#14142a' : '#ffffff';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <SkeletonBox width={120} height={10} style={{ marginBottom: 8 }} />
      <SkeletonBox width={180} height={10} style={{ marginBottom: 32 }} />
      <View style={[styles.card, { backgroundColor: card }]}>
        <SkeletonBox width={220} height={48} style={{ marginBottom: 8 }} />
        <SkeletonBox width={100} height={14} style={{ marginBottom: 16 }} />
        <SkeletonBox width={60} height={24} style={{ borderRadius: 8, marginBottom: 28 }} />
        <SkeletonBox width={80} height={10} style={{ marginBottom: 12 }} />
        <SkeletonBox width={'100%' as any} height={14} style={{ marginBottom: 6 }} />
        <SkeletonBox width={'85%' as any} height={14} style={{ marginBottom: 6 }} />
        <SkeletonBox width={'65%' as any} height={14} style={{ marginBottom: 24 }} />
        <SkeletonBox width={80} height={10} style={{ marginBottom: 12 }} />
        <SkeletonBox width={'100%' as any} height={14} style={{ marginBottom: 6 }} />
        <SkeletonBox width={'75%' as any} height={14} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  card: { borderRadius: 20, padding: 24 },
});
