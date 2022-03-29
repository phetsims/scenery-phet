// Copyright 2021-2022, University of Colorado Boulder

/**
 * LockNode shows a padlock that is either open or closed, depending on the state of a boolean Property.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import { AlignBox, AlignBoxOptions, AlignGroup, Image } from '../../scenery/js/imports.js';
import BooleanToggleNode, { BooleanToggleNodeOptions } from '../../sun/js/BooleanToggleNode.js';
import lockClosed_png from '../images/lockClosed_png.js';
import lockOpened_png from '../images/lockOpened_png.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {};

export type LockNodeOptions = SelfOptions & BooleanToggleNodeOptions;

export default class LockNode extends BooleanToggleNode {

  /**
   * @param isLockedProperty - true=lock closed, false=lock open
   * @param providedOptions
   */
  constructor( isLockedProperty: Property<boolean>, providedOptions?: LockNodeOptions ) {

    const alignBoxOptions: AlignBoxOptions = {

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
      providedOptions
    );
  }
}

sceneryPhet.register( 'LockNode', LockNode );