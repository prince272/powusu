export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseJSON(text: string | null | undefined): any | null {
  if (text === undefined || text === null) {
    return text;
  }
  try {
    return JSON.parse(text!);
  } catch (error) {
    console.warn("Parsing JSON:", error);
    return null;
  }
}

export function stringifyJSON(value: any): string | null {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn("Stringifying JSON:", error);
    return null;
  }
}
