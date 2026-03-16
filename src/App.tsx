import { useState, useEffect } from 'react';
import { Heart, Stethoscope, Soup, ShoppingBag, Plus, Sparkles, TrendingUp, Info } from 'lucide-react';
import './App.css';

interface Cat {
  id: string;
  name: string;
  breed: string;
  health: number;
  status: 'hospitalized' | 'resting' | 'healthy';
  treatmentStart?: number;
}

const CAT_BREEDS = ['Orange Tabby', 'Calico', 'Siamese', 'Persian', 'Russian Blue', 'Maine Coon', 'Black Cat', 'Ragdoll'];
const CAT_NAMES = ['Mochi', 'Luna', 'Oliver', 'Simba', 'Cleo', 'Bao', 'Tofu', 'Whiskers', 'Noodle', 'Sushi'];

const INITIAL_MONEY = 100;
const INITIAL_CAPACITY = 3;
const HEAL_RATE = 2; // Health points per tick
const TICK_RATE = 1000; // 1 second

function App() {
  const [money, setMoney] = useState(INITIAL_MONEY);
  const [capacity, setCapacity] = useState(INITIAL_CAPACITY);
  const [cats, setCats] = useState<Cat[]>([]);

  // Simulation Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCats(prevCats => prevCats.map(cat => {
        if (cat.status === 'hospitalized' && cat.health < 100) {
          const newHealth = Math.min(100, cat.health + HEAL_RATE);
          return {
            ...cat,
            health: newHealth,
            status: newHealth === 100 ? 'healthy' : 'hospitalized'
          };
        }
        return cat;
      }));
    }, TICK_RATE);
    return () => clearInterval(timer);
  }, []);

  const intakeCat = () => {
    if (cats.length >= capacity) return;
    
    const newCat: Cat = {
      id: Math.random().toString(36).substr(2, 9),
      name: CAT_NAMES[Math.floor(Math.random() * CAT_NAMES.length)],
      breed: CAT_BREEDS[Math.floor(Math.random() * CAT_BREEDS.length)],
      health: Math.floor(Math.random() * 40) + 10, // Starts hurt
      status: 'resting'
    };
    
    setCats([...cats, newCat]);
  };

  const startTreatment = (id: string) => {
    setCats(cats.map(c => c.id === id ? { ...c, status: 'hospitalized' } : c));
  };

  const adoptOut = (id: string) => {
    const cat = cats.find(c => c.id === id);
    if (cat && cat.status === 'healthy') {
      setMoney(m => m + 150);
      setCats(cats.filter(c => c.id !== id));
    }
  };

  const upgradeCapacity = () => {
    const cost = capacity * 100;
    if (money >= cost) {
      setMoney(m => m - cost);
      setCapacity(c => c + 1);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-group">
          <h1>Cat Shelter <Sparkles className="icon-sparkle" /></h1>
          <p>Care, Heal, and Rehome our feline friends.</p>
        </div>
        <div className="stats-bar">
          <div className="stat-pill money">
            <ShoppingBag size={18} />
            <span>${money}</span>
          </div>
          <div className="stat-pill capacity">
            <Plus size={18} />
            <span>{cats.length} / {capacity} Beds</span>
          </div>
        </div>
      </header>

      <main className="game-grid">
        <section className="action-panel">
          <button 
            className="btn-primary intake-btn" 
            onClick={intakeCat}
            disabled={cats.length >= capacity}
          >
            <Heart size={20} />
            Rescue a Cat
          </button>
          
          <div className="upgrade-card">
            <h3><TrendingUp size={18} /> Upgrades</h3>
            <button 
              className="btn-secondary" 
              onClick={upgradeCapacity}
              disabled={money < capacity * 100}
            >
              Expand Capacity (${capacity * 100})
            </button>
          </div>
        </section>

        <section className="cat-list">
          {cats.length === 0 ? (
            <div className="empty-state">
              <Info size={32} />
              <p>The shelter is empty. Time to rescue some cats!</p>
            </div>
          ) : (
            cats.map(cat => (
              <div key={cat.id} className={`cat-card status-${cat.status}`}>
                <div className="cat-header">
                  <div className="cat-info">
                    <h3>{cat.name}</h3>
                    <span>{cat.breed}</span>
                  </div>
                  <div className={`status-badge ${cat.status}`}>
                    {cat.status}
                  </div>
                </div>

                <div className="health-section">
                  <div className="health-header">
                    <span>Health</span>
                    <span>{cat.health}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${cat.health}%` }}
                    />
                  </div>
                </div>

                <div className="cat-actions">
                  {cat.status === 'resting' && (
                    <button className="btn-action treat" onClick={() => startTreatment(cat.id)}>
                      <Stethoscope size={16} /> Treat
                    </button>
                  )}
                  {cat.status === 'hospitalized' && (
                    <div className="treating-indicator">
                      <Soup size={16} className="spin" /> Healing...
                    </div>
                  )}
                  {cat.status === 'healthy' && (
                    <button className="btn-action adopt" onClick={() => adoptOut(cat.id)}>
                      <Heart size={16} /> Adopt Out
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
