/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface Erc1155Interface extends ethers.utils.Interface {
  functions: {
    "balanceOf(address,uint256)": FunctionFragment;
    "balanceOfBatch(address[],uint256[])": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)": FunctionFragment;
    "safeTransferFrom(address,address,uint256,uint256,bytes)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfBatch",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "safeBatchTransferFrom",
    values: [string, string, BigNumberish[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfBatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeBatchTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "ApprovalForAll(address,address,bool)": EventFragment;
    "TransferBatch(address,address,address,uint256[],uint256[])": EventFragment;
    "TransferSingle(address,address,address,uint256,uint256)": EventFragment;
    "URI(string,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferBatch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferSingle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "URI"): EventFragment;
}

export class Erc1155 extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: Erc1155Interface;

  functions: {
    balanceOf(
      _owner: string,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    balanceOfBatch(
      _owners: string[],
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber[];
    }>;

    isApprovedForAll(
      _owner: string,
      _operator: string,
      overrides?: CallOverrides
    ): Promise<{
      isOperator: boolean;
      0: boolean;
    }>;

    safeBatchTransferFrom(
      _from: string,
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    safeTransferFrom(
      _from: string,
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      _operator: string,
      _approved: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    supportsInterface(
      _interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;
  };

  balanceOf(
    _owner: string,
    _id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOfBatch(
    _owners: string[],
    _ids: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  isApprovedForAll(
    _owner: string,
    _operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  safeBatchTransferFrom(
    _from: string,
    _to: string,
    _ids: BigNumberish[],
    _amounts: BigNumberish[],
    _data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  safeTransferFrom(
    _from: string,
    _to: string,
    _id: BigNumberish,
    _amount: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    _operator: string,
    _approved: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  supportsInterface(
    _interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  staticCall: {
    balanceOf(
      _owner: string,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfBatch(
      _owners: string[],
      _ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    isApprovedForAll(
      _owner: string,
      _operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    safeBatchTransferFrom(
      _from: string,
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<void>;

    safeTransferFrom(
      _from: string,
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides
    ): Promise<void>;

    setApprovalForAll(
      _operator: string,
      _approved: boolean,
      overrides?: Overrides
    ): Promise<void>;

    supportsInterface(
      _interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    ApprovalForAll(
      _owner: string | null,
      _operator: string | null,
      _approved: null
    ): EventFilter;

    TransferBatch(
      _operator: string | null,
      _from: string | null,
      _to: string | null,
      _ids: null,
      _amounts: null
    ): EventFilter;

    TransferSingle(
      _operator: string | null,
      _from: string | null,
      _to: string | null,
      _id: null,
      _amount: null
    ): EventFilter;

    URI(_amount: null, _id: BigNumberish | null): EventFilter;
  };

  estimateGas: {
    balanceOf(_owner: string, _id: BigNumberish): Promise<BigNumber>;
    balanceOfBatch(_owners: string[], _ids: BigNumberish[]): Promise<BigNumber>;
    isApprovedForAll(_owner: string, _operator: string): Promise<BigNumber>;
    safeBatchTransferFrom(
      _from: string,
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike
    ): Promise<BigNumber>;
    safeTransferFrom(
      _from: string,
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike
    ): Promise<BigNumber>;
    setApprovalForAll(
      _operator: string,
      _approved: boolean
    ): Promise<BigNumber>;
    supportsInterface(_interfaceID: BytesLike): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(_owner: string, _id: BigNumberish): Promise<PopulatedTransaction>;
    balanceOfBatch(
      _owners: string[],
      _ids: BigNumberish[]
    ): Promise<PopulatedTransaction>;
    isApprovedForAll(
      _owner: string,
      _operator: string
    ): Promise<PopulatedTransaction>;
    safeBatchTransferFrom(
      _from: string,
      _to: string,
      _ids: BigNumberish[],
      _amounts: BigNumberish[],
      _data: BytesLike
    ): Promise<PopulatedTransaction>;
    safeTransferFrom(
      _from: string,
      _to: string,
      _id: BigNumberish,
      _amount: BigNumberish,
      _data: BytesLike
    ): Promise<PopulatedTransaction>;
    setApprovalForAll(
      _operator: string,
      _approved: boolean
    ): Promise<PopulatedTransaction>;
    supportsInterface(_interfaceID: BytesLike): Promise<PopulatedTransaction>;
  };
}
