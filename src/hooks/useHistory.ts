import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((newState: T | ((prev: T) => T)) => {
    setState((prev) => {
      const actualNewState = typeof newState === 'function' ? (newState as Function)(prev) : newState;
      setPast((p) => [...p, prev].slice(-50)); // Limit to 50 steps
      setFuture([]);
      return actualNewState;
    });
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    setPast((p) => {
      const newPast = [...p];
      const previous = newPast.pop()!;
      setFuture((f) => [state, ...f]);
      setState(previous);
      return newPast;
    });
  }, [past, state]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    setFuture((f) => {
      const newFuture = [...f];
      const next = newFuture.shift()!;
      setPast((p) => [...p, state]);
      setState(next);
      return newFuture;
    });
  }, [future, state]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return { state, set, undo, redo, canUndo, canRedo };
}
