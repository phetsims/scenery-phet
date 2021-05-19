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
import ReadingBlock from '../../../../scenery/js/accessibility/voicing/ReadingBlock.js';
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
      readingBlockContent: null,

      // pdom
      tagName: 'p',
      innerContent: text
    }, options );

    super( text, options );

    // unique highlight for non-interactive components
    this.focusHighlight = new VoicingHighlight( this );

    // voicing
    this.initializeReadingBlock( {
      readingBlockContent: options.readingBlockContent || text
    } );
  }
}

ReadingBlock.compose( VoicingText );

sceneryPhet.register( 'VoicingText', VoicingText );
export default VoicingText;
