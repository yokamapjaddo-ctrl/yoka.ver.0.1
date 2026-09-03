import { useEffect, useState, useCallback } from 'react';

const KEY = 'yoka.favorites.v1';

export function useFavorites() {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(ids)); }, [ids]);
  const toggle = useCallback((id) => {
    setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }, []);
  return { ids, isFav: (id) => ids.includes(id), toggle, count: ids.length };
}
