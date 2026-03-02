import type { PointerPositionType } from "../utils/types";

import styles from "./MouseIndicator.module.css";

export default function MouseIndicator({
  pointerPosition,
  label,
}: {
  pointerPosition: PointerPositionType;
  label: string;
}) {
  return (
    <span
      className={styles.indicator}
      data-label={label}
      style={{ left: pointerPosition.x, top: pointerPosition.y }}
    ></span>
  );
}
