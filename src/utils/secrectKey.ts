import aesjs from "aes-js";

export function getKeyAndDataFromConvertedData(
  convertedData: string,
  keyLength: number
) {
  const length = keyLength / 2;
  const left = convertedData.substring(0, length);
  const right = convertedData.substring(convertedData.length - length);
  const originalData = convertedData.substring(
    length,
    convertedData.length - length
  );
  return {
    key: left + right,
    data: originalData,
  };
}

export function getDataFromRawEncrypt(
  encryptedText: string,
  secretKey: string
) {
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedText);
  const secretKeyBytes = aesjs.utils.utf8.toBytes(secretKey);

  const aesCtr = new aesjs.ModeOfOperation.ctr(
    secretKeyBytes,
    new aesjs.Counter(5)
  );
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  console.log("@@ generateUserSecretKey >> decryptedText: ", decryptedText);
}
