import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useMemo } from 'react';

import Loading from 'components/Loading';
import PageLayout from 'layouts/PageLayout';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { useAppSelector } from 'hooks/useRootStorage';
import {
  useGetHostelMutation,
  useUpdateHostelMutation
} from 'services/apis/hostelApi/hostelStoreApi';

import FaHotelDark from 'assets/fa-bed-dark.svg';
import FaHotelLight from 'assets/fa-bed-light.svg';

import Constants from 'Constants';
import { handleReduxQueryError, showAlert } from 'utils';

const EditHostel = () => {
  const { ACCEPTED_IMAGE_TYPES } = Constants;

  const navigate = useNavigate();
  const { hostelID } = useParams();
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);
  const [
    updateHostel,
    {
      error: updateError,
      isError: isUpdateError,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess
    }
  ] = useUpdateHostelMutation();
  const [
    getHostel,
    { data: hostel = {}, error: hostelError, isError: isHostelError, isLoading: isHostelLoading }
  ] = useGetHostelMutation();

  const {
    hostelImageUrl,
    name: defaultName = '',
    floors: defaultFloors = 0
  } = useMemo(() => hostel as Hostel, [hostel]);

  const [hostelImageChanged, setHostelImageChanged] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const floorsRef = useRef<HTMLInputElement>(null);
  const hostelNameRef = useRef<HTMLInputElement>(null);
  const hostelImageRef = useRef<HTMLInputElement>(null);
  const hostelImagePreviewRef = useRef<HTMLImageElement>(null);

  const updatePreviewImage = (imageFile?: File | null) => {
    const imageTag: HTMLImageElement = hostelImagePreviewRef.current!;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.addEventListener('load', () => {
        const result = `${reader.result ?? ''}`;
        imageTag.src = result;
      });
      setHostelImageChanged(true);
    } else {
      imageTag.src = hostelImageUrl || (prefersDarkMode ? FaHotelDark : FaHotelLight);
      setHostelImageChanged(false);
    }
  };

  const handleUpdateHostel = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const name: string = hostelNameRef.current!.value;
    const floors: number = Number(floorsRef.current!.value);
    const hostelImage: File | undefined = hostelImageRef.current!.files?.[0];

    const hostelPayload: UpdateHostelPayload = { userID, _id: hostelID! };

    if (floors !== defaultFloors) hostelPayload.floors = floors;
    if (hostelImageChanged) hostelPayload.hostelImage = hostelImage;
    if (name !== defaultName) hostelPayload.name = name;

    if (Object.keys(hostelPayload).length === 2) {
      return showAlert({ msg: 'No changes made!' });
    }

    updateHostel(hostelPayload);
  };

  useEffect(() => {
    getHostel({ _id: hostelID! });
  }, [hostelID]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setHostelImageChanged(false);
      const imageTag: HTMLImageElement = hostelImagePreviewRef.current!;
      imageTag.src = hostelImageUrl || (prefersDarkMode ? FaHotelDark : FaHotelLight);

      showAlert({ msg: 'Hostel updated successfully' });
      formRef.current!.reset();
      navigate(`/hostels/${hostelID}/rooms`);
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    handleReduxQueryError(isUpdateError, updateError);
  }, [updateError, isUpdateError]);

  useEffect(() => {
    handleReduxQueryError(isHostelError, hostelError);
  }, [hostelError, isHostelError]);

  return (
    <PageLayout>
      <section className='mod-1 pl-[1.5%] pr-10 bg-swan-white p-8 rounded-lg grid grid-cols-[40%_60%] gap-5'>
        <label
          htmlFor='hostel-image'
          className={`cursor-pointer h-[80vh] shadow rounded-md overflow-hidden border-current ${
            hostelImageChanged || 'border-4'
          }`}>
          <img
            alt=''
            loading='lazy'
            ref={hostelImagePreviewRef}
            src={hostelImageUrl || (prefersDarkMode ? FaHotelDark : FaHotelLight)}
            className={`mx-auto h-full ${
              hostelImageChanged || hostelImageUrl ? 'w-full' : 'w-2/5'
            }`}
          />
        </label>

        {isHostelLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleUpdateHostel} ref={formRef}>
            <h1 className='text-2xl font-semibold mt-4'>Edit Hostel information</h1>

            <FormInput
              required
              type='text'
              autoComplete='off'
              spellCheck={false}
              label='Hostel Name'
              inputID='hostel-name'
              inputName='hostel-name'
              inputRef={hostelNameRef}
              defaultValue={defaultName}
              extraLabelClassNames='mt-8'
              extraInputClassNames='mod-1'
            />

            <FormInput
              type='text'
              inputID='floors'
              inputName='floors'
              autoComplete='off'
              inputRef={floorsRef}
              label='Number of Floors'
              extraLabelClassNames='mt-[15px]'
              defaultValue={defaultFloors.toString()}
              formatRule={{ allowedChars: '0123456789' }}
              extraInputClassNames='mod-1'
            />

            <FormInput
              type='file'
              label='Hostel Image'
              inputID='hostel-image'
              inputName='hostel-image'
              inputRef={hostelImageRef}
              accept={ACCEPTED_IMAGE_TYPES}
              extraLabelClassNames='mt-[15px]'
              onChange={e => updatePreviewImage(e.target.files?.[0])}
              extraInputClassNames='mod-1'
            />

            <AuthButton
              type='submit'
              title='Update Hostel'
              disabled={isUpdateLoading}
              isLoading={isUpdateLoading}
              extraClassNames='!w-1/2 mx-auto mod-1'
            />
          </form>
        )}
      </section>
    </PageLayout>
  );
};

export default EditHostel;
