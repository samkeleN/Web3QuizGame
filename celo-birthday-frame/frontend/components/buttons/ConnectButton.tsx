'use client'
import { ContractAddress, ContractAbi } from '@/data/abi';
import { projectUrl } from '@/lib/helpers';
import { useDisconnect, useAppKitAccount } from '@reown/appkit/react'
import { type } from 'os';
import { zeroAddress } from 'viem';
import { useWriteContract, useReadContract } from 'wagmi';


export const ConnectButton = () => {
  const { isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  const proofData = {
    a: [
      '18689987482609259976543121413293838883706673632428011795876461007849761889600',
      '11002492442672597215879032081892275945425600517703198111911753525926858046664'
    ],
    b: [
      [
        '10861719069499823165288225218838668829729688050688767772694708933593343539508',
        '8365588457552672098586461357335812299767948621992645445280314397370620854367'
      ],
      [
        '9893621850173437284037729803389539398848567542670181360312261038245000997943',
        '15313933800742579646776791535634901792535303353991855955032184196651338559333'
      ]
    ],
    c: [
      '15849491210183330365695460558420690929188447925525503998857955193574632857702',
      '5016373093441111888523409921939281037153710356553600888181933545353771723602'
    ],
    pubSignals: [
      '115261408968607033031307466064449130912187328440927354228438530078002905088',
      '85175750817918425710041900119009907057840432547576103486151967547934982732',
      '52',
      '0',
      '0',
      '0',
      '0',
      '232899505634211552416266126911335006838793804334277868965825521855752192143',
      '1',
      '21805494687043175113477743360545103370747360091435805417468406071916158527260',
      '2',
      '5',
      '0',
      '5',
      '0',
      '4',
      '17359956125106148146828355805271472653597249114301196742546733402427978706344',
      '7420120618403967585712321281997181302561301414016003514649937965499789236588',
      '16836358042995742879630198413873414945978677264752036026400967422611478610995',
      '590080924736463686012467503391001454017377993996437203705047956386072265915',
      '865134866047133308533628272553533973433355278147'
    ]
  }



  const { writeContract, isSuccess } = useWriteContract();


  const handleProof = () => {
    console.log("firels")
    writeContract({
      address: ContractAddress,
      abi: ContractAbi,
      functionName: "verifySelfProof",
      args: [
        proofData
      ],
    });
  };




  return (
    <div className="flex items-center gap-2">
      <appkit-button />
      {isConnected && (
        <button
          onClick={handleDisconnect}
          className="p-2 hover:opacity-75 bg-red-800 rounded ml-2"
          aria-label="Disconnect"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      )}

      <button onClick={() => handleProof()} className="p-2 hover:opacity-75 bg-red-800 rounded ml-2"> TEST PROOF</button>
    </div>
  )
}
