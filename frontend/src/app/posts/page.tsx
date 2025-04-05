'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = {
  id: number;
  title: string;
  description: string;
  priority: boolean;
  due: string;
  completed: boolean;
  category?: {
    name: string;
  };
};

export default function PostsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuth(false);
      router.push("/login");
    } else {
      setIsAuth(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuth !== true) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3001/items", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ekki tókst að sækja færslur");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        } else if (Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Villa við að sækja færslur:", err);
        setLoading(false);
      });
  }, [isAuth]);

  const handleToggleCompleted = async (id: number, completed: boolean) => {
    try {
      await fetch(`http://localhost:3001/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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

  const groupedItems = items.reduce((acc: Record<string, Item[]>, item) => {
    const category = item.category?.name ?? '';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const handleToggleMessage = () => {
    setShowMessage(prev => !prev);
  };

  if (loading) return <p className="p-4">Sæki færslur...</p>;

  if (isAuth === false) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center text-red-600 font-medium">
        <p>Vinsamlegast skráðu þig inn til að skoða færslur.</p>
      </div>
    );
  }

  return (
    <div className="posts-page">
      <div className="page-header">
        <h1 className="page-title">Færslur</h1>
        <button onClick={handleToggleMessage} className="question-mark-btn">ℹ️</button>
      </div>

      {showMessage && (
        <p className="info-message">
          Hér eru færslurnar þínar. Til að bæta við nýjum færslum, vinsamlegast farðu í prófílinn þinn.
        </p>
      )}

      {items.length === 0 ? (
        <p className="empty-message">Engar færslur fundust.</p>
      ) : (
        Object.entries(groupedItems).map(([categoryName, categoryItems]) => (
          <section key={categoryName} className="category-group">
            <h2 className="category-title">{categoryName}</h2>
            <ul className="item-list">
              {categoryItems.map((item) => (
                <li
                  key={item.id}
                  className={`item-box${item.completed ? ' completed' : ''}`}
                >
                  <div className="item-header">
                    <h3 className="item-title">{item.title}</h3>
                    {item.priority && (
                      <span className="priority-badge">Mikilvægt</span>
                    )}
                  </div>

                  <p className="item-description">{item.description}</p>
                  <p className="item-meta">
                    Skiladagur: {new Date(item.due).toLocaleDateString('is-IS')}
                  </p>

                  <div className="item-checkbox">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleCompleted(item.id, item.completed)}
                    />
                    <label>
                      {item.completed ? 'Lokið' : 'Haka við þegar verkefni er lokið'}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
