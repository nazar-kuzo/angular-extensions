import { startCase } from "lodash-es";

export function getEnumValues(enumType: any) {
  return Object.entries(enumType).map(([key, value]) => {
    return {
      label: startCase(key),
      value: value,
    };
  });
}
