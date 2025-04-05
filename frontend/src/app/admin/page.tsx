"use client";

import { useState } from "react";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:3001/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Villa við skráningu notanda");
      }

      setMessage(data.message || "Notandi búinn til!");
      setFormData({ username: "", email: "", password: "", role: "user" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Óþekkt villa");
      }
    }
  }


  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Bæta við notanda</h1>
        {message && <p className="message success-message">{message}</p>}
        {error && <p className="message error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Notandanafn"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Netfang"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Lykilorð"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">Notandi</option>
            <option value="admin">Stjórnandi</option>
          </select>
          <button type="submit">Bæta við</button>
        </form>
      </div>
    </div>
  );
}