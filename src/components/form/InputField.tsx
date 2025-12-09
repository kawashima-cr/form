type Props = {
  label: string;
  type: string;
  name: string;
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export function TextInput(props: Props) {
  return (
    <div className="mb-1">
      <label className="block" htmlFor={props.name}>
        {props.label}
      </label>
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        className="
          w-full py-2 border-2 border-indigo-500 rounded-sm 
          focus:outline-1 focus:outline-indigo-700
        "
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}
