

import { WhisperParams } from './doc';

import Config, { defaultConfig } from './config';

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
  protocol: any; //todo: Libp2p?
  filters: any; //todo // Message filters installed with Subscribe

  privateKeys: any;
  symKeys: any;
  keyMu: any;

  peerMu: any;
  peers: any;

  messageQueue: any;
  p2pMsgQueue: any;
  quit: any;

  settings: Settings;

  syncAllowance: any;

  lightClient: boolean;

  statsMu: any;
  stats: Statistics;

  mailServer: any;

  constructor(config: Config = defaultConfig) {
    
  }

  minPoW(): number {
    return this.settings.minPoWIdx;
  }

  minPoWTolerance(): number {
    return this.settings.minPoWToleranceIdx;
  }

  start() {
    console.log(`Started Whisper V${WhisperParams.protocolVersionString}`);
    // this.update();

    
  }

}


