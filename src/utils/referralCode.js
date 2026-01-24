export function generateReferralCode() {
  const prefix = "C2CR";

  const randomBlock = () =>
    Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${prefix}-${randomBlock()}-${randomBlock()}`;
}
