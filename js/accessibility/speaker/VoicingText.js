// Copyright 2021, University of Colorado Boulder

/**
 * Text that mixes ReadingBLock, supporting features of Voicing and adding listeners that speak upon user activation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ReadingBlock from '../../../../scenery/js/accessibility/voicing/ReadingBlock.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import sceneryPhet from '../../sceneryPhet.js';
import ReadingBlockHighlight from '../../../../scenery/js/accessibility/voicing/ReadingBlockHighlight.js';

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
    this.focusHighlight = new ReadingBlockHighlight( this );

    // voicing
    this.initializeReadingBlock( {
      readingBlockContent: options.readingBlockContent || text
    } );
  }

  /**
   * @public
   */
  dispose() {
    this.disposeReadingBlock();
    super.dispose();
  }
}

ReadingBlock.compose( VoicingText );

sceneryPhet.register( 'VoicingText', VoicingText );
export default VoicingText;
