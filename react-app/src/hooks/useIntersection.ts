import { useCallback, useEffect, useRef, useState } from "react";

interface UseIntersectionProps {
  onIntersect: () => void;
  threshold?: number;
}

function useIntersection({ onIntersect, threshold = 0.6 }: UseIntersectionProps) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        onIntersect();
      }
    },
    []
  );

  useEffect(() => {
    if (!target) {
      return;
    }

    observer.current = new IntersectionObserver(handleIntersect, { threshold });
    observer.current.observe(target);

    return () => observer && observer.current?.disconnect();
  }, [target, threshold, handleIntersect]);

  return { setTarget, observer };
}

export default useIntersection;
