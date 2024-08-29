// Copyright 2017-2023, University of Colorado Boulder

/**
 * A node that provides an interaction cue for dragging the balloon in Balloons and Static Electricity. Includes arrow
 * and letter keys to indicate that the user can use WASD or arrow keys to move it around the play area.
 *
 * @author Jesse Greenberg
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Path, VBox } from '../../../../scenery/js/imports.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PlayAreaMap from '../model/PlayAreaMap.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BalloonModel from '../model/BalloonModel.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';

// constants
const ARROW_HEIGHT = 15; // dimensions for the arrow icons
const KEY_HEIGHT = 24; // height of the arrow key, larger than default KeyNode height
const ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * ARROW_HEIGHT; // for equilateral triangle
const LETTER_KEY_OPTIONS = { font: new PhetFont( 14 ), keyHeight: KEY_HEIGHT };
const KEY_ARROW_SPACING = 2;
const BALLOON_KEY_SPACING = 8;
const SHADOW_WIDTH = 2;

// possible directions or the directional cues
const DIRECTION_ANGLES = {
  up: 0,
  down: Math.PI,
  left: -Math.PI / 2,
  right: Math.PI / 2
};

class BalloonInteractionCueNode extends Node {

  public constructor( wallIsVisibleProperty: TReadOnlyProperty<boolean>, balloonModel: BalloonModel ) {

    super();

    // create the help node for the WASD and arrow keys, invisible except for on the initial balloon pick up
    const directionKeysParent = new Node();
    this.addChild( directionKeysParent );

    const wNode = this.createMovementKeyNode( 'up' );
    const aNode = this.createMovementKeyNode( 'left' );
    const sNode = this.createMovementKeyNode( 'down' );
    const dNode = this.createMovementKeyNode( 'right' );

    directionKeysParent.addChild( wNode );
    directionKeysParent.addChild( aNode );
    directionKeysParent.addChild( sNode );
    directionKeysParent.addChild( dNode );

    // add listeners to update visibility of nodes when position changes and when the wall is made
    // visible/invisible
    Multilink.multilink( [ balloonModel.positionProperty, wallIsVisibleProperty ], ( position, visible ) => {

      // get the max x positions depending on if the wall is visible
      let centerXRightBoundary;
      if ( visible ) {
        centerXRightBoundary = PlayAreaMap.X_POSITIONS.AT_WALL;
      }
      else {
        centerXRightBoundary = PlayAreaMap.X_BOUNDARY_POSITIONS.AT_RIGHT_EDGE;
      }

      const balloonCenter = balloonModel.getCenter();
      aNode.visible = balloonCenter.x !== PlayAreaMap.X_BOUNDARY_POSITIONS.AT_LEFT_EDGE;
      sNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_BOTTOM;
      dNode.visible = balloonCenter.x !== centerXRightBoundary;
      wNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP;
    } );

    // place the direction cues relative to the balloon bounds
    const balloonBounds = balloonModel.bounds;
    wNode.centerBottom = balloonBounds.getCenterTop().plusXY( 0, -BALLOON_KEY_SPACING );
    aNode.rightCenter = balloonBounds.getLeftCenter().plusXY( -BALLOON_KEY_SPACING, 0 );
    sNode.centerTop = balloonBounds.getCenterBottom().plusXY( 0, BALLOON_KEY_SPACING + SHADOW_WIDTH );
    dNode.leftCenter = balloonBounds.getRightCenter().plusXY( BALLOON_KEY_SPACING + SHADOW_WIDTH, 0 );
  }


  /**
   * Create a node that looks like a keyboard letter key next to an arrow indicating the direction the balloon
   * would move if that key is pressed.
   */
  private createMovementKeyNode( direction: 'up' | 'down' | 'left' | 'right' ): Node {

    // create the arrow icon
    const arrowShape = new Shape();
    arrowShape.moveTo( ARROW_HEIGHT / 2, 0 ).lineTo( ARROW_HEIGHT, ARROW_WIDTH ).lineTo( 0, ARROW_WIDTH ).close();
    const arrowIcon = new Path( arrowShape, {
      fill: 'white',
      stroke: 'black',
      lineJoin: 'bevel',
      lineCap: 'butt',
      lineWidth: 2,
      rotation: DIRECTION_ANGLES[ direction ]
    } );

    // create the letter key nodes and place in the correct layout box
    let keyIcon: TextKeyNode;
    let box: Node;
    if ( direction === 'up' ) {
      keyIcon = LetterKeyNode.w( LETTER_KEY_OPTIONS );
      box = new VBox( { children: [ arrowIcon, keyIcon ], spacing: KEY_ARROW_SPACING } );
    }
    else if ( direction === 'left' ) {
      keyIcon = LetterKeyNode.a( LETTER_KEY_OPTIONS );
      box = new HBox( { children: [ arrowIcon, keyIcon ], spacing: KEY_ARROW_SPACING } );
    }
    else if ( direction === 'right' ) {
      keyIcon = LetterKeyNode.d( LETTER_KEY_OPTIONS );
      box = new HBox( { children: [ keyIcon, arrowIcon ], spacing: KEY_ARROW_SPACING } );
    }
    else if ( direction === 'down' ) {
      keyIcon = LetterKeyNode.s( LETTER_KEY_OPTIONS );
      box = new VBox( { children: [ keyIcon, arrowIcon ], spacing: KEY_ARROW_SPACING } );
    }

    assert && assert( box!, `No box created for direction ${direction}` );
    return box!;
  }
}

balloonsAndStaticElectricity.register( 'BalloonInteractionCueNode', BalloonInteractionCueNode );

export default BalloonInteractionCueNode;