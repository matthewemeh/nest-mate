import { Link } from 'react-router-dom';
import Loading from 'components/Loading';

interface Props {
  to: string;
  title: string;
  hidden?: boolean;
  tabIndex?: number;
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  extraClassNames?: string;
  extraStyles?: React.CSSProperties;
  target?: React.HTMLAttributeAnchorTarget;
}

const AuthButtonLink: React.FC<Props> = ({
  to,
  title,
  hidden,
  target,
  onClick,
  tabIndex,
  isLoading,
  loadingText,
  extraStyles,
  extraClassNames
}) => {
  return (
    <Link
      to={to}
      target={target}
      hidden={hidden}
      onClick={onClick}
      style={extraStyles}
      tabIndex={tabIndex}
      className={`cursor-pointer w-full flex items-center justify-center gap-2 mt-10 font-inter rounded-lg bg-lightning-yellow-700 text-base font-semibold text-swan-white py-2.5 px-[18px] h-11 border border-lightning-yellow-700 transition-colors duration-300 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none hover:text-black focus:text-black hover:bg-swan-white focus:bg-swan-white phones:font-bold disabled:bg-[hsl(0,0%,80%)] disabled:text-[hsl(218,11%,45%)] disabled:border-transparent disabled:hover:shadow-none disabled:focus:shadow-none disabled:cursor-default ${
        isLoading && '!bg-lightning-yellow-700'
      } ${extraClassNames}`}>
      {isLoading ? (
        <div className='flex gap-x-2'>
          <span>{loadingText}</span>
          <Loading extraClassNames='text-[10.5px]' />
        </div>
      ) : (
        title
      )}
    </Link>
  );
};

export default AuthButtonLink;
