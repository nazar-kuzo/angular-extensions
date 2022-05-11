import { format, parseISO, parse, isValid } from "date-fns";

declare global {
  interface String {
    trimEnd(this: string, charList?: string): string;
  }

  interface Dictionary<T> {
    [index: string]: T;
  }

  interface Group<T> {
    key: T[keyof T];

    items: T[];
  }

  interface Date {

    /**
     * Returns zero-based index of day of week assuming that week starts with Monday
     *
     * @param this
     * @returns Local date without changing time
     */
    getDayOfWeek(this: Date): number;

    /**
     * Date wont provide Timezone information during serialization.
     *
     * @example
     *  new Date("2020-01-01T00:00:00.000+02:00").toJSON();                   // returns "2019-12-31T22:00:00.000Z"
     *  new Date("2020-01-01T00:00:00.000+02:00").withoutTimezone().toJSON(); // returns "2020-01-01T00:00:00.000"
     *
     * @param this
     * @returns UTC date keeping local time
     */
    withoutTimezone(this: Date): Date;

    /**
     * Converts local date to UTC date keeping local time
     *
     * @param this
     * @returns UTC date keeping local time
     */
    asUtcDate(this: Date): Date;

    /**
     * Converts local date to UTC date with shifted local time
     *
     * @param this
     * @returns UTC date with shifted local time
     */
    toUtcDate(this: Date): Date;

    /**
     * Converts UTC date to local date without changing time
     *
     * @param this
     * @returns Local date without changing time
     */
    asLocalDate(this: Date): Date;
  }

  function nameOf<T>(func: Func<T> | Class<T>): string;
  function nameOfFull<T>(func: Func<T>): string;
}

export type Func<T> = (obj: T) => any;
export type Class<T> = new (...params: any[]) => T;

export function nameOf<T>(func: Func<T> | Class<T>) {
  let str = func.toString();
  let classNameRegex = new RegExp(/(?:function|class) ([^ ({]+)[ ({]/);

  if (classNameRegex.test(str)) {
    return classNameRegex.exec(str)?.last() as string;
  }

  return str.match(/\.([^.;}]+)[;}]?/g)?.last().replace(".", "") as string;
}

export function nameOfFull<T>(func: Func<T>) {
  return /\.([^;}]+)[;}]?/.exec(func.toString())?.[1] as string;
}

export function overrideFunction<TIntance extends { [prop: string]: TFunc | any }, TFunc extends Function>(
  context: TIntance,
  funcProvider: (instance: TIntance) => TFunc,
  newFunc: (originalFunc: TFunc, functionContext: TIntance, ...args: any[]) => void
) {
  let functionName = nameOf<TIntance>(funcProvider);
  let originalFunction = context[functionName] as TFunc;

  (context[functionName] as any) = function (this: any, ...args: any[]) {
    let originalFuncInstance = (...newArgs: any[]) => originalFunction.call(this, ...(newArgs.length ? newArgs : args));

    return newFunc(originalFuncInstance as any, this, ...args);
  };
}

export function overrideProperty<TIntance extends { [prop: string]: TProp | any }, TProp extends Object>(
  context: TIntance,
  propertyProvider: (instance: TIntance) => TProp,
  propertyConfig: {
    get?: (originalProperty: TProp, propertyContext: TIntance) => TProp;
    set?: (originalProperty: ((value: TProp) => void) | null, propertyContext: TIntance, value: TProp) => void;
  }
) {
  let propertyName = nameOf<TIntance>(propertyProvider);

  let originalProperty = Object.getOwnPropertyDescriptor(context, propertyName) ||
    Object.getOwnPropertyDescriptor(context.__proto__, propertyName);

  let newProperty: PropertyDescriptor = Object.assign({}, originalProperty);

  if (propertyConfig.get) {
    let propertyValue = newProperty.value as TProp;

    delete newProperty.value;

    Object.assign(newProperty, {
      get() {
        return propertyConfig.get(
          originalProperty.get
            ? Object.setPrototypeOf(Object.assign({}, originalProperty), this).get()
            : propertyValue,
          context);
      },
    });
  }

  if (propertyConfig.set) {
    delete newProperty.value;
    delete newProperty.writable;

    Object.assign(newProperty, {
      set(value: TProp) {
        propertyConfig.set(
          originalProperty.set
            ? Object.setPrototypeOf(Object.assign({}, originalProperty), this).set
            : null,
          context,
          value);
      },
    });
  }

  Object.defineProperty(context, propertyName, newProperty);
}

