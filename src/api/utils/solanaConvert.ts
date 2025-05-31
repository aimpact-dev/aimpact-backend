export const solToLamports = (sol: number): number => {
  return Math.round(sol * 1e9);
}

export const lamportsToSol = (lamports: number): number => {
  return lamports / 1e9;
}