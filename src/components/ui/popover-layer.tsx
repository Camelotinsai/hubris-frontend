import { createContext, useContext, useMemo, type PropsWithChildren } from "react";

interface PopoverLayerContextValue {
  container: HTMLElement | null;
}

const PopoverLayerContext = createContext<PopoverLayerContextValue>({
  container: null
});

export function PopoverLayerProvider({ children }: PropsWithChildren) {
  const container = typeof document === "undefined" ? null : document.body;
  const value = useMemo(() => ({ container }), [container]);

  return <PopoverLayerContext.Provider value={value}>{children}</PopoverLayerContext.Provider>;
}

export function usePopoverLayer() {
  return useContext(PopoverLayerContext);
}
