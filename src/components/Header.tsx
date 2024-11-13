import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <nav style={{ flex: 1 }}>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li style={{ margin: "0 10px" }}>
            <Link
              to="/manage"
              style={{ textDecoration: "none", color: "#333" }}
            >
              Gerenciar Quizzes
            </Link>
          </li>
          <li style={{ margin: "0 10px" }}>
            <Link
              to="/respond"
              style={{ textDecoration: "none", color: "#333" }}
            >
              Responder Quiz
            </Link>
          </li>
        </ul>
      </nav>
      <div
        onClick={toggleDropdown}
        style={{
          position: "relative",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FaUserCircle size={30} style={{ color: "#333" }} />
        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "40px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
              width: "150px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <button
              style={{
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              encerrar sessão
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
