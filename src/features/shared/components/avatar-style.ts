export type AvatarBlend = {
  backgroundColor: string;
  backgroundImage: string;
};

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let value = seed;
  return () => {
    value += 0x6d2b79f5;
    let mixed = Math.imul(value ^ (value >>> 15), value | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function hue(input: number): number {
  return ((Math.round(input) % 360) + 360) % 360;
}

export function createAvatarBlend(seed: string): AvatarBlend {
  const normalizedSeed = seed.trim().toLowerCase() || "hubris";
  const rand = mulberry32(hashSeed(normalizedSeed));

  const x1 = 14 + rand() * 18;
  const y1 = 12 + rand() * 20;
  const x2 = 70 + rand() * 18;
  const y2 = 65 + rand() * 22;
  const x3 = 38 + rand() * 24;
  const y3 = 60 + rand() * 22;
  const x4 = 48 + rand() * 26;
  const y4 = 24 + rand() * 24;
  const angle = hue(190 + rand() * 140);

  const backgroundImage = [
    `radial-gradient(circle at ${x4}% ${y4}%, #3f48ff 0%, #2a38d9 36%, #19286d 100%)`,
    `radial-gradient(circle at ${x1}% ${y1}%, #00f6ff 0%, #27c9ff 34%, #1a2ca8 100%)`,
    `radial-gradient(circle at ${x2}% ${y2}%, #ff00d4 0%, #db2cff 36%, #4f2fa9 100%)`,
    `radial-gradient(circle at ${x3}% ${y3}%, #ffe600 0%, #ffb700 36%, #ff5b64 100%)`,
    `conic-gradient(from ${angle}deg at 50% 50%, #00f6ff 0deg, #3f48ff 78deg, #ff00d4 162deg, #ffe600 270deg, #00f6ff 360deg)`
  ].join(", ");

  return {
    backgroundColor: "#0b1a53",
    backgroundImage
  };
}
