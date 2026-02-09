export const playSuccessSound = () => {
  const audio = new Audio('/audio/success-chime.mp3'); // Story 6.8 [cite: 287]
  audio.play().catch(e => console.log("Audio play blocked by browser"));
};