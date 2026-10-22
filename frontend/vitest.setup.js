// Node 22+ define un `localStorage` global que queda undefined sin --localstorage-file
// y tapa el de jsdom. Si pasa eso, usamos un Storage en memoria.
if (typeof globalThis.localStorage?.getItem !== 'function') {
  const datos = new Map()
  const storage = {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
    removeItem: (k) => datos.delete(k),
    clear: () => datos.clear(),
    key: (i) => [...datos.keys()][i] ?? null,
    get length() { return datos.size }
  }
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
}
