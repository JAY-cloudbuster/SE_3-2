/**
 * @fileoverview Success Audio Feedback Component for AgriSahayak Frontend
 * 
 * Plays a success chime sound when called (e.g., after completing an order).
 * Silently catches errors when browser autoplay policy blocks audio.
 * 
 * @function playSuccessSound
 * @see Epic 6, Story 6.8 - Audio Cue for Successful Trade
 */
export const playSuccessSound = () => {
  const audio = new Audio('/audio/success-chime.mp3'); // Story 6.8 [cite: 287]
  audio.play().catch(e => console.log("Audio play blocked by browser"));
};