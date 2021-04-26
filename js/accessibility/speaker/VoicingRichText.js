// Copyright 2021, University of Colorado Boulder

/**
 * WARNING: This is using a prototype trait called Voicing with speech synthesis. Do not use in production code yet.
 *
 * RichText that composes Voicing, supporting speech synthesis. VoicingRichText is added to the focus
 * order when Voicing is enabled, and a highlight will surround it that indicates it can be clicked on
 * to hear the text with speech synthesis.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ReadingBlock from '../../../../scenery/js/accessibility/speaker/ReadingBlock.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import sceneryPhet from '../../sceneryPhet.js';
import VoicingHighlight from './VoicingHighlight.js';

class VoicingRichText extends RichText {

  /**
   * @param {string} text
   * @param {Object} [options]
   */
  constructor( text, options ) {
    options = merge( {

      // {string|null} - if provided, alternative text that will be read that is different from the
      // visually displayed text
      voicingText: null,

      // pdom
      tagName: 'p',
      innerContent: text,

      // voicing
      // default tag name for a ReadingBlock, but there are cases where you may want to override this (such as
      // RichText links)
      voicingTagName: 'button'
    }, options );

    super( text, options );

    this.initializeReadingBlock();

    this.mutate( {

      // reads the text (or alternative voicingText) on focus, click, and mouse press
      voicingCreateOverrideResponse: event => {
        return options.voicingText || text;
      },

      // specify the hit shape for the RichText for mouse/touch presses
      readingBlockHitShape: Shape.bounds( this.localBounds ),

      // unique highlight for non-interactive components
      focusHighlight: new VoicingHighlight( this ),

      voicingTagName: options.voicingTagName
    } );
  }
}

ReadingBlock.compose( VoicingRichText );

sceneryPhet.register( 'VoicingRichText', VoicingRichText );
export default VoicingRichText;
