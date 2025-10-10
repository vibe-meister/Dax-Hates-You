import React, { useEffect, useState, useRef } from 'react';

// Single-file React CRM (no backend). TailwindCSS classes used for styling.
// Default export a React component so it can be previewed.

const ANNOYANCES = Array.from({ length: 30 }).map((_, i) => ({
  id: `a${i + 1}`,
  label: [
    'Interrupting', 'Late replies', 'Loud chewing', 'Micromanaging', 'Name-dropping',
    'Bragging', 'Oversharing', 'Unsolicited advice', 'Passive aggression', 'Gossiping',
    'Overpromising', 'Canceling plans', 'Being vague', 'One-word replies', 'Not listening',
    'Phone-first', 'No eye contact', 'Slow to pay', 'Credit-grabbing', 'Corner-stealing',
    'Queue-cutting', 'Talking over others', 'Not RSVPing', 'Spoilers', 'TMI', 'Mood swings',
    'Overscheduling', 'Bad puns', 'Cold greetings', 'Name mix-up'
  ][i],
  // assign a default weight between -2 and +2 (annoyance impact)
  weight: [0.6, 0.8, 0.5, 1.5, 0.6, 0.9, 0.7, 1.2, 1.4, 1.0, 0.9, 0.8, 0.7, 0.4, 1.3, 0.6, 0.5, 1.8, 1.1, 0.9, 0.6, 1.3, 0.5, 0.7, 0.4, 0.8, 0.3, 0.2, 0.2, 0.6 ][i]
}));

// Function to get image files from the images folder
function getImageFiles() {
  // Your actual image files - the app will use these images and name people based on the filename
  const imageNames = [
    'dax.jpg', 'cole.jpg', 'elon.jpg', 'florin.jpg', 'macho.jpg',
    'meister.jpg', 'nikita.jpg', 'ryan.jpg', 'tanmay.jpg', 'teej.jpg'
  ];
  
  return imageNames.map((filename, index) => {
    // Convert filename to proper name (e.g., 'john_doe.jpg' -> 'John Doe')
    const name = filename
      .replace(/\.(jpg|jpeg|png|gif)$/i, '') // Remove extension
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
    
    const imagePath = `/Dax-Hates-You/images/${filename}`;
    
    return {
      filename,
      name,
      id: index === 0 ? 'dax' : `p${index}`,
      isUser: index === 0,
      baseScore: index === 0 ? 8 : Math.floor(3 + Math.random() * 7),
      color: index === 0 ? '#0ea5e9' : `hsl(${(index * 40) % 360} 80% 60%)`,
      customImage: imagePath // Use the image from public/images folder
    };
  });
}

const DEFAULT_PEOPLE = getImageFiles();

