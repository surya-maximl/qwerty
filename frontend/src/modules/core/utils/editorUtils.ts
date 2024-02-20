export function capitalizeEveryWord(str: string): string {
  if (str===undefined || str.length === 0) {
      return str;
  }
  
  const words = str.split(" "); 
  const capitalizedWords = words.map(word => {
      if (word.length === 0) {
          return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(" ");
}