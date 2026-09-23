import { useRef } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { spacing } from "@/src/theme";
import { useI18n } from "@/src/i18n";
import { FrostedButton } from "@/src/components/frosted-button";
import { useAudio } from "./context";
import { AudioCard } from "./audio-card";

export function IntroListenButton({ onListen, compact = false, testID = "deep-dive-listen-ai" }:
  { onListen: () => void; compact?: boolean; testID?: string }) {
  const { t } = useI18n();
  const a = useAudio();
  if (!a.isPremium) return null;
  return <FrostedButton testID={testID} compact={compact} label={t.audio_listen_short}
    icon={a.playing ? "headset" : "headset-outline"} loading={a.buffering}
    onPress={() => { if (!a.playing) a.togglePlay(); onListen(); }} />;
}

export function InFlowAudioCard({ testID = "deep-dive-audio-player" }: { testID?: string }) {
  const ref = useRef<View>(null);
  const { cardScreenYSV, cardHeightSV, isPremium } = useAudio();
  const onLayout = (e: LayoutChangeEvent) => {
    cardHeightSV.value = e.nativeEvent.layout.height;
    ref.current?.measureInWindow((_x, y, _w, height) => {
      cardScreenYSV.value = y;
      cardHeightSV.value = height;
    });
  };
  if (!isPremium) return null;
  return <View ref={ref} onLayout={onLayout} style={{ marginTop: spacing.sm }}><AudioCard testID={testID} /></View>;
}