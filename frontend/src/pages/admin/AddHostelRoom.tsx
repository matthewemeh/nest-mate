import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

import PageLayout from 'layouts/PageLayout';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { useAppSelector } from 'hooks/useRootStorage';
import { useCreateRoomMutation } from 'services/apis/roomApi/roomStoreApi';

import FaHotelDark from 'assets/fa-bed-dark.svg';
import FaHotelLight from 'assets/fa-bed-light.svg';

import Constants from 'Constants';
import { handleReduxQueryError, showAlert } from 'utils';

const AddHostelRoom = () => {
  const { hostelID } = useParams();
  const { ACCEPTED_IMAGE_TYPES } = Constants;

  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);
  const [createRoom, { error, isError, isLoading, isSuccess }] = useCreateRoomMutation();

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

  const handleAddRoom = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const floor: number = Number(floorRef.current!.value);
    const roomNumber: number = Number(roomNumberRef.current!.value);
    const maxOccupants: number = Number(occupantsRef.current!.value);
    const roomImage: File | undefined = roomImageRef.current!.files?.[0];

    const roomPayload: CreateRoomPayload = {
      floor,
      userID,
      roomImage,
      roomNumber,
      maxOccupants,
      hostelID: hostelID!
    };

    createRoom(roomPayload);
  };

  useEffect(() => {
    if (isSuccess) {
      setRoomImageChanged(false);
      const imageTag: HTMLImageElement = roomImagePreviewRef.current!;
      imageTag.src = prefersDarkMode ? FaHotelDark : FaHotelLight;

      showAlert({ msg: 'Room added successfully' });
      formRef.current!.reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    handleReduxQueryError(isError, error);
  }, [error, isError]);

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
          src={prefersDarkMode ? FaHotelDark : FaHotelLight}
          className={`mx-auto h-full ${roomImageChanged ? 'w-full' : 'w-2/5'}`}
        />
      </label>

      <form onSubmit={handleAddRoom} ref={formRef}>
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
          formatRule={{ allowedChars: '0123456789' }}
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <FormInput
          type='text'
          defaultValue='6'
          autoComplete='off'
          inputID='occupants'
          inputName='occupants'
          inputRef={occupantsRef}
          label='Maximum no. of occupants'
          extraLabelClassNames='mt-[15px]'
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
          title='Add Room'
          disabled={isLoading}
          isLoading={isLoading}
          extraClassNames={`!w-1/2 mx-auto ${
            prefersDarkMode &&
            'dark:bg-zircon dark:text-nile-blue-900 dark:hover:bg-transparent dark:hover:text-zircon'
          }`}
        />
      </form>
    </PageLayout>
  );
};

export default AddHostelRoom;
