import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import PageLayout from 'layouts/PageLayout';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { PATHS } from 'routes/PathConstants';
import { logout } from 'services/apis/userApi/userStoreSlice';
import { resetUserData } from 'services/userData/userDataSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
  useDeleteProfileImageMutation
} from 'services/apis/userApi/userStoreApi';

import Constants from 'Constants';
import { showAlert } from 'utils';
import RiUser3Line from 'assets/ri-user-3-line.svg';

const Profile = () => {
  const { FORGOT_PASSWORD, LOGIN } = PATHS;
  const { ACCEPTED_IMAGE_TYPES } = Constants;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const nameRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const profileImagePreviewRef = useRef<HTMLImageElement>(null);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [
    deleteProfileImage,
    {
      error: profileImageError,
      isError: isProfileImagError,
      isLoading: isProfileImageLoading,
      isSuccess: isProfileImageSuccess
    }
  ] = useDeleteProfileImageMutation();
  const [
    updateUser,
    {
      error: updateError,
      isError: isUpdateError,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess
    }
  ] = useUpdateUserMutation();
  const [
    deleteUser,
    {
      error: deleteError,
      isError: isDeleteError,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess
    }
  ] = useDeleteUserMutation();
  const { _id, name, email, profileImageUrl } = useAppSelector(
    state => state.userStore.currentUser
  );
  const { prefersDarkMode } = useAppSelector(state => state.userData);

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newName: string = nameRef.current!.value;
    const profileImage: File | undefined = profileImageRef.current!.files?.[0];

    const userPayload: UserUpdatePayload = { _id, userID: _id };

    if (name !== newName) userPayload.name = newName;
    if (profileImageChanged) userPayload.profileImage = profileImage;

    if (Object.keys(userPayload).length === 2) {
      return showAlert({ msg: 'No changes made!' });
    }

    updateUser(userPayload);
  };

  const updatePreviewImage = (imageFile?: File | null) => {
    const imageTag: HTMLImageElement = profileImagePreviewRef.current!;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.addEventListener('load', () => {
        const result = `${reader.result ?? ''}`;
        imageTag.src = result;
      });
      setProfileImageChanged(true);
    } else {
      imageTag.src = profileImageUrl || RiUser3Line;
      setProfileImageChanged(false);
    }
  };

  const handleResetPassword = () => {
    dispatch(logout());
    dispatch(resetUserData());
    navigate(FORGOT_PASSWORD);
  };

  const handleDeleteUser = () => {
    const isDeleteConfirmed: boolean = window.confirm(
      'Are you sure you want to delete your account?'
    );
    if (isDeleteConfirmed) deleteUser({ _id, userID: _id });
  };

  const handleDeleteUserImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isDeleteImageConfirmed: boolean = window.confirm(
      'Are you sure you want to delete your profile picture?'
    );
    if (isDeleteImageConfirmed) deleteProfileImage({ _id, userID: _id });
    e.stopPropagation();
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      setProfileImageChanged(false);
      profileImageRef.current!.value = '';
      showAlert({ msg: 'Updated details successfully' });
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isProfileImageSuccess) {
      showAlert({ msg: 'Profile picture deleted successfully' });
      profileImageRef.current!.value = '';
    }
  }, [isProfileImageSuccess]);

  useEffect(() => {
    if (isDeleteSuccess) {
      dispatch(logout());
      dispatch(resetUserData());
      navigate(LOGIN);
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (isUpdateError && updateError && 'status' in updateError) {
      showAlert({ msg: `${updateError.data ?? 'An error occured while updating your profile'}` });
      console.error(updateError);
    }
  }, [updateError, isUpdateError]);

  useEffect(() => {
    if (isDeleteError && deleteError && 'status' in deleteError) {
      showAlert({ msg: `${deleteError.data ?? 'An error occured while deleting your profile'}` });
      console.error(deleteError);
    }
  }, [deleteError, isDeleteError]);

  useEffect(() => {
    if (isProfileImagError && profileImageError && 'status' in profileImageError) {
      showAlert({
        msg: `${profileImageError.data ?? 'An error occured while deleting your profile'}`
      });
      console.error(profileImageError);
    }
  }, [profileImageError, isProfileImagError]);

  return (
    <PageLayout>
      <section
        className={`bg-swan-white p-8 rounded-lg flex flex-col items-center ${
          prefersDarkMode && 'dark:bg-nile-blue-900'
        }`}>
        <label htmlFor='profile-image' className='relative cursor-pointer'>
          <img
            alt=''
            ref={profileImagePreviewRef}
            src={profileImageUrl || RiUser3Line}
            className={`w-[100px] h-[100px] text-current rounded-half bg-zircon border-2 border-nile-blue-900 ${
              prefersDarkMode && 'dark:border-zircon'
            }`}
          />
          <button
            onClick={handleDeleteUserImage}
            disabled={isProfileImageLoading}
            className={`text-nile-blue-900 absolute bottom-[4%] right-[4%] bg-zircon rounded-full p-1 ${
              profileImageUrl ? '' : 'opacity-0 invisible'
            }`}>
            <MdDelete />
          </button>
        </label>
        <h1 className='text-2xl font-semibold mt-4'>Update your details</h1>

        <form onSubmit={handleUpdateUser}>
          <FormInput
            readOnly
            disabled
            type='email'
            label='Email'
            inputID='email'
            inputName='email'
            defaultValue={email}
            autoComplete='username'
            extraLabelClassNames='mt-8'
            extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
          />

          <FormInput
            required
            type='text'
            label='Full Name'
            inputRef={nameRef}
            spellCheck={false}
            inputID='full-name'
            defaultValue={name}
            inputName='full-name'
            autoComplete='full-name'
            extraLabelClassNames='mt-[15px]'
            extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
          />

          <FormInput
            type='file'
            label='Profile Image'
            inputID='profile-image'
            onChange={e => {
              const imageFile: File | undefined = e.target.files?.[0];
              updatePreviewImage(imageFile);
            }}
            inputName='profile-image'
            inputRef={profileImageRef}
            accept={ACCEPTED_IMAGE_TYPES}
            extraLabelClassNames='mt-[15px]'
            extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
          />

          <AuthButton
            type='submit'
            title='Update'
            disabled={isUpdateLoading}
            isLoading={isUpdateLoading}
            extraClassNames={`${
              prefersDarkMode &&
              'dark:bg-zircon dark:text-nile-blue-900 dark:hover:bg-transparent dark:hover:text-zircon'
            }`}
          />

          <AuthButton
            type='button'
            title='Reset Password?'
            onClick={handleResetPassword}
            extraClassNames={`!bg-transparent !text-nile-blue-900 !border-transparent h-0 shadow-none w-max mx-auto ${
              prefersDarkMode && 'dark:!text-zircon'
            }`}
          />

          <AuthButton
            type='button'
            title='Delete Account'
            onClick={handleDeleteUser}
            disabled={isDeleteLoading}
            isLoading={isDeleteLoading}
            extraClassNames={`!bg-red-600 !text-swan-white h-0 ${
              prefersDarkMode && 'dark:!border-transparent'
            }`}
          />
        </form>
      </section>
    </PageLayout>
  );
};

export default Profile;
