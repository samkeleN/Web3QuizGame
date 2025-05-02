'use client';

import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from '@selfxyz/qrcode';
import { logo } from '../../data/birthdayAppLogo';

export default function QrWrapper({ address }: { address: string }) {

  const selfApp = new SelfAppBuilder({
    appName: "Self Birthday",
    scope: "Self-Denver-Birthday",
    // endpoint: "https://happy-birthday-rho-nine.vercel.app/api/verify",
    // run `ngrok http 3000` and copy the url here to test locally
    endpoint: "https://066a-105-115-4-192.ngrok-free.app/api/verify",
    logoBase64: logo,
    userId: address,
    userIdType: "hex",
    disclosures: {
      date_of_birth: true,
      name: true
    },
    devMode: true,
  } as Partial<SelfApp>).build();

  const handleSuccess = async () => {
    console.log('Verification successful');
  };

  return (
    <>
      {selfApp && (
        <div className="flex flex-col items-center gap-4 mb-6">
          <SelfQRcodeWrapper
            selfApp={selfApp}
            type='websocket'
            onSuccess={handleSuccess}
          />
          <p className="text-lg font-medium text-white">
            Scan QR Code to Verify your birthday
          </p>
        </div>
      )}
    </>
  );
}
