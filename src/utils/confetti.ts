import JSConfetti from "js-confetti";

const jsConfetti = new JSConfetti();

export const Confetti = {
  onDone: () => jsConfetti.addConfetti(),
  onEffect: (emoji: string) => jsConfetti.addConfetti({ emojis: [emoji] }),
};
