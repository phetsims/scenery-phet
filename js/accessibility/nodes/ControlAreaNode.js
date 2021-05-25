// Copyright 2018-2021, University of Colorado Boulder

/**
 *
 * A node that creates a "Control Area" accessible section in the PDOM. This organizational Node should have accessible
 * content to be displayed under it in the PDOM. This content can be added as a child, or added via `pdomOrder`.
 * Items in this section are designed to be secondary to that in the PlayAreaNode. See ScreenView for more documentation
 * and usage explanation.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import PDOMSectionNode from '../PDOMSectionNode.js';

class ControlAreaNode extends PDOMSectionNode {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( sceneryPhetStrings.a11y.simSection.controlArea, options );
  }
}

sceneryPhet.register( 'ControlAreaNode', ControlAreaNode );
export default ControlAreaNode;