interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <div id={id}>
      <label>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    </div>
  );
}
