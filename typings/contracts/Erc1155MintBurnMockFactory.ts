/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import { Erc1155MintBurnMock } from "./Erc1155MintBurnMock";

export class Erc1155MintBurnMockFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Erc1155MintBurnMock> {
    return super.deploy(overrides || {}) as Promise<Erc1155MintBurnMock>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Erc1155MintBurnMock {
    return super.attach(address) as Erc1155MintBurnMock;
  }
  connect(signer: Signer): Erc1155MintBurnMockFactory {
    return super.connect(signer) as Erc1155MintBurnMockFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Erc1155MintBurnMock {
    return new Contract(address, _abi, signerOrProvider) as Erc1155MintBurnMock;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_approved",
        type: "bool"
      }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]"
      }
    ],
    name: "TransferBatch",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_operator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "TransferSingle",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "_uri",
        type: "string"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "URI",
    type: "event"
  },
  {
    stateMutability: "nonpayable",
    type: "fallback"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_owners",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]"
      }
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]"
      }
    ],
    name: "batchBurnMock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      }
    ],
    name: "batchMintMock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256"
      }
    ],
    name: "burnMock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address"
      }
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "isOperator",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      }
    ],
    name: "mintMock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]"
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      }
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address"
      },
      {
        internalType: "address",
        name: "_to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address"
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool"
      }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_interfaceID",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611cd5806100206000396000f3fe608060405234801561001057600080fd5b50600436106100b35760003560e01c8063a22cb46511610071578063a22cb46514610185578063a3f091f514610198578063bd7a6c41146101ab578063d7a0ad90146101be578063e985e9c5146101d1578063f242432a146101e4576100b3565b8062fdd58e146100d457806301ffc9a7146100fd5780630e89341c1461011d5780632eb2c2d61461013d578063437ecbe9146101525780634e1273f414610165575b60405162461bcd60e51b81526004016100cb90611a1f565b60405180910390fd5b6100e76100e23660046117ce565b6101f7565b6040516100f49190611a66565b60405180910390f35b61011061010b36600461193d565b61021d565b6040516100f491906119c1565b61013061012b366004611965565b610230565b6040516100f491906119cc565b61015061014b366004611585565b610311565b005b6101506101603660046117f7565b6103ce565b61017861017336600461187c565b6103de565b6040516100f4919061197d565b610150610193366004611794565b6104f6565b6101506101a6366004611829565b610564565b6101506101b936600461168e565b610576565b6101506101cc3660046116ff565b610581565b6101106101df366004611553565b61058d565b6101506101f236600461162b565b6105bb565b6001600160a01b0391909116600090815260208181526040808320938352929052205490565b600061022882610671565b90505b919050565b6060600261023d8361069d565b604051602001808380546001816001161561010002031660029004801561029b5780601f1061027957610100808354040283529182019161029b565b820191906000526020600020905b815481529060010190602001808311610287575b5050825160208401908083835b602083106102c75780518252601f1990920191602091820191016102a8565b5181516020939093036101000a600019018019909116921691909117905264173539b7b760d91b92019182525060408051808303601a190181526005909201905295945050505050565b336001600160a01b038616148061032d575061032d853361058d565b6103685760405162461bcd60e51b815260040180806020018281038252602f815260200180611bc8602f913960400191505060405180910390fd5b6001600160a01b0384166103ad5760405162461bcd60e51b8152600401808060200182810382526030815260200180611b3c6030913960400191505060405180910390fd5b6103b985858585610777565b6103c7858585855a86610a22565b5050505050565b6103d9838383610c1a565b505050565b606081518351146104205760405162461bcd60e51b815260040180806020018281038252602c815260200180611b9c602c913960400191505060405180910390fd5b6060835167ffffffffffffffff8111801561043a57600080fd5b50604051908082528060200260200182016040528015610464578160200160208202803683370190505b50905060005b84518110156104ee5760008086838151811061048257fe5b60200260200101516001600160a01b03166001600160a01b0316815260200190815260200160002060008583815181106104b857fe5b60200260200101518152602001908152602001600020548282815181106104db57fe5b602090810291909101015260010161046a565b509392505050565b3360008181526001602090815260408083206001600160a01b03871680855290835292819020805460ff1916861515908117909155815190815290519293927f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31929181900390910190a35050565b61057084848484610cab565b50505050565b6103d9838383610d46565b61057084848484610f11565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b336001600160a01b03861614806105d757506105d7853361058d565b6106125760405162461bcd60e51b815260040180806020018281038252602a815260200180611add602a913960400191505060405180910390fd5b6001600160a01b0384166106575760405162461bcd60e51b815260040180806020018281038252602b815260200180611ab2602b913960400191505060405180910390fd5b610663858585856110e6565b6103c7858585855a866111c2565b60006001600160e01b031982166303a24d0760e21b14156106945750600161022b565b61022882611334565b6060816106c257506040805180820190915260018152600360fc1b602082015261022b565b818060005b82156106db57600101600a830492506106c7565b60608167ffffffffffffffff811180156106f457600080fd5b506040519080825280601f01601f19166020018201604052801561071f576020820181803683370190505b50905060001982015b831561076d57600a840660300160f81b8282806001900393508151811061074b57fe5b60200101906001600160f81b031916908160001a905350600a84049350610728565b5095945050505050565b80518251146107b75760405162461bcd60e51b8152600401808060200182810382526035815260200180611b076035913960400191505060405180910390fd5b815160005b81811015610941576108328382815181106107d357fe5b6020026020010151600080896001600160a01b03166001600160a01b03168152602001908152602001600020600087858151811061080d57fe5b602002602001015181526020019081526020016000205461136090919063ffffffff16565b600080886001600160a01b03166001600160a01b03168152602001908152602001600020600086848151811061086457fe5b60200260200101518152602001908152602001600020819055506108ec83828151811061088d57fe5b6020026020010151600080886001600160a01b03166001600160a01b0316815260200190815260200160002060008785815181106108c757fe5b60200260200101518152602001908152602001600020546113bd90919063ffffffff16565b600080876001600160a01b03166001600160a01b03168152602001908152602001600020600086848151811061091e57fe5b6020908102919091018101518252810191909152604001600020556001016107bc565b50836001600160a01b0316856001600160a01b0316336001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051808060200180602001838103835285818151815260200191508051906020019060200280838360005b838110156109c75781810151838201526020016109af565b50505050905001838103825284818151815260200191508051906020019060200280838360005b83811015610a065781810151838201526020016109ee565b5050505090500194505050505060405180910390a45050505050565b610a34856001600160a01b0316611417565b15610c12576000856001600160a01b031663bc197c8184338a8989886040518763ffffffff1660e01b815260040180866001600160a01b03168152602001856001600160a01b03168152602001806020018060200180602001848103845287818151815260200191508051906020019060200280838360005b83811015610ac5578181015183820152602001610aad565b50505050905001848103835286818151815260200191508051906020019060200280838360005b83811015610b04578181015183820152602001610aec565b50505050905001848103825285818151815260200191508051906020019080838360005b83811015610b40578181015183820152602001610b28565b50505050905090810190601f168015610b6d5780820380516001836020036101000a031916815260200191505b5098505050505050505050602060405180830381600088803b158015610b9257600080fd5b5087f1158015610ba6573d6000803e3d6000fd5b50505050506040513d6020811015610bbd57600080fd5b505190506001600160e01b0319811663bc197c8160e01b14610c105760405162461bcd60e51b815260040180806020018281038252603f815260200180611c27603f913960400191505060405180910390fd5b505b505050505050565b6001600160a01b038316600090815260208181526040808320858452909152902054610c469082611360565b6001600160a01b03841660008181526020818152604080832087845282528083209490945583518681529081018590528351919333927fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f629281900390910190a4505050565b6001600160a01b038416600090815260208181526040808320868452909152902054610cd790836113bd565b6001600160a01b038516600081815260208181526040808320888452825280832094909455835187815290810186905283519293919233927fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62928290030190a461057060008585855a866111c2565b815181518114610d875760405162461bcd60e51b8152600401808060200182810382526030815260200180611b6c6030913960400191505060405180910390fd5b60005b81811015610e3057610ddb838281518110610da157fe5b6020026020010151600080886001600160a01b03166001600160a01b03168152602001908152602001600020600087858151811061080d57fe5b600080876001600160a01b03166001600160a01b031681526020019081526020016000206000868481518110610e0d57fe5b602090810291909101810151825281019190915260400160002055600101610d8a565b5060006001600160a01b0316846001600160a01b0316336001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051808060200180602001838103835285818151815260200191508051906020019060200280838360005b83811015610eb7578181015183820152602001610e9f565b50505050905001838103825284818151815260200191508051906020019060200280838360005b83811015610ef6578181015183820152602001610ede565b5050505090500194505050505060405180910390a450505050565b8151835114610f515760405162461bcd60e51b8152600401808060200182810382526030815260200180611bf76030913960400191505060405180910390fd5b825160005b81811015610ffc57610fa7848281518110610f6d57fe5b6020026020010151600080896001600160a01b03166001600160a01b0316815260200190815260200160002060008885815181106108c757fe5b600080886001600160a01b03166001600160a01b031681526020019081526020016000206000878481518110610fd957fe5b602090810291909101810151825281019190915260400160002055600101610f56565b50846001600160a01b031660006001600160a01b0316336001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051808060200180602001838103835285818151815260200191508051906020019060200280838360005b8381101561108357818101518382015260200161106b565b50505050905001838103825284818151815260200191508051906020019060200280838360005b838110156110c25781810151838201526020016110aa565b5050505090500194505050505060405180910390a46103c760008686865a87610a22565b6001600160a01b0384166000908152602081815260408083208584529091529020546111129082611360565b6001600160a01b038086166000908152602081815260408083208784528252808320949094559186168152808252828120858252909152205461115590826113bd565b6001600160a01b03808516600081815260208181526040808320888452825291829020949094558051868152938401859052805191939288169233927fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62929181900390910190a450505050565b6111d4856001600160a01b0316611417565b15610c12576000856001600160a01b031663f23a6e6184338a8989886040518763ffffffff1660e01b815260040180866001600160a01b03168152602001856001600160a01b0316815260200184815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561126657818101518382015260200161124e565b50505050905090810190601f1680156112935780820380516001836020036101000a031916815260200191505b509650505050505050602060405180830381600088803b1580156112b657600080fd5b5087f11580156112ca573d6000803e3d6000fd5b50505050506040513d60208110156112e157600080fd5b505190506001600160e01b0319811663f23a6e6160e01b14610c105760405162461bcd60e51b815260040180806020018281038252603a815260200180611c66603a913960400191505060405180910390fd5b60006001600160e01b03198216636cdb3d1360e11b14156113575750600161022b565b6102288261144e565b6000828211156113b7576040805162461bcd60e51b815260206004820152601760248201527f536166654d617468237375623a20554e444552464c4f57000000000000000000604482015290519081900360640190fd5b50900390565b600082820183811015611410576040805162461bcd60e51b8152602060048201526016602482015275536166654d617468236164643a204f564552464c4f5760501b604482015290519081900360640190fd5b9392505050565b6000813f801580159061141057507fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470141592915050565b6001600160e01b031981166301ffc9a760e01b14919050565b80356001600160a01b038116811461022b57600080fd5b600082601f83011261148e578081fd5b81356114a161149c82611a93565b611a6f565b8181529150602080830190848101818402860182018710156114c257600080fd5b60005b848110156114e1578135845292820192908201906001016114c5565b505050505092915050565b600082601f8301126114fc578081fd5b813567ffffffffffffffff81111561151057fe5b611523601f8201601f1916602001611a6f565b915080825283602082850101111561153a57600080fd5b8060208401602084013760009082016020015292915050565b60008060408385031215611565578182fd5b61156e83611467565b915061157c60208401611467565b90509250929050565b600080600080600060a0868803121561159c578081fd5b6115a586611467565b94506115b360208701611467565b9350604086013567ffffffffffffffff808211156115cf578283fd5b6115db89838a0161147e565b945060608801359150808211156115f0578283fd5b6115fc89838a0161147e565b93506080880135915080821115611611578283fd5b5061161e888289016114ec565b9150509295509295909350565b600080600080600060a08688031215611642578081fd5b61164b86611467565b945061165960208701611467565b93506040860135925060608601359150608086013567ffffffffffffffff811115611682578182fd5b61161e888289016114ec565b6000806000606084860312156116a2578283fd5b6116ab84611467565b9250602084013567ffffffffffffffff808211156116c7578384fd5b6116d38783880161147e565b935060408601359150808211156116e8578283fd5b506116f58682870161147e565b9150509250925092565b60008060008060808587031215611714578384fd5b61171d85611467565b9350602085013567ffffffffffffffff80821115611739578485fd5b6117458883890161147e565b9450604087013591508082111561175a578384fd5b6117668883890161147e565b9350606087013591508082111561177b578283fd5b50611788878288016114ec565b91505092959194509250565b600080604083850312156117a6578182fd5b6117af83611467565b9150602083013580151581146117c3578182fd5b809150509250929050565b600080604083850312156117e0578182fd5b6117e983611467565b946020939093013593505050565b60008060006060848603121561180b578283fd5b61181484611467565b95602085013595506040909401359392505050565b6000806000806080858703121561183e578384fd5b61184785611467565b93506020850135925060408501359150606085013567ffffffffffffffff811115611870578182fd5b611788878288016114ec565b6000806040838503121561188e578081fd5b823567ffffffffffffffff808211156118a5578283fd5b818501915085601f8301126118b8578283fd5b81356118c661149c82611a93565b80828252602080830192508086018a8283870289010111156118e6578788fd5b8796505b8487101561190f576118fb81611467565b8452600196909601959281019281016118ea565b509096508701359350505080821115611926578283fd5b506119338582860161147e565b9150509250929050565b60006020828403121561194e578081fd5b81356001600160e01b031981168114611410578182fd5b600060208284031215611976578081fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b818110156119b557835183529284019291840191600101611999565b50909695505050505050565b901515815260200190565b6000602080835283518082850152825b818110156119f8578581018301518582016040015282016119dc565b81811115611a095783604083870101525b50601f01601f1916929092016040019392505050565b60208082526027908201527f455243313135354d6574614d696e744275726e4d6f636b3a20494e56414c494460408201526617d351551213d160ca1b606082015260800190565b90815260200190565b60405181810167ffffffffffffffff81118282101715611a8b57fe5b604052919050565b600067ffffffffffffffff821115611aa757fe5b506020908102019056fe4552433131353523736166655472616e7366657246726f6d3a20494e56414c49445f524543495049454e544552433131353523736166655472616e7366657246726f6d3a20494e56414c49445f4f50455241544f5245524331313535235f7361666542617463685472616e7366657246726f6d3a20494e56414c49445f4152524159535f4c454e47544845524331313535237361666542617463685472616e7366657246726f6d3a20494e56414c49445f524543495049454e54455243313135354d696e744275726e2362617463684275726e3a20494e56414c49445f4152524159535f4c454e475448455243313135352362616c616e63654f6642617463683a20494e56414c49445f41525241595f4c454e47544845524331313535237361666542617463685472616e7366657246726f6d3a20494e56414c49445f4f50455241544f52455243313135354d696e744275726e2362617463684d696e743a20494e56414c49445f4152524159535f4c454e47544845524331313535235f63616c6c6f6e45524331313535426174636852656365697665643a20494e56414c49445f4f4e5f524543454956455f4d45535341474545524331313535235f63616c6c6f6e4552433131353552656365697665643a20494e56414c49445f4f4e5f524543454956455f4d455353414745a2646970667358221220519b6ad1f19aacdf548ccb0133c2a14e9ef55d820d68b8fdfe907398ffba879464736f6c63430007040033";
