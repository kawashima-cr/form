import c from "./TextInput.module.css";

type Props = {
  label: string;
  type: string;
  name: string;
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function TextInput(props: Props) {
  return (
    <div className={c.formRow}>
      <label className={c.formLabel} htmlFor={props.name}>
        {props.label}
      </label>
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        className={c.formInput}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}
