/**
 * TopicType represents a cryptographically secure, probablistic
 * partial classification of a message, determined as the first
 * (left) 4 bytes of the SHA3 hash of some arbitrary data.
 */
import { Buffer } from 'safe-buffer';

export type TopicType = Buffer;

