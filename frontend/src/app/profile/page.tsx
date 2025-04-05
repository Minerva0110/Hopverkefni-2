'use client';

import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddItemForm from '../../../components/AddItemForm';




type Item = {
  id: number;
  title: string;
  description: string;
  priority: boolean;
  due: string;
};

type Category = {
  id: number;
  title: string;
  items: Item[];
};

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:3001/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error('Villa við að sækja flokka:', err));
  }, [user]);

  if (!user) return null;
  return (
    <div className="profile-page">
      <h1>Velkomin, {user.username}!</h1>
      <p>Þetta eru verkefnin á dagskrá:</p>
  
      <button onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? 'Fela færsluform' : 'Viltu bæta við færslu?'}
      </button>
  
      {showForm && <AddItemForm />}
  
      {categories.length === 0 && <p>Engir flokkar fundust.</p>}
  
      {categories.map((category) => (
        <div key={category.id} className="category-container">
          <h2>{category.title}</h2>
          <ul className="item-list">
            {category.items.map((item) => (
              <li key={item.id} className="item">
                <h3>{item.title}</h3>
                {item.priority && <span className="priority">Mikilvægt</span>}
                <p>{item.description}</p>
                <p className="due-date">
                  Skiladagur: {new Date(item.due).toLocaleDateString('is-IS')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}