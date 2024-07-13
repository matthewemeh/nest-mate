interface Props {
  id?: string;
  disabled?: boolean;
  onClick?: () => void;
  content: React.ReactNode;
  extraClassNames?: string;
  type?: 'flat' | 'outline';
  extraStyles?: React.CSSProperties;
}

const Button: React.FC<Props> = ({
  id,
  content,
  onClick,
  disabled,
  extraStyles,
  type = 'flat',
  extraClassNames
}) => {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={extraStyles}
      className={`app-ui-button disabled:cursor-not-allowed ease-in-out duration-300 rounded w-max block py-2 px-3 ${
        type === 'flat'
          ? 'bg-lightning-yellow-500 !text-lightning-yellow-950 hover:bg-lightning-yellow-600 active:bg-lightning-yellow-700 disabled:bg-lightning-yellow-100 disabled:!text-lightning-yellow-400'
          : 'bg-transparent border border-current !text-lightning-yellow-600 hover:!text-lightning-yellow-700 active:!text-lightning-yellow-800 disabled:!text-lightning-yellow-300'
      }  ${extraClassNames}`}>
      {content}
    </button>
  );
};

export default Button;
