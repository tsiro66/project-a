"use client";
import { createContext, useContext } from 'react';

const AnimationContext = createContext({ canAnimate: false });

export const useAnimationReady = () => useContext(AnimationContext);
export const AnimationProvider = AnimationContext.Provider;