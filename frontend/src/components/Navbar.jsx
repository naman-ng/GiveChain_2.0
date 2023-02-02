import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, logo1, menu, search, thirdweb, bell } from '../assets';
import { navlinks } from '../constants';
import Notifications from 'react-notifications-menu';
import * as PushAPI from '@pushprotocol/restapi';


const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address } = useStateContext();
  const [notifData, setNotifData] = useState([]);

  const getNotifications = async () => {
    let addr = address;
    if (!addr) {
      addr = "0x762ca62ca2549ad806763b3aa1ea317c429bdbda";
    }
    let notificationsData = await PushAPI.user.getFeeds({
      // user: `eip155:80001:${getA()}`, // user address in CAIP
      user: 'eip155:80001:' + addr, // user address in CAIP
      // user: 'eip155:80001:', // user address in CAIP
      env: 'staging',
    });
    // console.log(notificationsData);
    const numberOfNotif = notificationsData.length;

    const final = [];
    // console.log(numberOfNotif);
    for(let i = 0; i < numberOfNotif; i++) {
      final.push({
        image: bell,
        message: notificationsData[i].message
      })
    }
    // console.log(final);
    setNotifData(final);
  };

  
  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <h1 className="justify-center items-center text-center text-5xl">
        <span className="text-button">G</span>ive<span className="text-button">C</span>hain
      </h1>
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-yellow rounded-[100px]">
        <input
          type="text"
          placeholder="Search for campaigns"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-black text-white bg-yellow outline-none"
        />

        <div className="w-[72px] h-full rounded-[20px] bg-button flex justify-center items-center cursor-pointer">
          <img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
        </div>
      </div>
      
      <button className="mt-5" onClick={getNotifications}>
      {/* <button onClick={getNotifications}></button> */}
        <Notifications data={notifData} icon={bell} />
      </button>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={address ? 'Create a campaign' : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => {
            if (address) navigate('create-campaign');
            else connect();
          }}
        />

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-button flex justify-center items-center cursor-pointer">
            <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-button flex justify-center items-center cursor-pointer">
          <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-secondary z-10 shadow-secondary py-4 ${
            !toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? 'text-[#1dc071]' : 'text-black'
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? 'Create a campaign' : 'Connect'}
              styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
              handleClick={() => {
                if (address) navigate('create-campaign');
                else connect();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
