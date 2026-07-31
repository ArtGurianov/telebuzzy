export interface TruncateStringProps {
  value: string;
  maxLen?: number;
  cutFrom?: "middle" | "end";
}
export function truncateString({
  value,
  maxLen = 13,
  cutFrom = "end",
}: TruncateStringProps) {
  if (value.length <= maxLen) return value;
  if (cutFrom === "middle") {
    const firstPart = Math.floor(maxLen - 3) / 2;
    return value.length <= maxLen
      ? value
      : `${value.slice(0, firstPart)}...${value.slice(
          value.length - firstPart,
          value.length
        )}`;
  }
  return `${value.slice(0, maxLen - 3)}...`;
}
