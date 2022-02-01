import { orderBy as lodashOrderBy } from "lodash-es";

export function first<T>(this: T[]): T {
  return this[0];
}

export function last<T>(this: T[]): T {
  return this[this.length - 1];
}

export function distinct<T>(this: T[]): T[] {
  return [...new Set<T>(this)];
}

export function contains<T>(this: T[], item: T): boolean {
  return this.indexOf(item) >= 0;
}

export function flatten<T>(array: T[], nestedArrayFunc: (item: T) => T[]): T[] {
  let result: T[] = [];

  array.forEach(item => {
    result.push(item, ...flatten(nestedArrayFunc(item) || [], nestedArrayFunc));
  });

  return result;
}

export function orderBy<T>(this: T[], property: (item: T) => any): T[] {
  return lodashOrderBy(this, property, "asc");
}

export function orderByDesc<T>(this: T[], property: (item: T) => any): T[] {
  return lodashOrderBy(this, property, "desc");
}

export function move<T>(this: T[], from: number, to: number) {
  return this.splice(to, 0, this.splice(from, 1)[0]);
}

export function groupBy<T>(this: T[], property: (item: T) => T[keyof T]): Group<T>[] {
  let map = new Map<T[keyof T], T[]>();

  this.forEach(option => {
    let group = property(option);

    if (map.has(group)) {
      map.get(group)?.push(option);
    }
    else {
      map.set(group, [option]);
    }
  });

  return Array.from(map.entries()).map(([group, items]) => {
    return {
      key: group,
      items: items,
    } as Group<T>;
  });
}

Array.prototype.first = first;
Array.prototype.last = last;
Array.prototype.distinct = distinct;
Array.prototype.contains = contains;
Array.prototype.orderBy = orderBy;
Array.prototype.orderByDesc = orderByDesc;
Array.prototype.move = move;
Array.prototype.groupBy = groupBy;
