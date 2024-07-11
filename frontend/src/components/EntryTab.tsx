interface Props {
  entry: Entry;
}

const EntryTab: React.FC<Props> = ({ entry }) => {
  const { type } = entry;

  return <div>{type}</div>;
};

export default EntryTab;
