export const isExternalLink = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path);
};
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};
export const isEmptyObject = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
export const isArray = (val: unknown): val is Array<unknown> => {
  return Array.isArray(val);
};
export const isObject = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === 'object' && !isArray(val);
};
export const isString = (val: unknown): val is string => {
  return typeof val === 'string';
};
export const isNumber = (val: unknown): val is number => {
  return typeof val === 'number';
};
export const isBoolean = (val: unknown): val is boolean => {
  return typeof val === 'boolean';
};
export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function';
};
export const isUndefined = (val: unknown): val is undefined => {
  return typeof val === 'undefined';
};
export const isNull = (val: unknown): val is null => {
  return val === null;
};
export const isDate = (val: unknown): val is Date => {
  return val instanceof Date;
};
export const isRegExp = (val: unknown): val is RegExp => {
  return val instanceof RegExp;
};
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (
    isObject(val) &&
    isFunction((val as unknown as Promise<T>).then) &&
    isFunction((val as unknown as Promise<T>).catch)
  );
};
export const isSet = (val: unknown): val is Set<any> => {
  return val instanceof Set;
};
export const isMap = (val: unknown): val is Map<any, any> => {
  return val instanceof Map;
};
export const isWeakSet = (val: unknown): val is WeakSet<any> => {
  return val instanceof WeakSet;
};
export const isWeakMap = (val: unknown): val is WeakMap<any, any> => {
  return val instanceof WeakMap;
};
export const isSymbol = (val: unknown): val is Symbol => {
  return typeof val === 'symbol';
};
export const isBigInt = (val: unknown): val is BigInt => {
  return typeof val === 'bigint';
};
export const isEmptyString = (val: unknown): val is '' => {
  return isString(val) && val.trim() === '';
};
export const isNonEmptyString = (val: unknown): val is string => {
  return isString(val) && val.trim() !== '';
};
export const isPositiveNumber = (val: unknown): val is number => {
  return isNumber(val) && val > 0;
};
export const isNegativeNumber = (val: unknown): val is number => {
  return isNumber(val) && val < 0;
};
export const isNonNegativeNumber = (val: unknown): val is number => {
  return isNumber(val) && val >= 0;
};
export const isNonPositiveNumber = (val: unknown): val is number => {
  return isNumber(val) && val <= 0;
};
// 深拷贝根据传入的对象类型进行拷贝和拷贝层数
export const deepClone = <T>(obj: T): T => {
  if (isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  } else if (isObject(obj)) {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      result[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
    return result as T;
  } else {
    return obj;
  }
};
// 浅拷贝
export const shallowClone = <T>(obj: T): T => {
  if (isArray(obj)) {
    return obj.slice() as unknown as T;
  } else if (isObject(obj)) {
    return { ...obj };
  } else {
    return obj;
  }
};

// 合并两个对象，返回一个新对象，后面的对象属性会覆盖前面的对象属性
export const mergeObjects = <T, U>(obj1: T, obj2: U): T & U => {
  return { ...obj1, ...obj2 };
};

// 判断两个对象是否相等，浅比较
export const isEqual = <T = unknown, U = unknown>(
  obj1: T,
  obj2: U
): boolean => {
  if (Object.is(obj1 as unknown, obj2 as unknown)) return true;
  if (isObject(obj1) && isObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
      if (
        !isEqual(
          (obj1 as Record<string, unknown>)[key],
          (obj2 as Record<string, unknown>)[key]
        )
      ) {
        return false;
      }
    }
    return true;
  }
  if (isArray(obj1) && isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!isEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }
  return false;
};
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): F => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  } as F;
};
// 节流
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): F => {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as F;
};
// 获取对象的深层属性值
export const getDeepValue = (obj: Record<string, any>, path: string): any => {
  return path
    .split('.')
    .reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
};
