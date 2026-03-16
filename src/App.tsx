import { useState, useEffect } from 'react';
import { Heart, Stethoscope, Soup, ShoppingBag, Plus, Sparkles, TrendingUp, Info, Eraser, Utensils } from 'lucide-react';
import { CatSprite } from './components/CatSprite';
import './App.css';

interface Cat {
  id: string;
  name: string;
  breed: string;
  color: string;
  health: number;
  isDirty: boolean;
  hasWound: boolean;
  isHungry: boolean;
  isHappy: boolean;
}

const CAT_BREEDS = [
  { name: 'Orange Tabby', color: '#ffb347' },
  { name: 'Calico', color: '#f5f5dc' },
  { name: 'Siamese', color: '#e0c9a6' },
  { name: 'Persian', color: '#ffffff' },
  { name: 'Russian Blue', color: '#b0c4de' },
  { name: 'Maine Coon', color: '#cd853f' },
  { name: 'Black Cat', color: '#4a4a4a' },
];

const CAT_NAMES = ['Mochi', 'Luna', 'Oliver', 'Simba', 'Cleo', 'Bao', 'Tofu', 'Whiskers', 'Noodle', 'Sushi'];

type Tool = 'soap' | 'medicine' | 'food' | 'none';

function App() {
  const [money, setMoney] = useState(100);
  const [capacity, setCapacity] = useState(3);
  const [cats, setCats] = useState<Cat[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>('none');

  const intakeCat = () => {
    if (cats.length >= capacity) return;
    
    const breed = CAT_BREEDS[Math.floor(Math.random() * CAT_BREEDS.length)];
    const newCat: Cat = {
      id: Math.random().toString(36).substr(2, 9),
      name: CAT_NAMES[Math.floor(Math.random() * CAT_NAMES.length)],
      breed: breed.name,
      color: breed.color,
      health: 30,
      isDirty: Math.random() > 0.3,
      hasWound: Math.random() > 0.4,
      isHungry: true,
      isHappy: false,
    };
    
    setCats([...cats, newCat]);
  };

  const applyToolToCat = (catId: string) => {
    setCats(prevCats => prevCats.map(cat => {
      if (cat.id !== catId) return cat;

      let updatedCat = { ...cat };
      
      if (activeTool === 'soap' && cat.isDirty) {
        updatedCat.isDirty = false;
        updatedCat.health = Math.min(100, updatedCat.health + 15);
      } else if (activeTool === 'medicine' && cat.hasWound) {
        updatedCat.hasWound = false;
        updatedCat.health = Math.min(100, updatedCat.health + 25);
      } else if (activeTool === 'food' && cat.isHungry) {
        updatedCat.isHungry = false;
        updatedCat.health = Math.min(100, updatedCat.health + 20);
      }

      // Check if fully healed
      if (!updatedCat.isDirty && !updatedCat.hasWound && !updatedCat.isHungry) {
        updatedCat.isHappy = true;
        updatedCat.health = 100;
      }

      return updatedCat;
    }));
  };

  const adoptOut = (id: string) => {
    const cat = cats.find(c => c.id === id);
    if (cat && cat.isHappy) {
      setMoney(m => m + 200);
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
    <div className={`app-container tool-cursor-${activeTool}`}>
      <header className="header">
        <div className="title-group">
          <h1>Cat Shelter <Sparkles className="icon-sparkle" /></h1>
          <p>Hand-care each feline friend back to health!</p>
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
          
          <div className="tool-box">
            <h3>Care Tools</h3>
            <div className="tool-grid">
              <button 
                className={`tool-btn ${activeTool === 'soap' ? 'active' : ''}`}
                onClick={() => setActiveTool(activeTool === 'soap' ? 'none' : 'soap')}
              >
                <Eraser size={24} />
                <span>Soap</span>
              </button>
              <button 
                className={`tool-btn ${activeTool === 'medicine' ? 'active' : ''}`}
                onClick={() => setActiveTool(activeTool === 'medicine' ? 'none' : 'medicine')}
              >
                <Stethoscope size={24} />
                <span>Medkit</span>
              </button>
              <button 
                className={`tool-btn ${activeTool === 'food' ? 'active' : ''}`}
                onClick={() => setActiveTool(activeTool === 'food' ? 'none' : 'food')}
              >
                <Utensils size={24} />
                <span>Food</span>
              </button>
            </div>
          </div>

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
              <div 
                key={cat.id} 
                className={`cat-card interactive-cat ${cat.isHappy ? 'happy' : ''}`}
                onClick={() => applyToolToCat(cat.id)}
              >
                <div className="cat-visual">
                  <CatSprite 
                    color={cat.color} 
                    isDirty={cat.isDirty} 
                    hasWound={cat.hasWound}
                    isHappy={cat.isHappy}
                  />
                </div>

                <div className="cat-header">
                  <div className="cat-info">
                    <h3>{cat.name}</h3>
                    <span>{cat.breed}</span>
                  </div>
                </div>

                <div className="needs-indicator">
                  {cat.isDirty && <span className="need-tag soap">Need Wash</span>}
                  {cat.hasWound && <span className="need-tag med">Need Care</span>}
                  {cat.isHungry && <span className="need-tag food">Hungry</span>}
                  {cat.isHappy && <span className="need-tag happy">Ready!</span>}
                </div>

                <div className="health-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${cat.health}%`, backgroundColor: cat.isHappy ? '#a8e6cf' : '#ff8c94' }}
                    />
                  </div>
                </div>

                {cat.isHappy && (
                  <button className="btn-action adopt" onClick={(e) => { e.stopPropagation(); adoptOut(cat.id); }}>
                    <Heart size={16} /> Find Home
                  </button>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
