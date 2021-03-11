const hex = (value: number): string => {
  return Math.floor(value).toString(16);
};

export const objectId = (): string => {
  return (
    hex(Date.now() / 1000) +
    " ".repeat(16).replace(/./g, () => hex(Math.random() * 16))
  );
};
