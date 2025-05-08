import {DELIMITER} from "@/i18n";

export const truncate = (string: string, length: number = 10) => {
  if (! string) {
    return string;
  }
  return string.length > length ? string.substring(0, length) + "..." : string;
}

export const extractArrayValues = (array: any[]) => {
  return array.map(item => {
    try {
      return item["https://w3id.org/edc/v0.0.1/ns/input"][0]["https://w3id.org/edc/v0.0.1/ns/value"][0]["@value"]
    } catch (e) {
      return "";
    }
  });
}

export const joinArrayValues = (array: any[]) => {
  return extractArrayValues(array).join(DELIMITER);
}

export const pascalCase = (string: string) => {
  return string.replace(
    /\w+/g,
    (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
  ).replaceAll(' ', '');
}
