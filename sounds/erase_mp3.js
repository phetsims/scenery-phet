/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABbQXJue9InEGkeow9gy2AWSSSTAYoasSAbQuZ2IxjE6OhsMSZyx0576hvOP937/yhc4f0+H8LGFLHEz/XACUm0rv4BAiekAH6Jm5k8ECY8EgUIZ/AWGETh20scbX3gG7mZV3GgAhQncv3c4W4c9K5vl8EbDh9vE4Pl0bhBdl1QI5EgYIAkvMcggdSAIDGiYaCi1TJEP3//syxAuDiiyfQi2kcoEWjupFl5kgnLqM4ZI3NY8CQdRuXdoWvuuoGEFJjQ7a8upTGkSD3r2gYuE8ECDCcjuVOucc7PFj4P9PekLOItFR8vjb6SV/gLubu4jCdBDBUZqEFTw/hQO0ybCPVq3CQyd5UHRCwsCEH0Q2jEIIZNfXX87QzJsM1BcYADgQAD46ZctK/iAM1+rAAABG7CPrHv/7MsQEAAhUV2EspMpBDpFtsPMN3ulsDrrB7ZQEtNXcZW2+eAIHA1iQRS9ljECBZvLtnu+S6a0YJB+JgA6CDaxPlVGWHQ8HCBR6DCHeop9TISRiRalWFgH80HmEgJsLEZSTTztIStqpXKlQ8kZdEvWy8/YHdL2UHbB5ExRrSNWBrmZcZcEPZJL6UvqfSVDXar//BZXAxySNtyOOAMj/+zLEBIAItGtxp6SqsRAR7HT0jS4d8QmJJZG00FqAYyyFThGaVJDhkyhEHLIVsIpRT5Ssl3QDJM4wO6FDnlUhth1ElXKmXHvDqFQ0q1d5VN1FDjbkjTkcbALCLomUkUyMYChZlETMFQ9IXGnxGCb5rKyyHa0yhr8jfhbAY0MMamoklKVfb/Chu1FTLVMmzBJmtJ63PVoASmWaSySw//swxAOACFCLR6wwY6EPjiUFjRgoASFZYJYluFJiTQJCKPxyWSbCVDbjImuKZcwigTEdWzMMCOq6gJHJt0opTbvnSzCnRRM4GisU2ZL21TSX8JwGyJ1hZsTyoi3rd1yuVAdq07U9pFBBxQEHNQFHBVEi558+dTrbqXNvkmfcf9RQCtDgmnC0PPQXGaQzhe3o3evtdZUlttySX9Dh//syxAOAB/CXQ4ekZbDzkKc08wy0Wm4WA3SxrggemjmvrLhYPMwbgiQojkTMANwObSCpMBsRVwWZ03B7lJnulzuVMH3jG94r//vrv9DwI1K5XLM2UAR0cp3AuyNw3weQIg517NTTJHBXYkqjgo8ISOcjM523jJ9g1NmhoJtiVyLJKhB5Wi//Tdr9qgE0i2422iBAFsxlsAgejsEw6//7MsQJAAdMYTOnsGGg5opk3YMM2AMNO5+lxBo0cc4gsbfEqUFiQY53+2jBwHIGwgfJbxsYm3Z2UK7P//0gBBSJAoKalowNRlKnpTAkNJysTRiR23F8rIPdNBNHvoJIJDyIPAuCbzAXFUx7FEd0cWU1ZTd//+/qCLRKSikaIMATpvhKx1LK+hL2NEuYzCasqVFKkCuijuwbJkO+FGr/+zLEEwAG5Gczp4RpIM2RZzTAjAQICZLT4rfEYug+7Vq//0f6tYJTcdlt2gaAD05A3UhQo0dZrmawLqX/IKoI1DC8rt4NGcleF1HLcuOR0TbQd/98bsfo/uoAgIJKVAFYD8GhU5BgKLBU6eDdbu/RJej3f6k9RX7NSP++3qpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxCGDxHAPGOekYBAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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