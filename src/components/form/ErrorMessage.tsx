type Props = {
  message?: string;
};

export default function ErrorMessage(props: Props) {
  return (
    <div className={`min-h-6 mt-1`}>
      {props.message && (
        <p className="text-red-600 text-sm/normal m-0">{props.message}</p>
      )}
    </div>
  );
}
