export default function parseHash(hash?: string) {
  if (hash) {
    const trimmedHash = hash.substr(1);
    const hashParts = trimmedHash.split("&");
    return hashParts.reduce<Record<string, string>>((obj, hashPart) => {
      const [key, value] = hashPart.split("=");
      obj[key] = value;
      return obj;
    }, {});
  }
  return {};
}
