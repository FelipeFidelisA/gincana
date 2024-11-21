// FormComponent.tsx
import React, { useState } from "react";
import InputComponent from "./InputComponent";


interface FormComponentProps {
  credentials: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: any) => void;
  error: string | null;
  navigate: any;
  fields: Array<{ label: string; type: string; name: string; placeholder: string }>;
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

  const styles = {
    formContent: {
      flex: 1,
      padding: "2rem",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      animation: "slideIn 1s ease-out",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: isH2Hovered ? "#007bff" : "#333",
      textAlign: "center" as const,
      marginBottom: "1.5rem",
      transition: "color 0.3s ease",
      cursor: "pointer",
    },
    errorMessage: {
      color: "#d33",
      backgroundColor: "rgba(211, 51, 51, 0.1)",
      padding: "0.75rem",
      border: "1px solid #d33",
      borderRadius: "5px",
      marginBottom: "1rem",
      textAlign: "center" as const,
    },
    form: {
      display: "flex",
      flexDirection: "column" as const,
    },
    buttonContainer: {
      display: "flex",
      width: "100%",
    },
    button: {
      width: "40%",
      padding: "0.75rem",
      margin: "1.5rem auto 0 auto",
      backgroundColor: isButtonHovered ? "#0056b3" : "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "1.1rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      textAlign: "center" as const,
      transform: isButtonActive ? "scale(0.95)" : "scale(1)",
    },
    registerLink: {
      textAlign: "center" as const,
      fontSize: "0.9rem",
      color: "#555",
      marginTop: "1.5rem",
    },
    linkText: {
      color: isLinkTextHovered ? "#0056b3" : "#007bff",
      marginLeft: "0.3rem",
      cursor: "pointer",
      textDecoration: "underline",
      transition: "color 0.3s ease",
    },
  };

  return (
    <div style={styles.formContent}>
      <h2
        style={styles.h2}
        onMouseEnter={() => setIsH2Hovered(true)}
        onMouseLeave={() => setIsH2Hovered(false)}
      >
        {title}
      </h2>
      {error && <div style={styles.errorMessage}>{error}</div>}
      <form onSubmit={handleSubmit} noValidate style={styles.form}>
        {fields.map((field) => (
          <InputComponent
            key={field.name}
            label={field.label}
            type={field.type}
            name={field.name}
            value={credentials[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
          />
        ))}
        <div style={styles.buttonContainer}>
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onMouseDown={() => setIsButtonActive(true)}
            onMouseUp={() => setIsButtonActive(false)}
          >
            {submitButtonText}
          </button>
        </div>
      </form>
      <p style={styles.registerLink}>
        {footerText}
        <span
          onClick={() => navigate(footerLinkPath)}
          style={styles.linkText}
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
