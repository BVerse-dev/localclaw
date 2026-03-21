"use client";
import React from "react";
import { Player } from "@remotion/player";
import { DashboardAnimation } from "./DashboardComposition";

export default function DashboardPlayer() {
  return (
    <Player
      component={DashboardAnimation}
      compositionWidth={520}
      compositionHeight={620}
      durationInFrames={180}
      fps={30}
      autoPlay
      loop
      style={{
        width: 520,
        height: 620,
        maxWidth: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
      controls={false}
      showVolumeControls={false}
      clickToPlay={false}
    />
  );
}
