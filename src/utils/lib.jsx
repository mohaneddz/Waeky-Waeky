export const getScoreColor = (score) => {
    if (score === -1) return "text-red-500"; // No face detected
    if (score < 0.4) return "text-green-500"; // Good score
    if (score < 0.8) return "text-yellow-500"; // Average score
    return "text-red-500"; // Bad score
};