function svgAvatar(name, color) {
  const initials = name.split(' ').map(s => s[0] || '').slice(0,2).join('').toUpperCase();
  const svg = `data:image/svg+xml;utf8,` + encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
      <rect width='100%' height='100%' fill='${color}' rx='24' />
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Arial' font-size='48' fill='white'>${initials}</text>
    </svg>
  `);
  return svg;
}

export default function SinglePageDaxCRM() {
  const [people, setPeople] = useState(() => {
    try {
      const raw = localStorage.getItem('dax-crm-v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    // prepare people with annoyances state
    return DEFAULT_PEOPLE.map(p => ({ ...p, annoyances: {}, computedScore: p.baseScore }));
  });

  const [annoyances] = useState(ANNOYANCES);
  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const dropRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('dax-crm-v1', JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    // recompute scores whenever people or annoyances change
    setPeople(prev => prev.map(p => ({ ...p, computedScore: computeScore(p) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial compute already done in data load

  function computeScore(person) {
    // start from baseScore (1-10)
    let score = Number(person.baseScore || 5);
    // aggregate annoyance weights for chosen options
    const chosen = person.annoyances || {};
    let totalWeight = 0;
    for (const aid of Object.keys(chosen)) {
      if (chosen[aid]) {
        const a = annoyances.find(x => x.id === aid);
        if (a) totalWeight += a.weight;
      }
    }
    // map totalWeight into a delta that shifts score between -4 and +0 (annoyances lower score)
    // normalize: assume typical totalWeight between 0..(30*2)=60 — scale accordingly
    const delta = -Math.tanh(totalWeight / 6) * 4; // produces -0..~-4
    score = Math.round(Math.min(10, Math.max(1, score + delta)));
    return score;
  }

  function toggleAnnoyance(personId, aid) {
    setPeople(prev => {
      return prev.map(p => {
        if (p.id !== personId) return p;
        const next = { ...p, annoyances: { ...(p.annoyances || {}) } };
        next.annoyances[aid] = !next.annoyances[aid];
        next.computedScore = computeScore(next);
        return next;
      });
    });
  }

  function setBaseScore(personId, val) {
    setPeople(prev => prev.map(p => p.id === personId ? ({ ...p, baseScore: val, computedScore: computeScore({ ...p, baseScore: val }) }) : p));
  }

  function updatePersonName(personId, newName) {
    setPeople(prev => prev.map(p => p.id === personId ? ({ ...p, name: newName }) : p));
  }

  function handleImageUpload(personId, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPeople(prev => prev.map(p => p.id === personId ? ({ ...p, customImage: e.target.result }) : p));
    };
    reader.readAsDataURL(file);
  }

  function removeCustomImage(personId) {
    setPeople(prev => prev.map(p => p.id === personId ? ({ ...p, customImage: null }) : p));
  }

  function onDragStart(e, id) {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }

  function onDrop(e, overId) {
    e.preventDefault();
    const id = draggingId || e.dataTransfer.getData('text/plain');
    if (!id) return;
    setPeople(prev => {
      const idxFrom = prev.findIndex(p => p.id === id);
      const idxTo = prev.findIndex(p => p.id === overId);
      if (idxFrom === -1 || idxTo === -1) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idxFrom, 1);
      copy.splice(idxTo, 0, item);
      return copy;
    });
    setDraggingId(null);
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function exportJSON() {
    const data = JSON.stringify(people, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dax-crm-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (Array.isArray(parsed)) setPeople(parsed);
      } catch (err) {
        alert('Invalid JSON');
      }
    };
    reader.readAsText(f);
  }

  function resetAll() {
    if (!confirm('Reset to defaults? This clears local changes.')) return;
    setPeople(DEFAULT_PEOPLE.map(p => ({ ...p, annoyances: {}, computedScore: p.baseScore })));
  }

  const selected = people.find(p => p.id === selectedId);

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto">
  <header className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold">Dax — Single Page CRM (No Backend) v3</h1>
          <div className="space-x-2">
            <button onClick={exportJSON} className="px-3 py-1 rounded bg-sky-600 text-white">Export</button>
            <label className="px-3 py-1 rounded bg-emerald-600 text-white cursor-pointer">
              Import
              <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
            </label>
            <button onClick={resetAll} className="px-3 py-1 rounded bg-red-500 text-white">Reset</button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dax - Special User Area */}
          <section className="md:col-span-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow border-2 border-blue-200">
            <div className="flex justify-center">
              <div className="text-center">
                <img 
                  src={people[0]?.customImage || svgAvatar(people[0]?.name || 'Dax', people[0]?.color || '#0ea5e9')} 
                  alt="Dax avatar" 
                  className="w-32 h-32 rounded-xl mb-4 shadow-lg object-cover mx-auto" 
                />
                <h2 className="text-2xl font-bold text-blue-800 mb-2">Dax (You)</h2>
                <p className="text-blue-600 text-sm">The Master of the CRM</p>
              </div>
            </div>
          </section>

          <section className="md:col-span-2 bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">People (drag to reorder)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {people.slice(1).map(person => (
                <article
                  key={person.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, person.id)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, person.id)}
                  onClick={() => !person.isUser && setSelectedId(person.id)}
                  className={`cursor-pointer select-none p-3 rounded-lg border ${person.id === draggingId ? 'opacity-60 border-dashed' : 'hover:shadow'} flex flex-col items-center justify-center`}
                >
                  <img 
                    src={person.customImage || svgAvatar(person.name, person.color)} 
                    alt="avatar" 
                    className="w-28 h-28 rounded-xl mb-3 shadow-sm object-cover" 
                  />
                  <div className="text-center">
                    <div className="font-medium">{person.name}</div>
                    <div className="mt-1">Score: <strong>{person.computedScore}</strong> / 10</div>
                    <div className="mt-2 text-xs text-slate-500">Click to edit</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="bg-white p-4 rounded-xl shadow space-y-4">
            <h3 className="font-semibold">Data Management</h3>
            <div className="flex flex-col gap-2">
              <button onClick={exportJSON} className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700 transition-colors">Export Data</button>
              <label className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer text-center">
                Import Data
                <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
              </label>
            </div>
            <div className="text-xs text-slate-500 mt-4">
              Export your CRM data as a backup or share with others. Import to restore from backup.
            </div>
          </aside>
        </main>

        {/* Editor modal / side panel */}
        {selected && !selected.isUser && (
          <div className="fixed inset-0 bg-black/40 z-40 flex items-end md:items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full md:w-3/4 lg:w-2/3 p-6 shadow-xl max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit — {selected.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedId(null)} className="px-3 py-1 rounded bg-slate-200">Close</button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 flex flex-col items-center">
                  <div className="relative mb-3">
                    <img 
                      src={selected.customImage || svgAvatar(selected.name, selected.color)} 
                      alt="avatar" 
                      className="w-36 h-36 rounded-xl object-cover" 
                    />
                    {selected.customImage && (
                      <button
                        onClick={() => removeCustomImage(selected.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                        title="Remove custom image"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={selected.name}
                        onChange={(e) => updatePersonName(selected.id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Enter name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Custom Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(selected.id, e)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <div className="text-xs text-slate-500 mt-1">Upload a photo (max 5MB)</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-slate-600">Base score (1-10)</label>
                      <input type="range" min={1} max={10} value={selected.baseScore} onChange={(e) => setBaseScore(selected.id, Number(e.target.value))} className="w-full" />
                      <div className="text-center mt-2 text-xl font-bold">{selected.baseScore}</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-600">Annoyances — toggle the things that annoy this person</div>
                      <div className="text-xs text-slate-400">Each selected annoyance contributes a weighted penalty to the computed score.</div>
                    </div>
                    <div className="text-sm">Computed score: <strong>{selected.computedScore}</strong></div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {annoyances.map(a => (
                      <button
                        key={a.id}
                        onClick={() => toggleAnnoyance(selected.id, a.id)}
                        className={`text-left p-2 rounded border flex flex-col justify-between ${selected.annoyances && selected.annoyances[a.id] ? 'bg-red-50 border-red-300' : 'bg-slate-50'}`}
                      >
                        <div className="text-sm font-medium">{a.label}</div>
                        <div className="text-xs text-slate-500 mt-2">weight: {a.weight}</div>
                      </button>
                    ))}
                  </div>

                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => {
                  // force recompute and save
                  setPeople(prev => prev.map(p => p.id === selected.id ? ({ ...p, computedScore: computeScore(p) }) : p));
                  setSelectedId(null);
                }} className="px-4 py-2 rounded bg-sky-600 text-white">Save & Close</button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-6 text-center text-sm text-slate-500">Made for Dax — client-only CRM. Drag cards to reorder, click to edit. Data saved locally.</footer>

      </div>
    </div>
  );
}
