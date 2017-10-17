export default function parseHash(hash) {
  if (hash) {
    const trimmedHash = hash.substr(1);
    const hashParts = trimmedHash.split('&');
    return hashParts.reduce((obj, hashPart) => {
      const [ key, value ] = hashPart.split('=');
      obj[key] = value;
      return obj;
    }, {});
  }
  return {};
}
