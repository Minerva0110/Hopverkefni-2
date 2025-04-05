'use client';

import { useEffect, useState } from 'react';

type Category = {
  id: number;
  title: string;
};

export default function AddItemForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: false,
    due: '',
    categoryId: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/categories') 
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Villa við að sækja flokka:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:3001/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          categoryId: parseInt(formData.categoryId),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Villa við að búa til færslu');

      setMessage('Færsla skráð!');
      setFormData({
        title: '',
        description: '',
        priority: false,
        due: '',
        categoryId: '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Óþekkt villa');
      }
    }
  };

  return (
    <div className="add-item-form">
      <h2>Bæta við færslu</h2>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="form-grid">
        <input
          type="text"
          placeholder="Titill"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Lýsing"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.checked })}
          />
          Mikilvægt
        </label>
        <input
          type="date"
          value={formData.due}
          onChange={(e) => setFormData({ ...formData, due: e.target.value })}
          required
        />
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          required
        >
          <option value="">Veldu flokk</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>

        <button type="submit">Skrá færslu</button>
      </form>
    </div>
  );
}
