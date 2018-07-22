
import { WhisperParams } from "./doc";

import Config, { defaultConfig } from "./config";

interface Statistics {
  messagesCleared: number;
  memoryCleared: number;
  memoryUsed: number;
  cycles: number;
  totalMessagesCleared: number;
}

interface Settings {
  minPoWIdx: number;
  minPoWToleranceIdx: number;
  maxMsgSizeIdx: number;
  overflowIdx: boolean;
}

// Whisper is a dark communication interface through the Ethereum network
// using its own p2p communication layer.
export default class Whisper {
  public protocol: any; // todo: Libp2p?
  public filters: any; // todo // Message filters installed with Subscribe

  public privateKeys: any;
  public symKeys: any;
  public keyMu: any;

  public peerMu: any;
  public peers: any;

  public messageQueue: any;
  public p2pMsgQueue: any;
  public quit: any;

  public settings: Settings;

  public syncAllowance: any;

  public lightClient: boolean;

  public statsMu: any;
  public stats: Statistics;

  public mailServer: any;

  constructor(config: Config = defaultConfig) {

  }

  public minPoW(): number {
    return this.settings.minPoWIdx;
  }

  public minPoWTolerance(): number {
    return this.settings.minPoWToleranceIdx;
  }

  public start() {
    console.log(`Started Whisper V${WhisperParams.protocolVersionString}`);
    // this.update();

  }

}
