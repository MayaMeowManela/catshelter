import { useState, useEffect } from 'react';
import { Heart, Stethoscope, ShoppingBag, Plus, Sparkles, TrendingUp, Info, Eraser, Utensils, MousePointer2, Award, Smile } from 'lucide-react';
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
  soapProgress: number; 
  ointmentProgress: number;
  loveProgress: number; // New: Affection meter
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

type Tool = 'soap' | 'medicine' | 'food' | 'love' | 'none';

function App() {
  const [money, setMoney] = useState(200);
  const [capacity, setCapacity] = useState(2);
  const [cats, setCats] = useState<Cat[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>('none');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Upgrade States
  const [spongeLevel, setSpongeLevel] = useState(1);
  const [medLevel, setMedLevel] = useState(1);
  const [foodLevel, setFoodLevel] = useState(1);
  const [loveLevel, setLoveLevel] = useState(1); // New upgrade

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleGlobalMouseDown = () => setIsMouseDown(true);
    const handleGlobalMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mousedown', handleGlobalMouseDown);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mousedown', handleGlobalMouseDown);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const intakeCat = () => {
    if (cats.length >= capacity) return;
    const breed = CAT_BREEDS[Math.floor(Math.random() * CAT_BREEDS.length)];
    const newCat: Cat = {
      id: Math.random().toString(36).substr(2, 9),
      name: CAT_NAMES[Math.floor(Math.random() * CAT_NAMES.length)],
      breed: breed.name,
      color: breed.color,
      health: 20,
      isDirty: Math.random() > 0.3,
      hasWound: Math.random() > 0.4,
      isHungry: true,
      isHappy: false,
      soapProgress: 0,
      ointmentProgress: 0,
      loveProgress: 0,
    };
    setCats([...cats, newCat]);
  };

  const handleCareAction = (catId: string) => {
    if (!isMouseDown && activeTool !== 'food') return;

    setCats(prevCats => prevCats.map(cat => {
      if (cat.id !== catId) return cat;
      let updatedCat = { ...cat };
      
      if (activeTool === 'soap' && cat.isDirty) {
        updatedCat.soapProgress = Math.min(100, updatedCat.soapProgress + (1.5 + spongeLevel * 0.8));
        if (updatedCat.soapProgress === 100) {
          updatedCat.isDirty = false;
          updatedCat.health = Math.min(100, updatedCat.health + 15);
        }
      } else if (activeTool === 'medicine' && cat.hasWound) {
        updatedCat.ointmentProgress = Math.min(100, updatedCat.ointmentProgress + (1 + medLevel * 0.6));
        if (updatedCat.ointmentProgress === 100) {
          updatedCat.hasWound = false;
          updatedCat.health = Math.min(100, updatedCat.health + 25);
        }
      } else if (activeTool === 'love' && cat.loveProgress < 100) {
        // Petting speed increases with level
        updatedCat.loveProgress = Math.min(100, updatedCat.loveProgress + (1.2 + loveLevel * 1));
      } else if (activeTool === 'food' && cat.isHungry && isMouseDown) {
        updatedCat.isHungry = false;
        updatedCat.health = Math.min(100, updatedCat.health + (20 + foodLevel * 10));
      }

      // Check if cat is happy: Clean, Healed, Fed, AND Loved
      if (!updatedCat.isDirty && !updatedCat.hasWound && !updatedCat.isHungry && updatedCat.loveProgress >= 100) {
        updatedCat.isHappy = true;
        updatedCat.health = 100;
      }
      return updatedCat;
    }));
  };

  const adoptOut = (id: string) => {
    const cat = cats.find(c => c.id === id);
    if (cat && cat.isHappy) {
      setMoney(m => m + 300); // Higher payout for loved cats
      setCats(cats.filter(c => c.id !== id));
    }
  };

  const buyUpgrade = (type: 'sponge' | 'med' | 'food' | 'bed' | 'love') => {
    let cost = 0;
    if (type === 'sponge') cost = spongeLevel * 150;
    if (type === 'med') cost = medLevel * 180;
    if (type === 'food') cost = foodLevel * 120;
    if (type === 'love') cost = loveLevel * 100;
    if (type === 'bed') cost = capacity * 250;

    if (money >= cost) {
      setMoney(m => m - cost);
      if (type === 'sponge') setSpongeLevel(l => l + 1);
      if (type === 'med') setMedLevel(l => l + 1);
      if (type === 'food') setFoodLevel(l => l + 1);
      if (type === 'love') setLoveLevel(l => l + 1);
      if (type === 'bed') setCapacity(c => c + 1);
    }
  };

  return (
    <div className={`app-container ${activeTool !== 'none' ? 'custom-cursor' : ''}`}>
      {activeTool !== 'none' && (
        <div className="floating-tool" style={{ left: mousePos.x, top: mousePos.y }}>
          {activeTool === 'soap' && <Eraser size={48} className="tool-icon-float soap" />}
          {activeTool === 'medicine' && <Stethoscope size={48} className="tool-icon-float med" />}
          {activeTool === 'food' && <Utensils size={48} className="tool-icon-float food" />}
          {activeTool === 'love' && <Heart size={48} className="tool-icon-float love-icon" />}
        </div>
      )}

      <header className="header">
        <div className="title-group">
          <h1>Cat Shelter <Sparkles className="icon-sparkle" /></h1>
          <p>Care, Heal, and Love! Affection is the key to a happy home.</p>
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

      <main className="game-layout">
        <section className="main-stage">
          <div className="stage-header">
            <button className="btn-rescue-large" onClick={intakeCat} disabled={cats.length >= capacity}>
              <Heart size={24} /> Rescue a Cat
            </button>
          </div>

          <div className="cat-grid-area">
            {cats.length === 0 ? (
              <div className="empty-shelter">
                <Smile size={64} />
                <h2>The shelter is ready!</h2>
                <p>Click "Rescue a Cat" to begin your journey.</p>
              </div>
            ) : (
              cats.map(cat => (
                <div 
                  key={cat.id} 
                  className={`cat-enclosure-pro ${cat.isHappy ? 'happy-glow' : ''}`}
                  onMouseMove={() => handleCareAction(cat.id)}
                  onMouseDown={() => handleCareAction(cat.id)}
                >
                  <div className="cat-visual-box">
                    <CatSprite 
                      color={cat.color} 
                      isDirty={cat.isDirty} 
                      hasWound={cat.hasWound}
                      isHappy={cat.isHappy}
                      soapProgress={cat.soapProgress}
                      ointmentProgress={cat.ointmentProgress}
                      loveProgress={cat.loveProgress}
                    />
                  </div>
                  
                  <div className="cat-label">
                    <h3>{cat.name}</h3>
                    <div className="stat-rows">
                      <div className="mini-meter health">
                        <div className="fill" style={{ width: `${cat.health}%` }} />
                      </div>
                      <div className="mini-meter love">
                        <div className="fill" style={{ width: `${cat.loveProgress}%` }} />
                      </div>
                    </div>
                  </div>

                  {cat.isHappy && (
                    <button className="btn-rehome" onClick={(e) => { e.stopPropagation(); adoptOut(cat.id); }}>
                      <Award size={18} /> Rehome {cat.name}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="upgrades-sidebar">
          <div className="sidebar-header">
            <TrendingUp size={20} />
            <h2>Shelter Shop</h2>
          </div>

          <div className="upgrade-list">
            <div className="upgrade-item">
              <div className="upgrade-info">
                <Eraser size={20} className="soap" />
                <div>
                  <h4>Pro Sponge</h4>
                  <span>Lvl {spongeLevel}</span>
                </div>
              </div>
              <button onClick={() => buyUpgrade('sponge')} disabled={money < spongeLevel * 150}>
                ${spongeLevel * 150}
              </button>
            </div>

            <div className="upgrade-item">
              <div className="upgrade-info">
                <Heart size={20} className="love-icon" />
                <div>
                  <h4>Gentle Touch</h4>
                  <span>Lvl {loveLevel}</span>
                </div>
              </div>
              <button onClick={() => buyUpgrade('love')} disabled={money < loveLevel * 100}>
                ${loveLevel * 100}
              </button>
            </div>

            <div className="upgrade-item">
              <div className="upgrade-info">
                <Stethoscope size={20} className="med" />
                <div>
                  <h4>Magic Ointment</h4>
                  <span>Lvl {medLevel}</span>
                </div>
              </div>
              <button onClick={() => buyUpgrade('med')} disabled={money < medLevel * 180}>
                ${medLevel * 180}
              </button>
            </div>

            <div className="upgrade-item">
              <div className="upgrade-info">
                <Utensils size={20} className="food" />
                <div>
                  <h4>Premium Mix</h4>
                  <span>Lvl {foodLevel}</span>
                </div>
              </div>
              <button onClick={() => buyUpgrade('food')} disabled={money < foodLevel * 120}>
                ${foodLevel * 120}
              </button>
            </div>

            <div className="upgrade-divider" />

            <div className="upgrade-item highlight">
              <div className="upgrade-info">
                <Plus size={20} className="bed" />
                <div>
                  <h4>Extra Bed</h4>
                  <span>Capacity: {capacity}</span>
                </div>
              </div>
              <button onClick={() => buyUpgrade('bed')} disabled={money < capacity * 250}>
                ${capacity * 250}
              </button>
            </div>
          </div>
        </aside>
      </main>

      <nav className="bottom-toolbar">
        <div className="toolbar-content">
          <button className={`tool-item ${activeTool === 'soap' ? 'active' : ''}`} onClick={() => setActiveTool('soap')}>
            <div className="icon-circle soap"><Eraser size={28} /></div>
            <span>Wash</span>
          </button>
          <button className={`tool-item ${activeTool === 'love' ? 'active' : ''}`} onClick={() => setActiveTool('love')}>
            <div className="icon-circle love-icon"><Heart size={28} /></div>
            <span>Pet</span>
          </button>
          <button className={`tool-item ${activeTool === 'medicine' ? 'active' : ''}`} onClick={() => setActiveTool('medicine')}>
            <div className="icon-circle med"><Stethoscope size={28} /></div>
            <span>Heal</span>
          </button>
          <button className={`tool-item ${activeTool === 'food' ? 'active' : ''}`} onClick={() => setActiveTool('food')}>
            <div className="icon-circle food"><Utensils size={28} /></div>
            <span>Feed</span>
          </button>
          <div className="toolbar-divider" />
          <button className="tool-item" onClick={() => setActiveTool('none')}>
            <div className="icon-circle none"><MousePointer2 size={28} /></div>
            <span>Hand</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
