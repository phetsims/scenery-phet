/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsSFAMQYRv2jCSqwfoPTuPekJ1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDEqIPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEu4PAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;