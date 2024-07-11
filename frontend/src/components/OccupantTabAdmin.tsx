import { MdDelete } from 'react-icons/md';
import { GiExitDoor } from 'react-icons/gi';
import { RiUser3Line } from 'react-icons/ri';
import { useEffect, useMemo, useState } from 'react';

import Dropdown from './Dropdown';
import Button from './buttons/Button';
import SwitchInput from './SwitchInput';

import { useAppSelector } from 'hooks/useRootStorage';
import { useUpdateRoomMutation } from 'services/apis/roomApi/roomStoreApi';
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUserCheckInMutation,
  useUserCheckOutMutation
} from 'services/apis/userApi/userStoreApi';

import Constants from 'Constants';
import { handleReduxQueryError, showAlert } from 'utils';

interface Props {
  roomID: string;
  occupant: User;
}

const OccupantTabAdmin: React.FC<Props> = ({ occupant, roomID }) => {
  const { ROLES } = Constants;
  const { _id, name, role, profileImageUrl, checkedIn } = occupant;
  const [newRole, setNewRole] = useState<string>(role);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(checkedIn);
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { _id: userID, role: userRole } = useAppSelector(state => state.userStore.currentUser);

  const isYou = useMemo<boolean>(() => _id === userID, [_id, userID]);

  const [
    updateRoom,
    {
      error: updateRoomError,
      isError: isUpdateRoomError,
      isLoading: isUpdateRoomLoading,
      isSuccess: isUpdateRoomSuccess
    }
  ] = useUpdateRoomMutation();

  const [
    deleteUser,
    {
      error: deleteError,
      isError: isDeleteError,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess
    }
  ] = useDeleteUserMutation();

  const handleDeleteUser = () => {
    const isDeleteConfirmed: boolean = window.confirm(
      `Are you sure you want to delete ${name}'s account?`
    );
    if (isDeleteConfirmed) deleteUser({ _id, userID: _id });
  };

  const handleEvictOccupant = (occupantID: string, occupantName: string) => {
    const isDeletedConfirmed: boolean = window.confirm(
      `Are you sure you want to evict ${occupantName} from this room?`
    );
    if (isDeletedConfirmed) updateRoom({ _id: roomID!, userID, occupantID });
  };

  const [
    updateUser,
    {
      error: updateUserError,
      isError: isUpdateUserError,
      isSuccess: isUpdateUserSuccess,
      isLoading: isUpdateUserLoading
    }
  ] = useUpdateUserMutation();

  const [
    checkIn,
    {
      error: checkInError,
      isError: isCheckInError,
      isSuccess: isCheckInSuccess,
      isLoading: isCheckInLoading
    }
  ] = useUserCheckInMutation();

  const [
    checkOut,
    {
      error: checkOutError,
      isError: isCheckOutError,
      isSuccess: isCheckOutSuccess,
      isLoading: isCheckOutLoading
    }
  ] = useUserCheckOutMutation();

  useEffect(() => {
    if (isUpdateUserSuccess) showAlert({ msg: 'Role update successful' });
  }, [isUpdateUserSuccess]);

  useEffect(() => {
    if (isUpdateRoomSuccess) showAlert({ msg: `${name} evicted from this room` });
  }, [isUpdateRoomSuccess]);

  useEffect(() => {
    if (isCheckInSuccess) showAlert({ msg: `${name} has checked in` });
  }, [isCheckInSuccess]);

  useEffect(() => {
    if (isCheckOutSuccess) showAlert({ msg: `${name} has checked out` });
  }, [isCheckOutSuccess]);

  useEffect(() => {
    if (newRole !== role) updateUser({ _id, userID, role: newRole as Role });
  }, [newRole]);

  useEffect(() => {
    if (isCheckedIn !== checkedIn) {
      if (isCheckedIn) checkIn({ _id, userID, roomID });
      else checkOut({ _id, userID, roomID });
    }
  }, [isCheckedIn]);

  useEffect(() => {
    handleReduxQueryError(isUpdateUserError, updateUserError);
  }, [updateUserError, isUpdateUserError]);

  useEffect(() => {
    handleReduxQueryError(isUpdateRoomError, updateRoomError);
  }, [updateRoomError, isUpdateRoomError]);

  useEffect(() => {
    handleReduxQueryError(isDeleteError, deleteError);
  }, [deleteError, isDeleteError]);

  useEffect(() => {
    handleReduxQueryError(isCheckInError, checkInError);
  }, [checkInError, isCheckInError]);

  useEffect(() => {
    handleReduxQueryError(isCheckOutError, checkOutError);
  }, [checkOutError, isCheckOutError]);

  return (
    <div
      key={_id}
      className={`grid gap-10 items-center px-4 py-2.5 bg-lightning-yellow-100 rounded-md shadow-md ${
        userRole === ROLES.SUPER_ADMIN
          ? 'grid-cols-[auto_repeat(1,minmax(0,1fr))_120px_auto_auto_50px]'
          : 'grid-cols-[auto_repeat(1,minmax(0,1fr))_120px_auto_auto]'
      }`}>
      <div className='block relative w-10 h-10 bg-zircon rounded-half cursor-pointer'>
        <img
          alt=''
          loading='lazy'
          src={profileImageUrl}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full rounded-half ${imageLoaded || 'opacity-0 invisible'}`}
        />
        {imageLoaded || (
          <RiUser3Line
            className={`absolute p-2 top-0 left-0 w-full h-full text-current border rounded-full ${
              prefersDarkMode && 'dark:text-nile-blue-900'
            }`}
          />
        )}
      </div>

      <p>{isYou ? 'You' : name}</p>

      <SwitchInput
        width={48}
        height={20}
        label='Check in'
        onColor='#78370f'
        handleDiameter={30}
        checkedIcon={false}
        uncheckedIcon={false}
        checked={isCheckedIn}
        switchID='checked-in'
        onHandleColor='#fbc324'
        setChecked={setIsCheckedIn}
        extraClassNames='max-w-[210px] ml-auto'
        boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
        activeBoxShadow='0px 0px 1px 10px rgba(0, 0, 0, 0.2)'
        disabled={isCheckInLoading || isCheckOutLoading || isCheckInSuccess || isCheckOutSuccess}
      />

      <Dropdown
        selectedValue={newRole}
        setSelectedItem={setNewRole}
        extraDropdownButtonClassNames='mx-auto'
        disabled={isYou || isUpdateUserLoading || isUpdateUserSuccess}
        list={Object.values(ROLES).filter(role => role !== ROLES.SUPER_ADMIN)}
      />

      <Button
        onClick={() => handleEvictOccupant(_id, name)}
        extraClassNames='flex items-center justify-between gap-3'
        disabled={isYou || isUpdateRoomLoading || isUpdateRoomSuccess}
        content={
          <>
            <GiExitDoor className='text-red-600 cursor-pointer' />
            Evict
          </>
        }
      />

      {userRole === ROLES.SUPER_ADMIN && (
        <Button
          onClick={handleDeleteUser}
          extraClassNames='w-full h-full'
          disabled={isDeleteLoading || isDeleteSuccess}
          content={<MdDelete className='w-full h-full text-red-600' />}
        />
      )}
    </div>
  );
};

export default OccupantTabAdmin;
