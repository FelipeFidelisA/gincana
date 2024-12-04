import React, { useState } from "react";
import "./InputComponent.css";

interface InputComponentProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  children?: React.ReactNode; // Para permitir a inserção de ícones ou outros elementos
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  children,
}) => {
  const [isLabelHovered, setIsLabelHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <div className="input-group">
      <label
        htmlFor={name}
        className={`input-label ${isLabelHovered ? "label-hovered" : ""}`}
        onMouseEnter={() => setIsLabelHovered(true)}
        onMouseLeave={() => setIsLabelHovered(false)}
      >
        {label}
      </label>
      <div className="input-wrapper">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className={`input-field ${isInputFocused ? "input-focused" : ""}`}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        {children}
      </div>
    </div>
  );
};

export default InputComponent;
