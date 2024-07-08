interface Props {
  extraClassNames?: string;
}

const Loading: React.FC<Props> = ({ extraClassNames }) => {
  return (
    <div className={`loading w-[60px] h-[60px] relative ${extraClassNames}`}>
      <div className='border-[5px] border-lightning-yellow-700 rounded-[50px] w-[55px] h-[55px] absolute border-l-transparent animate-[rotate-right_1s_linear_infinite]' />
      <div className='border-[5px] border-lightning-yellow-700 rounded-[50px] w-10 h-10 border-t-transparent border-r-transparent m-[7.5px] animate-[rotate-left_1.5s_linear_infinite]' />
    </div>
  );
};

export default Loading;
