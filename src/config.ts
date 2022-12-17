/** Default configuration options. */
export const config = {
  codes: {
    konami: "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a Enter",
    starpower: "7 1 7 0 7 2 7 3 6"
  },
  confettiOptions: {
    disableForReducedMotion: true,
    spread: 360,
    startVelocity: 30,
    ticks: 60,
    zIndex: 0,
  },
  duration: 10,
  packages: {
    confetti: 'https://cdn.skypack.dev/canvas-confetti@1.6.0'
  },
  timeLimit: 1000
}