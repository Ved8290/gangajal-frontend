export default function QuantitySelector({ value, max, onChange }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="-">−</button>
      <input type="number" min="1" max={max} value={value} onChange={(e) => onChange(Math.max(1, Math.min(max || 99, Number(e.target.value) || 1)))} aria-label="Quantity" />
      <button type="button" onClick={() => onChange(Math.min(max || 99, value + 1))} aria-label="+">+</button>
    </div>
  );
}
