import { MdDelete } from 'react-icons/md';
import { FaUserSlash } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageLayout from 'layouts/PageLayout';
import Button from 'components/buttons/Button';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { useAppSelector } from 'hooks/useRootStorage';
import { useGetRoomMutation, useUpdateRoomMutation } from 'services/apis/roomApi/roomStoreApi';

import FaHotelDark from 'assets/fa-bed-dark.svg';
import FaHotelLight from 'assets/fa-bed-light.svg';

import Constants from 'Constants';
import { showAlert } from 'utils';
import { PATHS } from 'routes/PathConstants';

const EditHostelRoom = () => {
  const { RESERVATIONS } = PATHS;
  const { ACCEPTED_IMAGE_TYPES } = Constants;

  const navigate = useNavigate();
  const { roomID } = useParams();
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);
  const [
    updateRoom,
    {
      error: updateError,
      isError: isUpdateError,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess
    }
  ] = useUpdateRoomMutation();
  const [
    getRoom,
    { data: room = {}, error: hostelError, isError: isHostelError, isLoading: isHostelLoading }
  ] = useGetRoomMutation();

  const {
    roomImageUrl,
    occupants = [],
    floor: defaultFloor = 0,
    roomNumber: defaultRoomNumber = 0,
    maxOccupants: defaultMaxOccupants = 6
  } = room as Room;

  const [roomImageChanged, setRoomImageChanged] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const floorRef = useRef<HTMLInputElement>(null);
  const occupantsRef = useRef<HTMLInputElement>(null);
  const roomImageRef = useRef<HTMLInputElement>(null);
  const roomNumberRef = useRef<HTMLInputElement>(null);
  const roomImagePreviewRef = useRef<HTMLImageElement>(null);

  const updatePreviewImage = (imageFile?: File | null) => {
    const imageTag: HTMLImageElement = roomImagePreviewRef.current!;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.addEventListener('load', () => {
        const result = `${reader.result ?? ''}`;
        imageTag.src = result;
      });
      setRoomImageChanged(true);
    } else {
      imageTag.src = prefersDarkMode ? FaHotelDark : FaHotelLight;
      setRoomImageChanged(false);
    }
  };

  const handleUpdateRoom = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const floor: number = Number(floorRef.current!.value);
    const roomNumber: number = Number(roomNumberRef.current!.value);
    const maxOccupants: number = Number(occupantsRef.current!.value);
    const roomImage: File | undefined = roomImageRef.current!.files?.[0];

    const roomPayload: UpdateRoomPayload = {
      floor,
      userID,
      roomImage,
      roomNumber,
      _id: roomID!,
      maxOccupants
    };

    updateRoom(roomPayload);
  };

  const handleDeleteOccupant = (occupantID: string, occupantName: string) => {
    const isDeletedConfirmed: boolean = window.confirm(
      `Are you sure you want to delete ${occupantName} from this room?`
    );
    if (isDeletedConfirmed) updateRoom({ _id: roomID!, userID, occupantID });
  };

  useEffect(() => {
    getRoom({ _id: roomID! });
  }, [roomID]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setRoomImageChanged(false);
      const imageTag: HTMLImageElement = roomImagePreviewRef.current!;
      imageTag.src = prefersDarkMode ? FaHotelDark : FaHotelLight;

      showAlert({ msg: 'Room added successfully' });
      formRef.current!.reset();
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isUpdateError && updateError && 'status' in updateError) {
      showAlert({ msg: `${updateError.data ?? ''}` });
      console.error(updateError);
    }
  }, [updateError, isUpdateError]);

  useEffect(() => {
    if (isHostelError && hostelError && 'status' in hostelError) {
      showAlert({ msg: `${hostelError.data ?? ''}` });
      console.error(hostelError);
    }
  }, [hostelError, isHostelError]);

  return (
    <PageLayout
      extraClassNames={`pl-[1.5%] pr-10 bg-swan-white p-8 rounded-lg grid grid-cols-[40%_60%] gap-5 ${
        prefersDarkMode && 'dark:bg-nile-blue-900'
      }`}>
      <label
        htmlFor='room-image'
        className={`cursor-pointer h-[80vh] shadow rounded-md overflow-hidden border-current ${
          roomImageChanged || 'border-4'
        }`}>
        <img
          alt=''
          loading='lazy'
          ref={roomImagePreviewRef}
          src={roomImageUrl || (prefersDarkMode ? FaHotelDark : FaHotelLight)}
          className={`mx-auto h-full ${roomImageChanged ? 'w-full' : 'w-2/5'}`}
        />
      </label>

      <form onSubmit={handleUpdateRoom} ref={formRef}>
        <h1 className='text-2xl font-semibold mt-4'>New Room information</h1>

        <FormInput
          required
          type='text'
          autoComplete='off'
          label='Room Number'
          inputID='room-number'
          inputName='room-number'
          inputRef={roomNumberRef}
          extraLabelClassNames='mt-[15px]'
          defaultValue={defaultRoomNumber.toString()}
          formatRule={{ allowedChars: '0123456789' }}
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <FormInput
          type='text'
          inputID='floor'
          inputName='floor'
          autoComplete='off'
          label='Floor Number'
          inputRef={floorRef}
          extraLabelClassNames='mt-[15px]'
          defaultValue={defaultFloor.toString()}
          formatRule={{ allowedChars: '0123456789' }}
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <FormInput
          type='text'
          autoComplete='off'
          inputID='occupants'
          inputName='occupants'
          inputRef={occupantsRef}
          label='Maximum no. of occupants'
          extraLabelClassNames='mt-[15px]'
          defaultValue={defaultMaxOccupants.toString()}
          formatRule={{ allowedChars: '0123456789' }}
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <FormInput
          type='file'
          label='Room Image'
          inputID='room-image'
          inputName='room-image'
          inputRef={roomImageRef}
          accept={ACCEPTED_IMAGE_TYPES}
          extraLabelClassNames='mt-[15px]'
          onChange={e => updatePreviewImage(e.target.files?.[0])}
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <AuthButton
          type='submit'
          title='Update Room'
          disabled={isUpdateLoading}
          isLoading={isUpdateLoading}
          extraClassNames={`!w-1/2 mx-auto ${
            prefersDarkMode &&
            'dark:bg-zircon dark:text-nile-blue-900 dark:hover:bg-transparent dark:hover:text-zircon'
          }`}
        />
      </form>

      <div className='col-start-1 col-end-3'>
        <h1>Room Occupants</h1>

        <div>
          {occupants.length > 0 ? (
            occupants.map(({ name, _id }) => (
              <div className=' flex items-center justify-between'>
                {name}
                <MdDelete
                  className='text-red-600'
                  onClick={() => handleDeleteOccupant(_id, name)}
                />
              </div>
            ))
          ) : (
            <div className='flex flex-col gap-4 items-center justify-center'>
              <FaUserSlash className='w-10 h-10' />
              No Occupants Available
              <Button content='Check Reservations' onClick={() => navigate(RESERVATIONS)} />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default EditHostelRoom;
