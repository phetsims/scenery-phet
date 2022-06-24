// Copyright 2021-2022, University of Colorado Boulder

/**
 * LockNode shows a padlock that is either open or closed, depending on the state of a boolean Property.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../axon/js/IProperty.js';
import EmptyObjectType from '../../phet-core/js/types/EmptyObjectType.js';
import { AlignBox, AlignBoxOptions, AlignGroup, Image } from '../../scenery/js/imports.js';
import BooleanToggleNode, { BooleanToggleNodeOptions } from '../../sun/js/BooleanToggleNode.js';
import lockClosed_png from '../images/lockClosed_png.js';
import lockOpened_png from '../images/lockOpened_png.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = EmptyObjectType;

export type LockNodeOptions = SelfOptions & BooleanToggleNodeOptions;

export default class LockNode extends BooleanToggleNode {

  /**
   * @param isLockedProperty - true=lock closed, false=lock open
   * @param providedOptions
   */
  public constructor( isLockedProperty: IProperty<boolean>, providedOptions?: LockNodeOptions ) {

    const alignBoxOptions: AlignBoxOptions = {

      // To make both icons have the same effective dimensions
      group: new AlignGroup(),

      // The edges of the 2 images that match up
      xAlign: 'left',
      yAlign: 'bottom'
    };

    super( isLockedProperty, new AlignBox( new Image( lockClosed_png ), alignBoxOptions ), new AlignBox( new Image( lockOpened_png ), alignBoxOptions ), providedOptions );
  }
}

sceneryPhet.register( 'LockNode', LockNode );