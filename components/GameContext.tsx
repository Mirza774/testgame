"use client";

import { createContext, useContext } from "react";
import type { Lang, Role, RoomState } from "@/lib/types";
import type { Path } from "@/lib/utils";

export type GameContextValue = {
  code: string;
  state: RoomState;
  role: Role;
  patch: (path: Path, value: unknown) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  muted: boolean;
  toggleMute: () => void;
  notify: (message: string) => void;
  partnerOnline: boolean;
};

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = GameContext.Provider;

export function useGame(): GameContextValue {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGame must be used inside GameProvider");
  return value;
}
