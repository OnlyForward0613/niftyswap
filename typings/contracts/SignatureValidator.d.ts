/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface SignatureValidatorInterface extends ethers.utils.Interface {
  functions: {
    "isValidSignature(address,bytes32,bytes,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "isValidSignature",
    values: [string, BytesLike, BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "isValidSignature",
    data: BytesLike
  ): Result;

  events: {};
}

export class SignatureValidator extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: SignatureValidatorInterface;

  functions: {
    isValidSignature(
      _signerAddress: string,
      _hash: BytesLike,
      _data: BytesLike,
      _sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean] & { isValid: boolean }>;

    "isValidSignature(address,bytes32,bytes,bytes)"(
      _signerAddress: string,
      _hash: BytesLike,
      _data: BytesLike,
      _sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean] & { isValid: boolean }>;
  };

  isValidSignature(
    _signerAddress: string,
    _hash: BytesLike,
    _data: BytesLike,
    _sig: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "isValidSignature(address,bytes32,bytes,bytes)"(
    _signerAddress: string,
    _hash: BytesLike,
    _data: BytesLike,
    _sig: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    isValidSignature(
      _signerAddress: string,
      _hash: BytesLike,
      _data: BytesLike,
      _sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "isValidSignature(address,bytes32,bytes,bytes)"(
      _signerAddress: string,
      _hash: BytesLike,
      _data: BytesLike,
      _sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    isValidSignature(
      _signerAddress: string,
      _hash: BytesLike,
      _data: BytesLike,
      _sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isValidSignature(address,bytes32,bytes,bytes)"(
      _signerAddress: string,
      _hash: BytesLike,
      _data: BytesLike,
      _sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    isValidSignature(
      _signerAddress: string,
      _hash: BytesLike,
      _data: BytesLike,
      _sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isValidSignature(address,bytes32,bytes,bytes)"(
      _signerAddress: string,
      _hash: BytesLike,
      _data: BytesLike,
      _sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
