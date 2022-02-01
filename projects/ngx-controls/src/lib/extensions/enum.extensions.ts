import { startCase } from "lodash-es";

export function getOperatorValues(operator: any) {
  return Object.entries(operator).map(([key, value]) => {
    return {
      label: startCase(key),
      value: value,
    };
  });
}
