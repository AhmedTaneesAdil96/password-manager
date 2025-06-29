import crypto from "crypto";

const ALGORITHM = "aes-256-cbc"; // Make sure this is the algorithm you're using
const SECRET_KEY = process.env.ENCRYPTION_KEY || ""; // Should be 32 bytes
const IV = crypto.randomBytes(16); // IV must always be 16 bytes

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), IV);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return IV.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string) {
  const [ivHex, encryptedData] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedData, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
