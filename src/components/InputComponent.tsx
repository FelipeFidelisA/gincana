import React, { useState } from "react";

interface InputComponentProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
}) => {
  const [isLabelHovered, setIsLabelHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const styles = {
    inputGroup: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "flex-start" as const,
      marginBottom: "1rem",
      maxWidth: "400px",
      width: "100%",
      boxSizing: "border-box" as const,
      margin: "0 auto 1rem",
    },
    label: {
      fontSize: "1rem",
      color: isLabelHovered ? "#007bff" : "#555",
      marginBottom: "0.5rem",
      transition: "color 0.3s ease",
      cursor: "pointer",
      textAlign: "left" as const,
      alignSelf: "flex-start",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: `1px solid ${isInputFocused ? "#007bff" : "#ccc"}`,
      borderRadius: "5px",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      fontSize: "1rem",
      boxShadow: isInputFocused ? "0 0 5px rgba(0, 123, 255, 0.5)" : "none",
      outline: "none",
      boxSizing: "border-box" as const,
    },
  };

  return (
    <div style={styles.inputGroup}>
      <label
        htmlFor={name}
        style={styles.label}
        onMouseEnter={() => setIsLabelHovered(true)}
        onMouseLeave={() => setIsLabelHovered(false)}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        style={styles.input}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
    </div>
  );
};

export default InputComponent;
