// Copyright 2022, University of Colorado Boulder

/**
 * Demo for KeyboardHelpIconFactory
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import KeyboardHelpIconFactory from '../../keyboard/help/KeyboardHelpIconFactory.js';
import { GridBox, Node } from '../../../../scenery/js/imports.js';
import TextKeyNode from '../../keyboard/TextKeyNode.js';

export default function demoKeyboardHelpIconFactory( layoutBounds: Bounds2, providedOptions?: SunDemoOptions ): Node {
  return new GridBox( {
    xSpacing: 75,
    ySpacing: 20,
    columns: [
      [
        KeyboardHelpIconFactory.iconRow( [ new TextKeyNode( 'A' ), new TextKeyNode( 'B' ) ] ),
        KeyboardHelpIconFactory.iconOrIcon( new TextKeyNode( 'A' ), new TextKeyNode( 'B' ) ),
        KeyboardHelpIconFactory.iconToIcon( new TextKeyNode( 'A' ), new TextKeyNode( 'B' ) ),
        KeyboardHelpIconFactory.iconPlusIcon( new TextKeyNode( 'A' ), new TextKeyNode( 'B' ) ),
        KeyboardHelpIconFactory.shiftPlusIcon( new TextKeyNode( 'A' ) )
      ],
      [
        KeyboardHelpIconFactory.spaceOrEnter(),
        KeyboardHelpIconFactory.upOrDown(),
        KeyboardHelpIconFactory.wasdRowIcon(),
        KeyboardHelpIconFactory.arrowKeysRowIcon()
      ],
      [
        KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon(),
        KeyboardHelpIconFactory.pageUpPageDownRowIcon(),
        KeyboardHelpIconFactory.leftRightArrowKeysRowIcon()
      ]
    ],
    center: layoutBounds.center
  } );
}