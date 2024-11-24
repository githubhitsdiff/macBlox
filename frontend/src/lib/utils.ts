import { type ClassValue, clsx } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  { y = -8, x = 0, start = 0.95, duration = 150 }: FlyAndScaleParams = {}
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;

  // Convert scale from one range to another
  const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]): number => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;
    const percentage = (valueA - minA) / (maxA - minA);
    return percentage * (maxB - minB) + minB;
  };

  // Convert style object to string
  const styleToString = (style: Record<string, string | number | undefined>): string => {
    return Object.entries(style)
      .filter(([_, value]) => value !== undefined) // Filter out undefined values
      .map(([key, value]) => `${key}:${value};`) // Map to CSS string format
      .join('');
  };

  return {
    duration,
    delay: 0,
    css: (t) => {
      const yTransform = scaleConversion(t, [0, 1], [y, 0]);
      const xTransform = scaleConversion(t, [0, 1], [x, 0]);
      const scale = scaleConversion(t, [0, 1], [start, 1]);

      return styleToString({
        transform: `${transform} translate3d(${xTransform}px, ${yTransform}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};
