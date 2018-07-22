
import { WhisperParams } from "./doc";

import Config, { defaultConfig } from "./config";

import { generatePrivateKey } from "./util";

import { randomBytes } from "crypto";

interface IStatistics {
  messagesCleared: number;
  memoryCleared: number;
  memoryUsed: number;
  cycles: number;
  totalMessagesCleared: number;
}

interface ISettings {
  minPoWIdx: number;
  minPoWToleranceIdx: number;
  maxMsgSizeIdx: number;
  overflowIdx: boolean;
}

const generateRandomId = (): string => {
  const randBuf = randomBytes(WhisperParams.keyIDSize);
  return randBuf.toString("hex");
};

// Whisper is a dark communication interface through the Ethereum network
// using its own p2p communication layer.
export default class Whisper {
  public protocol: any; // todo: Libp2p?
  public filters: any; // todo // Message filters installed with Subscribe

  public privateKeys: {};
  public symKeys: any;
  public keyMu: any;

  public peerMu: any;
  public peers: any;

  public messageQueue: any;
  public p2pMsgQueue: any;
  public quit: any;

  public settings: ISettings;

  public syncAllowance: any;

  public lightClient: boolean;

  public statsMu: any;
  public stats: IStatistics;

  public mailServer: any;

  public maxMessageSize: any;

  constructor(config: Config = defaultConfig) {}

  /* newKeyPair generates a new cryptographic identity for the client. */
  public newKeyPair(): string {
    const pk = generatePrivateKey();
    const id = generateRandomId();
    if (this.privateKeys[id]) {
      throw new Error("Failed to generate unique Id");
    }
    this.privateKeys[id] = pk;
    return id;
  }

  public minPoW(): number {
    return this.settings.minPoWIdx;
  }

  public minPoWTolerance(): number {
    return this.settings.minPoWToleranceIdx;
  }

  public setBloomFilter(bloom: Buffer): boolean {
    return true;
  }

  public setMaxMessageSize(size: number): boolean {
    return true;
  }

  public setMinPoW(pow: number): boolean {
    return true;
  }

  public start() {
    /* tslint:disable-next-line */
    console.log(`Started Whisper V${WhisperParams.protocolVersionString}`);
    // this.update();

  }
}

const w = new Whisper();
w.start();
