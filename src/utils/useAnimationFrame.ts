export const useAnimationFrame = (
  callback: (delta: number) => void,
  autoStart: boolean = true,
): { start: () => void; stop: () => void } => {
  let previousTime: number | null = null;
  let animationFrame: number | null = null;

  const tick = (time: number) => {
    if (previousTime !== null) callback(time - previousTime);

    previousTime = time;
    animationFrame = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };

  const start = () => {
    if (animationFrame) stop();
    animationFrame = requestAnimationFrame(tick);
  };

  if (autoStart) start();

  return {
    start,
    stop
  };
};
