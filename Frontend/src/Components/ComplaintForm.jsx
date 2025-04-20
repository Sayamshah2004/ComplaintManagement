import React, { useState } from "react";
const ComplaintForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    description: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to the backend
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit complaint");
      }

      // Reset the form data after successful submission
      setFormData({ name: "", email: "", type: "", description: "" });
      setError(null); // Clear any previous errors
      setSuccessMessage("Complaint submitted successfully!");

      // Call the onSubmit function to fetch the updated complaints
      onSubmit();
    } catch (err) {
      // Handle any errors that occurred during the fetch
      setError(err.message || "An error occurred. Please try again later.");
      setSuccessMessage(null); // Clear any success message if an error occurred
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <input
          id="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          id="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <select
          id="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Service">Service</option>
          <option value="Product">Product</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          id="description"
          placeholder="Complaint Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default ComplaintForm;
