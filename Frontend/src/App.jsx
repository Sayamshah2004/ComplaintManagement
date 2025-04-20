import React, { useEffect, useState } from "react";
import ComplaintForm from "./Components/ComplaintForm";
import "./index.css";

const App = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    const res = await fetch("http://localhost:5000/api/complaints");
    const data = await res.json();
    setComplaints(data);
  };

  const resolveComplaint = async (id) => {
    await fetch(`http://localhost:5000/api/complaints/${id}`, {
      method: "PUT",
    });
    fetchComplaints(); // refresh list after update
  };

  const deleteComplaint = async (id) => {
    await fetch(`http://localhost:5000/api/complaints/${id}`, {
      method: "DELETE",
    });
    fetchComplaints(); // refresh list after delete
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <>
      <h1> Digital Complaint Management System</h1>
      <img className="main" src="src/assets/main.png" alt="Main Visual" />

      <div className="container">
        <ComplaintForm onSubmit={fetchComplaints} />
      </div>

      <h2>
        <img
          className="complainPhoto"
          src="src/assets/complain.png"
          alt="Complaints Icon"
        />{" "}
        Complaints
      </h2>

      <div className="complaints-container">
        {complaints.map((complaint) => (
          <div className="complaint-card" key={complaint.id}>
            <p>
              <strong>Name:</strong> {complaint.name}
            </p>
            <p>
              <strong>Email:</strong> {complaint.email}
            </p>
            <p>
              <strong>Type:</strong> {complaint.type}
            </p>
            <p>
              <strong>Status:</strong> {complaint.status}
            </p>
            <p>
              <strong>Description:</strong> {complaint.description}
            </p>

            <div className="action-buttons">
              <img
                src="src/assets/check.png"
                alt="Resolve"
                onClick={() => resolveComplaint(complaint.id)}
                className="resolve"
              />
              <img
                src="src/assets/remove.png"
                alt="Delete"
                onClick={() => deleteComplaint(complaint.id)}
                className="delete"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
