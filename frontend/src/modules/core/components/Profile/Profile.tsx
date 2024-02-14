// import { useAppDispatch, useAppSelector } from '../../../state/hooks';
// import { logout } from '../../../state/reducers/authReducer/authReducer';
import React, { type SyntheticEvent } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import Avatar from 'antd/es/avatar/avatar';

import './Profile.scss';

import { useNavigate } from 'react-router-dom';

import { type AuthState } from '../../../authentication/interfaces';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';

const Profile: React.FC = () => {
  //   const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState: AuthState = useAppSelector(({ auth }) => auth);
  const items: MenuProps['items'] = [
    {
      key: 'profile-menu-name',
      label: (
        <span className="flex flex-col">
          <span className="font-semibold">{authState.user.username}</span>
          {authState.user.email}
        </span>
      )
    },
    {
      type: 'divider'
    },
    {
      key: 'profile-settings',
      label: <span className="font-semibold">Profile Settings</span>
    },
    {
      type: 'divider'
    },
    {
      label: <span>Log Out</span>,
      key: '2'
    }
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile-settings') {
      navigate('/profile');
      //   dispatch(logout(''));
    }
    if (key === '2') {
      //   dispatch(logout(''));
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Dropdown menu={{ items, onClick }} trigger={['click']}>
        <div
          onClick={(event: SyntheticEvent) => {
            event.preventDefault();
          }}
          className="flex items-center cursor-pointer"
        >
          <Avatar
            className="hover:scale-110 transition ease-in-out delay-100"
            style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
          >
            {authState.user.username?.substring(0, 1)}
          </Avatar>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
