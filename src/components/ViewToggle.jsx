export default function ViewToggle({ view, views, onChange }) {
  return (
    <div className="view-toggle">
      {views.map(v => (
        <button
          key={v.id}
          className={`toggle-btn${view === v.id ? ' active' : ''}`}
          onClick={() => onChange(v.id)}
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}
