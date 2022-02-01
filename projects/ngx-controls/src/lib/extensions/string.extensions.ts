export function hasJsonStructure(this: string) {
  if (typeof this !== "string") {
    return false;
  }
  try {
    const result = JSON.parse(this);
    const type = Object.prototype.toString.call(result);
    return type === "[object Object]" || type === "[object Array]";
  } catch (err) {
    return false;
  }
}

String.prototype.hasJsonStructure = hasJsonStructure;
