import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as PushAPI from '@pushprotocol/restapi';
import FundCard from './FundCard';
import { loader } from '../assets';
import Web3Modal from 'web3modal';
import { providers, Contract, ethers } from 'ethers';
import { useStateContext } from '../context';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const { address } = useStateContext();
  const web3ModalRef = useRef();

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: 'goerli',
      providerOptions: {},
      disableInjectedProvider: false,
    });
  }, [])
  
  let _signer;
  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    _signer = web3Provider.getSigner();
    // console.log(web3Provider);
    // console.log(_signer);
  };

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const optout = async () => {
    console.log(address);
    getProviderOrSigner;
    await PushAPI.channels.unsubscribe({
      signer: _signer,
      channelAddress: 'eip155:5:0xFFd01a76cA473B48431E27Ab36f61a764270238F', // channel address in CAIP
      userAddress: 'eip155:5:' + address, // user address in CAIP
      onSuccess: () => {
        console.log('opt out success');
      },
      onError: () => {
        console.error('opt out error');
      },
      env: 'staging',
    });
  };

  const optin = async () => {
    console.log(address);
    getProviderOrSigner();
    await PushAPI.channels.subscribe({
      signer: _signer,
      // channelAddress: 'eip155:5:0x762cA62ca2549ad806763B3Aa1eA317c429bDBDa', // channel address in CAIP
      // userAddress: `eip155:5:${address}`, // user address in CAIP
      channelAddress: 'eip155:5:0xFFd01a76cA473B48431E27Ab36f61a764270238F', // channel address in CAIP
      userAddress: 'eip155:5:' + address, // user address in CAIP
      onSuccess: () => {
        console.log('opt in success');
      },
      onError: () => {
        console.error('opt in error');
      },
      env: 'staging',
    });
  };

  return (
    <div>
      <div className="w-fit flex justify-start items-center p-4 bg-[#8c6dfd] h-[23px] rounded-[10px] mb-8">
        <p className="font-epilogue font-bold text-[15px]">
          Join the Push notification channel!! Never miss out on any good cause 😊{' '}
          <button className="bg-primary rounded-[10px] p-1 mr-10 ml-36" onClick={optin}>
            Opt-In
          </button>{' '}
          <button className="bg-primary rounded-[10px] p-1 mr-14" onClick={optout}>
            Opt-Out
          </button>
        </p>
      </div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campigns yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard key={campaign.id} {...campaign} handleClick={() => handleNavigate(campaign)} />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
