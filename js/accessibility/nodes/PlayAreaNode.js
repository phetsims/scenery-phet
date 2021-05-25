// Copyright 2018-2021, University of Colorado Boulder

/**
 *
 * A node that creates a "Play Area" accessible section in the PDOM. This organizational Node should have accessible
 * content to be displayed under it in the PDOM. This content can be added as a child, or added via `pdomOrder`.
 * Items in this section are designed to be the "main interaction and pedagogical learning" to be had for the screen.
 * See ScreenView for more documentation and usage explanation.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import PDOMSectionNode from '../PDOMSectionNode.js';

class PlayAreaNode extends PDOMSectionNode {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( sceneryPhetStrings.a11y.simSection.playArea, options );
  }
}

sceneryPhet.register( 'PlayAreaNode', PlayAreaNode );
export default PlayAreaNode;