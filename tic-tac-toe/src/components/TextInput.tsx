import type { ChangeEvent } from "react";
import styles from "./TextInput.module.css";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export default function TextInput({
  label,
  value,
  onChange,
  name,
  id,
  placeholder,
  error,
  disabled,
}: TextInputProps) {
  return (
    <div className={styles["input-wrapper"]}>
      <label htmlFor={id}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <p className={styles["error-message"]}>{error}</p>}
    </div>
  );
}
