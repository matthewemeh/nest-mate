import Loading from '../Loading';

interface Props {
  title: string;
  hidden?: boolean;
  tabIndex?: number;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  extraClassNames?: string;
  extraStyles?: React.CSSProperties;
  type: 'button' | 'reset' | 'submit';
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

const AuthButton: React.FC<Props> = ({
  type,
  title,
  hidden,
  onClick,
  tabIndex,
  disabled,
  isLoading,
  buttonRef,
  loadingText,
  extraStyles,
  extraClassNames
}) => {
  return (
    <button
      type={type}
      ref={buttonRef}
      onClick={onClick}
      style={extraStyles}
      disabled={disabled}
      tabIndex={tabIndex}
      className={`w-full flex items-center justify-center gap-2 mt-7 font-inter rounded-lg bg-lightning-yellow-700 text-base font-semibold text-swan-white py-2.5 px-[18px] h-11 border border-current transition-colors duration-300 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none hover:text-lightning-yellow-700 focus:text-lightning-yellow-700 hover:bg-swan-white focus:bg-swan-white phones:font-bold disabled:bg-[hsl(0,0%,80%)] disabled:text-[hsl(218,11%,45%)] disabled:border-transparent disabled:hover:shadow-none disabled:focus:shadow-none disabled:cursor-default ${
        hidden && 'hidden'
      } ${isLoading && '!bg-zircon cursor-default'} ${extraClassNames}`}>
      {isLoading ? (
        <div className='flex gap-x-2'>
          <span>{loadingText}</span>
          <Loading extraClassNames='w-[30px] h-[30px] scale-50' />
        </div>
      ) : (
        title
      )}
    </button>
  );
};

export default AuthButton;
