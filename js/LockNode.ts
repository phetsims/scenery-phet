// Copyright 2021-2023, University of Colorado Boulder

/**
 * LockNode shows a padlock that is either open or closed, depending on the state of a boolean Property.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TProperty from '../../axon/js/TProperty.js';
import { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import { AlignBox, AlignBoxOptions, AlignGroup, HBox, HStrut, Image } from '../../scenery/js/imports.js';
import BooleanToggleNode, { BooleanToggleNodeOptions } from '../../sun/js/BooleanToggleNode.js';
import lockClosed_png from '../images/lockClosed_png.js';
import lockOpened_png from '../images/lockOpened_png.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = EmptySelfOptions;

export type LockNodeOptions = SelfOptions & BooleanToggleNodeOptions;

export default class LockNode extends BooleanToggleNode {

  /**
   * @param isLockedProperty - true=lock closed, false=lock open
   * @param providedOptions
   */
  public constructor( isLockedProperty: TProperty<boolean>, providedOptions?: LockNodeOptions ) {

    const alignBoxOptions: AlignBoxOptions = {

      // To make both icons have the same effective dimensions
      group: new AlignGroup(),

      xAlign: 'center',
      yAlign: 'bottom'
    };

    const lockClosedImage = new Image( lockClosed_png );
    const lockClosedNode = new AlignBox( lockClosedImage, alignBoxOptions );

    // For the 'open' icon, add a strut to the left, so that the lock body is in the center of lockOpenedNode.
    const lockOpenedImage = new Image( lockOpened_png );
    const lockOpenedNode = new AlignBox( new HBox( {
      children: [
        new HStrut( lockOpenedImage.width - lockClosedImage.width ),
        lockOpenedImage
      ],
      spacing: 0
    } ), alignBoxOptions );

    super( isLockedProperty, lockClosedNode, lockOpenedNode, providedOptions );
  }
}

sceneryPhet.register( 'LockNode', LockNode );