interface Props {
  extraClassNames?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<Props> = ({ children, extraClassNames }) => {
  return <div className={`page-layout min-h-full relative ${extraClassNames}`}>{children}</div>;
};

export default PageLayout;
