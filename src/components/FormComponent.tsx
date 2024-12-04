import React, { useState } from "react";
import InputComponent from "./InputComponent";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./FormComponent.css";

interface FormComponentProps {
  credentials: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  navigate: (path: string) => void;
  fields: Array<{
    label: string;
    type: string;
    name: string;
    placeholder: string;
  }>;
  title: string;
  submitButtonText: string;
  footerText: string;
  footerLinkText: string;
  footerLinkPath: string;
}

const FormComponent: React.FC<FormComponentProps> = ({
  credentials,
  handleChange,
  handleSubmit,
  error,
  navigate,
  fields,
  title,
  submitButtonText,
  footerText,
  footerLinkText,
  footerLinkPath,
}) => {
  const [isH2Hovered, setIsH2Hovered] = useState(false);
  const [isLinkTextHovered, setIsLinkTextHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="form-content">
      <h2
        className={`form-title ${isH2Hovered ? "title-hovered" : ""}`}
        onMouseEnter={() => setIsH2Hovered(true)}
        onMouseLeave={() => setIsH2Hovered(false)}
      >
        {title}
      </h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} noValidate className="form">
        {fields.map((field) => (
          <div key={field.name} className="input-container">
            <InputComponent
              label={field.label}
              type={
                field.name === "password" && showPassword ? "text" : field.type
              }
              name={field.name}
              value={credentials[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
            />
            {field.name === "password" && (
              <span
                onClick={toggleShowPassword}
                className="password-toggle-icon"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
          </div>
        ))}
        <div className="button-container">
          <button
            type="submit"
            className={`submit-button ${
              isButtonHovered ? "button-hovered" : ""
            } ${isButtonActive ? "button-active" : ""}`}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onMouseDown={() => setIsButtonActive(true)}
            onMouseUp={() => setIsButtonActive(false)}
          >
            {submitButtonText}
          </button>
        </div>
      </form>
      <p className="footer-text">
        {footerText}
        <span
          onClick={() => navigate(footerLinkPath)}
          className={`footer-link ${isLinkTextHovered ? "link-hovered" : ""}`}
          onMouseEnter={() => setIsLinkTextHovered(true)}
          onMouseLeave={() => setIsLinkTextHovered(false)}
        >
          {footerLinkText}
        </span>
      </p>
    </div>
  );
};

export default FormComponent;
