export const getInitials = (name: string) => {
  if (!name) return "";

  const nameParts = name
    .trim()
    .split(" ")
    .filter((part: string | any[]) => part.length > 0);

  if (nameParts.length === 1) {
    const word = nameParts[0];
    if (word.length === 1) return word.toUpperCase();
    if (word.length === 2) return word.toUpperCase();
    return word.slice(0, 2).toUpperCase();
  }

  return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
};

