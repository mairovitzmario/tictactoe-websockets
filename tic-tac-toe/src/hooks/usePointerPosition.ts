import { useEffect, useState } from "react";
import type { PointerPositionType } from "../utils/types";

export default function usePointerPosition() {
  const [pointerPosition, setPointerPosition] = useState<PointerPositionType>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      setPointerPosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener("pointermove", handleMove);

    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return pointerPosition;
}
