// Copyright 2017-2023, University of Colorado Boulder

/**
 * A node that provides an interaction cue for dragging the balloon in Balloons and Static Electricity. Includes arrow
 * and letter keys to indicate that the user can use WASD or arrow keys to move it around the play area.
 *
 * @author Jesse Greenberg
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import LetterKeyNode, { LetterKeyNodeOptions } from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Path, VBox } from '../../../../scenery/js/imports.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PlayAreaMap from '../model/PlayAreaMap.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BalloonModel from '../model/BalloonModel.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';

// constants
const ARROW_HEIGHT = 15; // dimensions for the arrow icons
const KEY_HEIGHT = 24; // height of the arrow key, larger than default KeyNode height
const ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * ARROW_HEIGHT; // for equilateral triangle
const SHADOW_OFFSET = 2;
const LETTER_KEY_OPTIONS: LetterKeyNodeOptions = {
  font: new PhetFont( 14 ),
  keyHeight: KEY_HEIGHT,
  xShadowOffset: SHADOW_OFFSET,
  yShadowOffset: SHADOW_OFFSET
};
const KEY_ARROW_SPACING = 2;
const KEY_SPACING = 8;

// possible directions or the directional cues
const DIRECTION_ANGLES = {
  up: 0,
  down: Math.PI,
  left: -Math.PI / 2,
  right: Math.PI / 2
};

class WASDCueNode extends Node {
  protected wNode: Node;
  protected aNode: Node;
  protected sNode: Node;
  protected dNode: Node;

  public constructor( boundsProperty: TReadOnlyProperty<Bounds2> ) {

    super();

    this.wNode = this.createMovementKeyNode( 'up' );
    this.aNode = this.createMovementKeyNode( 'left' );
    this.sNode = this.createMovementKeyNode( 'down' );
    this.dNode = this.createMovementKeyNode( 'right' );

    const directionKeysParent = new Node( {
      children: [
        this.wNode,
        this.aNode,
        this.sNode,
        this.dNode
      ]
    } );

    this.addChild( directionKeysParent );

    boundsProperty.link( bounds => {

      // place the direction cues relative to the object bounds
      this.wNode.centerBottom = bounds.getCenterTop().plusXY( 0, -KEY_SPACING );
      this.aNode.rightCenter = bounds.getLeftCenter().plusXY( -KEY_SPACING, 0 );
      this.sNode.centerTop = bounds.getCenterBottom().plusXY( 0, KEY_SPACING + SHADOW_OFFSET );
      this.dNode.leftCenter = bounds.getRightCenter().plusXY( KEY_SPACING + SHADOW_OFFSET, 0 );
    } );
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

class BalloonInteractionCueNode extends WASDCueNode {

  public constructor( wallIsVisibleProperty: TReadOnlyProperty<boolean>, balloonModel: BalloonModel ) {

    super( new Property( balloonModel.bounds ) );

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
      this.aNode.visible = balloonCenter.x !== PlayAreaMap.X_BOUNDARY_POSITIONS.AT_LEFT_EDGE;
      this.sNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_BOTTOM;
      this.dNode.visible = balloonCenter.x !== centerXRightBoundary;
      this.wNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP;
    } );
  }
}

balloonsAndStaticElectricity.register( 'BalloonInteractionCueNode', BalloonInteractionCueNode );

export default BalloonInteractionCueNode;