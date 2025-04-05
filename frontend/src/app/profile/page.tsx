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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Velkomin, {user.username}!</h1>
      <p className="mb-6 text-gray-700">Þetta eru verkefnin á dagskrá:</p>
  
      {/* 👇 Toggle button */}
      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {showForm ? 'Fela færsluform' : 'Viltu bæta við færslu?'}
      </button>
  
      {/* 👇 Conditionally render the form */}
      {showForm && <AddItemForm />}
  
      {categories.length === 0 && (
        <p>Engir flokkar fundust.</p>
      )}
  
      {categories.map((category) => (
        <div key={category.id} className="mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">{category.title}</h2>
  
          <ul className="space-y-3">
            {category.items.map((item) => (
              <li key={item.id} className="border p-4 rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.priority && (
                    <span className="text-red-500 text-sm font-bold">Mikilvægt</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-1">{item.description}</p>
                <p className="text-xs text-gray-500">
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