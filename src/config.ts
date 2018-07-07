import { WhisperParams } from './doc';

export default class Config {
  maxMessageSize: number;
  minimumAcceptedPoW: number;

  constructor(maxMessageSize: number, minimumAcceptedPoW: number) {
    this.maxMessageSize = maxMessageSize;
    this.minimumAcceptedPoW = minimumAcceptedPoW;
  }
}

export const defaultConfig = new Config(
  WhisperParams.defaultMaxMessageSize,
  WhisperParams.defaultMinimumPoW,
)