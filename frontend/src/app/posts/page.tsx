'use client';

import { useEffect, useState } from 'react';

type Item = {
  id: number;
  title: string;
  description: string;
  priority: boolean;
  due: string;
  completed: boolean;
  category: {
    name: string;
  };
};

export default function PostsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/items')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Villa við að sækja færslur:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Sæki færslur...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Færslur</h1>

      {items.length === 0 ? (
        <p>Engar færslur fundust.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="border rounded p-4 shadow-sm bg-white">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                {item.priority && <span className="text-sm text-red-500 font-bold">Mikilvægt</span>}
              </div>
              <p className="text-sm text-gray-700 mb-1">{item.description}</p>
              <p className="text-sm text-gray-500">Flokkur: {item.category?.name ?? '–'}</p>
              <p className="text-xs text-gray-400">Skiladagur: {new Date(item.due).toLocaleDateString('is-IS')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
