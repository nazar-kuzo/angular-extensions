import { orderBy as lodashOrderBy } from "lodash-es";

declare global {
  interface Array<T> {
    first(this: T[]): T;
    last(this: T[]): T;
    elementAt(this: T[], index: number): T;
    distinct(this: T[]): T[];
    contains(this: T[], item: T): boolean;
    orderBy(this: T[], property: (item: T) => any): T[];
    orderByDesc(this: T[], property: (item: T) => any): T[];
    move(this: T[], from: number, to: number): T[];
    groupBy(this: T[], property: (item: T) => T[keyof T]): Group<T>[];
  }

  interface String {
    hasJsonStructure(this: string): boolean;
  }

  interface Dictionary<T> {
    [index: string]: T;
  }

  interface Group<T> {
    key: T[keyof T];

    items: T[];
  }

  interface Date {
    getDayOfWeek(this: Date): number;
    asUtcDate(this: Date): Date;
    toUtcDate(this: Date): Date;
    asLocalDate(this: Date): Date;
  }
}

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
