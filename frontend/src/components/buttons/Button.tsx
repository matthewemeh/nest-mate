interface Props {
  disabled?: boolean;
  onClick?: () => void;
  type?: 'flat' | 'outline';
  content: React.ReactNode;
  extraClassNames?: string;
}

const Button: React.FC<Props> = ({
  content,
  onClick,
  disabled,
  type = 'flat',
  extraClassNames
}) => {
  return type === 'flat' ? (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`disabled:cursor-not-allowed ease-in-out duration-300 rounded w-max block py-2 px-3 bg-lightning-yellow-500 text-lightning-yellow-950 hover:bg-lightning-yellow-600 active:bg-lightning-yellow-700 disabled:bg-lightning-yellow-100 disabled:text-lightning-yellow-400  ${extraClassNames}`}>
      {content}
    </button>
  ) : (
    <button
      onClick={onClick}
      className={`disabled:cursor-not-allowed ease-in-out duration-300 rounded w-max block py-2 px-3 bg-transparent border border-current text-lightning-yellow-600 hover:text-lightning-yellow-700 active:text-lightning-yellow-800 disabled:text-lightning-yellow-300  ${extraClassNames}`}>
      {content}
    </button>
  );
};

export default Button;