export function isDate(date: any) {
  // avoid parsing simple ISO formats
  return typeof date == "string" &&
    (date.indexOf("T") > 0 || isValid(parse(date, "yyyy-MM-dd", new Date()))) &&
    isValid(parseISO(date));
}

export function parseDates(model: any) {
  for (let prop in model) {
    if (!model[prop]) {
      continue;
    }

    if (typeof (model[prop]) == "string") {
      parseDateProperty(model, prop);
    } else if (typeof (model[prop]) == "object") {
      parseDates(model[prop]);
    }
  }
}

export function parseDateProperty<T>(object: T, prop: keyof T) {
  let date = object[prop];

  if (typeof date == "string" && isDate(date)) {
    object[prop] = parseISO(date) as any;
  }
}

/**
 * Date wont provide Timezone information during serialization.
 *
 * @example
 *  new Date("2020-01-01T00:00:00.000+02:00").toJSON();                   // returns "2019-12-31T22:00:00.000Z"
 *  new Date("2020-01-01T00:00:00.000+02:00").withoutTimezone().toJSON(); // returns "2020-01-01T00:00:00.000"
 *
 * @param this
 * @returns UTC date keeping local time
 */
export function withoutTimezone(this: Date): Date {
  let dateWithoutTimezone = new Date(this.valueOf());

  dateWithoutTimezone.toJSON = function (this: Date, key?: any) {
    return format(this, "yyyy-MM-dd'T'HH:mm:ss");
  };

  return dateWithoutTimezone;
}

/**
 * Converts local date to UTC date keeping local time
 *
 * @param this
 * @returns UTC date keeping local time
 */
export function asUtcDate(this: Date) {
  return new Date(`${format(this, "yyyy-MM-dd'T'HH:mm:ss")}Z`);
}

/**
 * Converts local date to UTC date with shifted local time
 *
 * @param this
 * @returns UTC date with shifted local time
 */
export function toUtcDate(this: Date) {
  return new Date(this.toISOString().replace("Z", ""));
}

/**
 * Converts UTC date to local date without changing time
 *
 * @param this
 * @returns Local date without changing time
 */
export function asLocalDate(this: Date) {
  return new Date(format(this, "yyyy-MM-dd'T'HH:mm:ss"));
}

/**
 * Returns zero-based index of day of week assuming that week starts with Monday
 *
 * @param this
 * @returns Local date without changing time
 */
export function getDayOfWeek(this: Date) {
  let dayOfWeek = this.getDay();

  return dayOfWeek == 0
    ? 6
    : dayOfWeek - 1;
}

export function trimEnd(this: String, charlist = "\s") {
  return this?.replace(new RegExp("[" + charlist + "]+$"), "");
}

export function handleError(action: () => any) {
  try {
    action();
  }
  catch (error) {
    console.error(error);
  }
}


Date.prototype.getDayOfWeek = getDayOfWeek;
Date.prototype.withoutTimezone = withoutTimezone;
Date.prototype.asUtcDate = asUtcDate;
Date.prototype.toUtcDate = toUtcDate;
Date.prototype.asLocalDate = asLocalDate;
String.prototype.trimEnd = trimEnd;

window.nameOf = nameOf;
window.nameOfFull = nameOfFull;
