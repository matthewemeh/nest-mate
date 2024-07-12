import { useAppSelector } from 'hooks/useRootStorage';

interface Props {
  children: React.ReactNode;
}

const SectionHeading1: React.FC<Props> = ({ children }) => {
  const { prefersDarkMode } = useAppSelector(state => state.userData);

  return <h1 className={`font-bold text-3xl ${prefersDarkMode && 'bg-swan-white'}`}>{children}</h1>;
};

export default SectionHeading1;
