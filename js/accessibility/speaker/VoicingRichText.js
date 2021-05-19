// Copyright 2021, University of Colorado Boulder

/**
 * RichText that composes ReadingBlock so that it can have Voicing content and listener that are called on it.
 * VoicingRichText is added to the focus order when Voicing is enabled, and a highlight will surround it that indicates
 * it can be clicked on to hear the text with speech synthesis.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import ReadingBlock from '../../../../scenery/js/accessibility/voicing/ReadingBlock.js';
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
      readingBlockContent: null,

      // pdom
      innerContent: text,

      // voicing
      // default tag name for a ReadingBlock, but there are cases where you may want to override this (such as
      // RichText links)
      readingBlockTagName: 'button'
    }, options );

    super( text, options );

    this.focusHighlight = new VoicingHighlight( this );

    this.initializeReadingBlock( {
      readingBlockContent: options.readingBlockContent || text,
      readingBlockTagName: options.readingBlockTagName
    } );
  }
}

ReadingBlock.compose( VoicingRichText );

sceneryPhet.register( 'VoicingRichText', VoicingRichText );
export default VoicingRichText;
