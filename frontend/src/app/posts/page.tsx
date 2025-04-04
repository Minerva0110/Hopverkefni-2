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

  const handleToggleCompleted = async (id: number, completed: boolean) => {
    try {
      await fetch(`http://localhost:3000/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: !completed } : item
        )
      );
    } catch (error) {
      console.error('Villa við að uppfæra status á færslu:', error);
    }
  };

  if (loading) return <p className="p-4">Sæki færslur...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Færslur</h1>

      {items.length === 0 ? (
        <p>Engar færslur fundust.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className={`border rounded p-4 shadow-sm bg-white ${
                item.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2
                  className={`text-lg font-semibold ${
                    item.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {item.title}
                </h2>
                {item.priority && (
                  <span className="text-sm text-red-500 font-bold">Mikilvægt</span>
                )}
              </div>

              <p className="text-sm text-gray-700 mb-1">{item.description}</p>
              <p className="text-sm text-gray-500">
                Flokkur: {item.category?.name ?? '–'}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                Skiladagur: {new Date(item.due).toLocaleDateString('is-IS')}
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() =>
                    handleToggleCompleted(item.id, item.completed)
                  }
                />
                <label className="text-sm text-gray-600">
                  {item.completed ? 'Lokið' : 'Haka við þegar verkefni er lokið'}
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
