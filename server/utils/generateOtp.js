
export function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 9000).toString();
  return otp;

}
