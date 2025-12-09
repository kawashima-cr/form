import { twMerge } from "tailwind-merge";

type Props = {
  message?: string;
  className?: string;
};

export function ErrorMessage(props: Props) {
  return (
    <div className={twMerge(`min-h-6 mt-1, ${props.className}`)}>
      {props.message && (
        <p className="text-red-600 text-sm/normal m-0">{props.message}</p>
      )}
    </div>
  );
}
