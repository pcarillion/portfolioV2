declare module 'flubber' {
  export function interpolate(
    fromShape: string,
    toShape: string,
  ): (progress: number) => string;
}
