// Copyright 2021, University of Colorado Boulder

/**
 * LockNode shows a padlock that is either open or closed, depending on the state of a Property<boolean>.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { AlignBox, AlignGroup, Image } from '../../scenery/js/imports.js';
import BooleanToggleNode from '../../sun/js/BooleanToggleNode.js';
import lockClosed_png from '../images/lockClosed_png.js';
import lockOpened_png from '../images/lockOpened_png.js';
import sceneryPhet from './sceneryPhet.js';

class LockNode extends BooleanToggleNode {

  /**
   * @param {Property<boolean>} isLockedProperty - true=lock closed, false=lock open
   * @param {Object} [options]
   */
  constructor( isLockedProperty, options ) {

    const alignBoxOptions = {

      // To make both icons have the same effective dimensions
      group: new AlignGroup(),

      // The edges of the 2 images that match up
      xAlign: 'left',
      yAlign: 'bottom'
    };

    super(
      new AlignBox( new Image( lockClosed_png ), alignBoxOptions ), // trueNode
      new AlignBox( new Image( lockOpened_png ), alignBoxOptions ), // falseNode
      isLockedProperty,
      options
    );
  }
}

sceneryPhet.register( 'LockNode', LockNode );
export default LockNode;