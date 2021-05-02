// Copyright 2021, University of Colorado Boulder

/**
 * WARNING: This is using a prototype trait called Voicing with speech synthesis. Do not use in production code yet.
 *
 * Text that mixes Voicing, creating a "Reading Block" which can be clicked to read the associated text
 * with speech synthesis. VoicingRichText is added to the focus order when Voicing is enabled,
 * and a highlight will surround it that indicates it can be clicked on to hear the text.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ReadingBlock from '../../../../scenery/js/accessibility/speaker/ReadingBlock.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import sceneryPhet from '../../sceneryPhet.js';
import VoicingHighlight from './VoicingHighlight.js';

class VoicingText extends Text {

  /**
   * @param {string} text
   * @param {Object} [options]
   */
  constructor( text, options ) {
    options = merge( {

      // {string|null} - if provided, alternative text that will be spoken that is different from the
      // visually displayed text
      voicingText: null,

      // pdom
      tagName: 'p',
      innerContent: text
    }, options );

    super( text, options );

    // voicing
    this.initializeReadingBlock();
    this.mutate( {

      // reads teh text (or alternative voicingText) on focus, click, and mouse press
      voicingCreateOverrideResponse: event => {
        return options.voicingText || text;
      },

      // unique highlight for non-interactive components
      focusHighlight: new VoicingHighlight( this )
    } );
  }
}

ReadingBlock.compose( VoicingText );

sceneryPhet.register( 'VoicingText', VoicingText );
export default VoicingText;
