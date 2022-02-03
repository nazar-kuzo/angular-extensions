declare interface Array<T> {
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

declare interface String {
  hasJsonStructure(this: string): boolean;
}

declare interface Dictionary<T> {
  [index: string]: T;
}

declare interface Group<T> {
  key: T[keyof T];

  items: T[];
}

declare interface Date {
  getDayOfWeek(this: Date): number;
  asUtcDate(this: Date): Date;
  toUtcDate(this: Date): Date;
  asLocalDate(this: Date): Date;
}
