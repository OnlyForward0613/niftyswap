/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface ERC165Interface extends Interface {
  functions: {
    supportsInterface: TypedFunctionDescription<{
      encode([_interfaceID]: [Arrayish]): string;
    }>;
  };

  events: {};
}

export class ERC165 extends Contract {
  connect(signerOrProvider: Signer | Provider | string): ERC165;
  attach(addressOrName: string): ERC165;
  deployed(): Promise<ERC165>;

  on(event: EventFilter | string, listener: Listener): ERC165;
  once(event: EventFilter | string, listener: Listener): ERC165;
  addListener(eventName: EventFilter | string, listener: Listener): ERC165;
  removeAllListeners(eventName: EventFilter | string): ERC165;
  removeListener(eventName: any, listener: Listener): ERC165;

  interface: ERC165Interface;

  functions: {
    supportsInterface(_interfaceID: Arrayish): Promise<boolean>;
  };

  supportsInterface(_interfaceID: Arrayish): Promise<boolean>;

  filters: {};

  estimate: {
    supportsInterface(_interfaceID: Arrayish): Promise<BigNumber>;
  };
}
