import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";
import API_URL from "../api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files.length > 0) {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        profileImage: file,
      }));
      setPreviewImage(URL.createObjectURL(file)); // Set preview image
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Password validation effect
  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const registerForm = new FormData();
      Object.keys(formData).forEach((key) => {
        registerForm.append(key, formData[key]);
      });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: registerForm,
      });

      if (response.status === 409) {
        alert("User already exists. Please log in.");
        return;
      }

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err.message);
      alert("Registration failed! Please try again.");
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="Enter First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Enter Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {!passwordMatch && <p style={{ color: "red" }}>Passwords do not match!</p>}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
          <img src="/assets/addImage.png" alt="" />


            <p>Upload Your Photo</p>
          </label>

          {previewImage && (
            <img
              src={previewImage}
              alt="Profile preview"
              style={{ maxWidth: "80px", borderRadius: "50%" }}
            />
          )}

          <button type="submit" disabled={!passwordMatch}>
            REGISTER
          </button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
