import { MdDelete } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { RiUser3Line } from 'react-icons/ri';

import Dropdown from './Dropdown';
import Constants from '../Constants';

import { getDateProps, showAlert } from 'utils';
import { updateUsers } from 'services/apis/userApi/userStoreSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';
import { useDeleteUserMutation, useUpdateUserMutation } from 'services/apis/userApi/userStoreApi';

interface Props {
  user: User;
}

const UserTab: React.FC<Props> = ({ user }) => {
  const { ROLES } = Constants;
  const dispatch = useAppDispatch();
  const { name, role, profileImageUrl, createdAt, _id } = user;
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { currentUser, allUsers, paginatedUsers } = useAppSelector(state => state.userStore);
  const { _id: userID, role: userRole } = currentUser;

  const [newRole, setNewRole] = useState<string>(role);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const { longMonthName, monthDate, year } = getDateProps(createdAt);
  const [updateUser, { error: updateError, isError: isUpdateError, isSuccess: isUpdateSuccess }] =
    useUpdateUserMutation();

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
    if (isDeleteConfirmed) deleteUser({ _id, userID });
  };

  useEffect(() => {
    if (isUpdateError && updateError && 'status' in updateError) {
      showAlert({ msg: `${updateError.data ?? ''}` });
      console.error(updateError);
    }
  }, [updateError, isUpdateError]);

  useEffect(() => {
    if (isDeleteError && deleteError && 'status' in deleteError) {
      showAlert({ msg: `${deleteError.data ?? ''}` });
      console.error(deleteError);
    }
  }, [deleteError, isDeleteError]);

  useEffect(() => {
    if (isUpdateSuccess) showAlert({ msg: 'Role update successful' });
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isDeleteSuccess) {
      dispatch(
        updateUsers({
          allUsers: allUsers.filter(user => user._id !== _id),
          paginatedUsers: paginatedUsers.filter(user => user._id !== _id)
        })
      );
      showAlert({ msg: 'Deleted user successfully' });
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (newRole !== role) updateUser({ _id, userID, role: newRole as Role });
  }, [newRole]);

  return (
    <div
      className={`grid mb-3 bg-zircon p-4 rounded-md items-center last:mb-0 ${
        prefersDarkMode && 'dark:bg-nile-blue-950'
      } ${
        userRole === ROLES.SUPER_ADMIN ? 'grid-cols-[repeat(4,minmax(0,1fr))_30px]' : 'grid-cols-4'
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
      <p>{name}</p>
      <p>
        Joined {longMonthName} {monthDate}, {year}
      </p>
      <Dropdown
        selectedValue={newRole}
        setSelectedItem={setNewRole}
        extraDropdownButtonClassNames='mx-auto'
        list={Object.values(ROLES).filter(role => role !== ROLES.SUPER_ADMIN)}
      />

      {userRole === ROLES.SUPER_ADMIN && (
        <MdDelete
          onClick={handleDeleteUser}
          className={`w-full h-full cursor-pointer text-red-600 ${
            (isDeleteLoading || isDeleteSuccess) && 'opacity-0 invisible'
          }`}
        />
      )}
    </div>
  );
};

export default UserTab;
