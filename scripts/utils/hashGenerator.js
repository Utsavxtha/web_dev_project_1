//generates a hash of the given input in HMAC/SHA256 format
export default function hashGenerator(input) {
  const hash = CryptoJS.HmacSHA256(input, "8gBm/:&EnhH.1/q");
  return CryptoJS.enc.Base64.stringify(hash);
}
