import { useRef, useState, useEffect } from 'react';

import PageLayout from 'layouts/PageLayout';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { useAppSelector } from 'hooks/useRootStorage';
import { useCreateHostelMutation } from 'services/apis/hostelApi/hostelStoreApi';

import FaHotelDark from 'assets/fa-hotel-dark.svg';
import FaHotelLight from 'assets/fa-hotel-light.svg';

import Constants from 'Constants';
import { handleReduxQueryError, showAlert } from 'utils';

const AddHostel = () => {
  const { ACCEPTED_IMAGE_TYPES } = Constants;

  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);
  const [createHostel, { error, isError, isLoading, isSuccess }] = useCreateHostelMutation();

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
      imageTag.src = prefersDarkMode ? FaHotelDark : FaHotelLight;
      setHostelImageChanged(false);
    }
  };

  const handleAddHostel = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const name: string = hostelNameRef.current!.value;
    const floors: number = Number(floorsRef.current!.value);
    const hostelImage: File | undefined = hostelImageRef.current!.files?.[0];

    const hostelPayload: CreateHostelPayload = { name, floors, userID, hostelImage };

    createHostel(hostelPayload);
  };

  useEffect(() => {
    if (isSuccess) {
      setHostelImageChanged(false);
      const imageTag: HTMLImageElement = hostelImagePreviewRef.current!;
      imageTag.src = prefersDarkMode ? FaHotelDark : FaHotelLight;

      showAlert({ msg: 'Hostel added successfully' });
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
        htmlFor='hostel-image'
        className={`cursor-pointer h-[80vh] shadow rounded-md overflow-hidden border-current ${
          hostelImageChanged || 'border-4'
        }`}>
        <img
          alt=''
          loading='lazy'
          ref={hostelImagePreviewRef}
          src={prefersDarkMode ? FaHotelDark : FaHotelLight}
          className={`mx-auto h-full ${hostelImageChanged ? 'w-full' : 'w-2/5'}`}
        />
      </label>

      <form onSubmit={handleAddHostel} ref={formRef}>
        <h1 className='text-2xl font-semibold mt-4'>New Hostel information</h1>

        <FormInput
          required
          type='text'
          autoComplete='off'
          spellCheck={false}
          label='Hostel Name'
          inputID='hostel-name'
          inputName='hostel-name'
          inputRef={hostelNameRef}
          extraLabelClassNames='mt-8'
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <FormInput
          type='text'
          inputID='floors'
          inputName='floors'
          autoComplete='off'
          inputRef={floorsRef}
          label='Number of Floors'
          extraLabelClassNames='mt-[15px]'
          formatRule={{ allowedChars: '0123456789' }}
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
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
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <AuthButton
          type='submit'
          title='Add Hostel'
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

export default AddHostel;
