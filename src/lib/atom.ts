import {
  selector,
  atom as recoilAtom,
  RecoilState,
  useRecoilState,
  useSetRecoilState,
  AtomEffect,
} from "recoil";

export {
  RecoilRoot as Molecule,
  useRecoilCallback as useCallback,
} from "recoil";

var key = 0;

type Getter = <Value>(atom: RecoilState<Value>) => Value;
type Setter = <Value>(
  atom: RecoilState<Value>,
  val?: Value | ((old: Value) => Value)
) => void;

export type Atom<Value> = RecoilState<Value>;

export function atom<Value>(
  read: (get: Getter) => Value | Promise<Value>,
  write: (get: Getter, set: Setter, update: any) => void | Promise<void>
): RecoilState<Value>;

export function atom<Value>(
  read: Function,
  write: (get: Getter, set: Setter, update: any) => void | Promise<void>
): RecoilState<Value>;

export function atom<Value>(
  read: Value,
  write: (get: Getter, set: Setter, update: any) => void | Promise<void>
): RecoilState<Value>;

export function atom<Value>(
  read: (get: Getter) => Value | Promise<Value>,
  write?: any
): RecoilState<Value>;

export function atom<Value>(read: Function, write?: any): RecoilState<Value>;

export function atom<Value>(
  initialValue: Value,
  write?: any,
  effects?: ReadonlyArray<AtomEffect<Value>>
): RecoilState<Value>;

export function atom<Value>(
  read: any,
  write?: any,
  effects?: ReadonlyArray<AtomEffect<Value>>
): RecoilState<Value> {
  if (write || typeof read === "function") {
    var k = key++;
    return selector({
      key: k.toString(),
      get: ({ get }) => (typeof read === "function" ? read(get) : read),
      set: write ? ({ get, set }, val) => write(get, set, val) : undefined,
    });
  } else {
    var k = key++;
    return recoilAtom({
      key: k.toString(),
      effects_UNSTABLE: effects ?? [],
      default: read,
    });
  }
}

export function atomFamily<Value>(
  read: (id: any) => (get: Getter) => Value | Promise<Value>,
  write?: (
    id: any
  ) => (get: Getter, set: Setter, update: any) => void | Promise<void>
): (param: any) => RecoilState<Value>;

export function atomFamily<Value>(
  read: (id: any) => Function,
  write?: (
    id: any
  ) => (get: Getter, set: Setter, update: any) => void | Promise<void>
): (param: string) => RecoilState<Value>;

export function atomFamily<Value>(
  read: (id: any) => Value,
  write?: (
    id: any
  ) => (get: Getter, set: Setter, update: any) => void | Promise<void>
): (param: any) => RecoilState<Value>;

export function atomFamily<Value>(
  read: (id: any) => Value,
  write?: (
    id: any
  ) => (get: Getter, set: Setter, update: any) => void | Promise<void>
): (param: any) => RecoilState<Value> {
  let cache = {};
  const func = (id: any) => {
    if (cache[id]) {
      return cache[id];
    } else {
      const lread = read(id);
      const lwrite = write ? write(id) : undefined;

      cache[id] = atom(lread, lwrite);
      return cache[id];
    }
  };

  return func;
}

export function useAtom<Value>(atom: RecoilState<Value>) {
  return useRecoilState(atom);
}

export function useUpdateAtom<Value>(atom: RecoilState<Value>) {
  return useSetRecoilState(atom);
}

export type ValueOf<T> = T extends RecoilState<infer U> ? U : null;
