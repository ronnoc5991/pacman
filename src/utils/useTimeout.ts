export function useTimeout(callback: () => void, delay: number) {
  let startTime = Date.now();
  let timeoutId: ReturnType<typeof setTimeout>;
  let timeRemaining = delay;

  function pause() {
    if (timeoutId) clearTimeout(timeoutId);
    timeRemaining -= Date.now() - startTime;
  }

  function resume() {
    startTime = Date.now();
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, timeRemaining);
  }

  resume();

  return {
    pause,
    resume,
  };
}
