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

interface NiftyswapFactoryInterface extends Interface {
  functions: {
    createExchange: TypedFunctionDescription<{
      encode([_token, _baseTokenAddr, _baseTokenID]: [
        string,
        string,
        BigNumberish
      ]): string;
    }>;
  };

  events: {
    NewExchange: TypedEventDescription<{
      encodeTopics([token, exchange]: [string | null, string | null]): string[];
    }>;
  };
}

export class NiftyswapFactory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): NiftyswapFactory;
  attach(addressOrName: string): NiftyswapFactory;
  deployed(): Promise<NiftyswapFactory>;

  on(event: EventFilter | string, listener: Listener): NiftyswapFactory;
  once(event: EventFilter | string, listener: Listener): NiftyswapFactory;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): NiftyswapFactory;
  removeAllListeners(eventName: EventFilter | string): NiftyswapFactory;
  removeListener(eventName: any, listener: Listener): NiftyswapFactory;

  interface: NiftyswapFactoryInterface;

  functions: {
    getExchange(_token: string): Promise<string>;

    createExchange(
      _token: string,
      _baseTokenAddr: string,
      _baseTokenID: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  filters: {
    NewExchange(token: string | null, exchange: string | null): EventFilter;
  };

  estimate: {
    createExchange(
      _token: string,
      _baseTokenAddr: string,
      _baseTokenID: BigNumberish
    ): Promise<BigNumber>;
  };
}
