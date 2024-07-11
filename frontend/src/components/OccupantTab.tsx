import Button from './buttons/Button';

import { GiExitDoor } from 'react-icons/gi';

interface Props {
  occupant: User;
  onDeleteOccupant: () => void;
}

const OccupantTab: React.FC<Props> = ({ occupant, onDeleteOccupant }) => {
  const { _id, name } = occupant;

  return (
    <div
      key={_id}
      className='flex items-center justify-between px-4 py-2.5 bg-lightning-yellow-100 rounded-md shadow-md'>
      {name}
      <Button
        extraClassNames='flex items-center justify-between gap-3'
        content={
          <>
            <GiExitDoor onClick={onDeleteOccupant} className='text-red-600 cursor-pointer' />
            Evict
          </>
        }
      />
    </div>
  );
};

export default OccupantTab;
