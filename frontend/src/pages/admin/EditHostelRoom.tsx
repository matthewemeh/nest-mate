import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect, useMemo } from 'react';

import Loading from 'components/Loading';
import PageLayout from 'layouts/PageLayout';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { useAppSelector } from 'hooks/useRootStorage';
import { useGetRoomMutation, useUpdateRoomMutation } from 'services/apis/roomApi/roomStoreApi';

import FaHotelDark from 'assets/fa-bed-dark.svg';
import FaHotelLight from 'assets/fa-bed-light.svg';

import Constants from 'Constants';
import { handleReduxQueryError, showAlert } from 'utils';

const EditHostelRoom = () => {
  const { ACCEPTED_IMAGE_TYPES } = Constants;

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
    floor: defaultFloor = 0,
    roomNumber: defaultRoomNumber = 0,
    maxOccupants: defaultMaxOccupants = 6
  } = useMemo(() => room as Room, [room]);

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
      imageTag.src = roomImageUrl || (prefersDarkMode ? FaHotelDark : FaHotelLight);
      setRoomImageChanged(false);
    }
  };

  const handleUpdateRoom = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const floor: number = Number(floorRef.current!.value);
    const roomNumber: number = Number(roomNumberRef.current!.value);
    const maxOccupants: number = Number(occupantsRef.current!.value);
    const roomImage: File | undefined = roomImageRef.current!.files?.[0];

    const roomPayload: UpdateRoomPayload = { userID, _id: roomID! };

    if (floor !== defaultFloor) roomPayload.floor = floor;
    if (roomImageChanged) roomPayload.roomImage = roomImage;
    if (roomNumber !== defaultRoomNumber) roomPayload.roomNumber = roomNumber;
    if (maxOccupants !== defaultMaxOccupants) roomPayload.maxOccupants = maxOccupants;

    if (Object.keys(roomPayload).length === 2) {
      return showAlert({ msg: 'No changes made!' });
    }

    updateRoom(roomPayload);
  };

  useEffect(() => {
    getRoom({ _id: roomID! });
  }, [roomID]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setRoomImageChanged(false);
      const imageTag: HTMLImageElement = roomImagePreviewRef.current!;
      imageTag.src = roomImageUrl || (prefersDarkMode ? FaHotelDark : FaHotelLight);

      showAlert({ msg: 'Room updated successfully' });
      formRef.current!.reset();
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    handleReduxQueryError(isUpdateError, updateError);
  }, [updateError, isUpdateError]);

  useEffect(() => {
    handleReduxQueryError(isHostelError, hostelError);
  }, [hostelError, isHostelError]);

  return (
    <PageLayout extraClassNames='mod-1 pl-[1.5%] pr-10 bg-swan-white p-8 rounded-lg grid grid-cols-[40%_60%] gap-5'>
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
          className={`mx-auto h-full ${roomImageChanged || roomImageUrl ? 'w-full' : 'w-2/5'}`}
        />
      </label>

      {isHostelLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleUpdateRoom} ref={formRef}>
          <h1 className='text-2xl font-semibold mt-4'>Edit Room information</h1>

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
            extraInputClassNames='mod-1'
          />

          <FormInput
            type='text'
            inputID='floor'
            inputName='floor'
            autoComplete='off'
            inputRef={floorRef}
            label='Floor Number'
            extraLabelClassNames='mt-[15px]'
            defaultValue={defaultFloor.toString()}
            formatRule={{ allowedChars: '0123456789' }}
            extraInputClassNames='mod-1'
          />

          <FormInput
            type='text'
            autoComplete='off'
            inputID='occupants'
            inputName='occupants'
            inputRef={occupantsRef}
            label='Maximum no. of occupants'
            extraLabelClassNames='mt-[15px]'
            formatRule={{ allowedChars: '0123456789' }}
            defaultValue={defaultMaxOccupants.toString()}
            extraInputClassNames='mod-1'
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
            extraInputClassNames='mod-1'
          />

          <AuthButton
            type='submit'
            title='Update Room'
            disabled={isUpdateLoading}
            isLoading={isUpdateLoading}
            extraClassNames='mod-1 !w-1/2 mx-auto'
          />
        </form>
      )}
    </PageLayout>
  );
};

export default EditHostelRoom;
