// Copyright 2017-2020, University of Colorado Boulder

/**
 * MoveToTrashButton is a push button whose icon means 'move to trash'.
 * The arrow can be color-coded to the thing being deleted by setting options.arrowColor.
 *
 * @author Sam Reid
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Color from '../../scenery/js/util/Color.js';
import RectangularButtonView from '../../sun/js/buttons/RectangularButtonView.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import FontAwesomeNode from '../../sun/js/FontAwesomeNode.js';
import Tandem from '../../tandem/js/Tandem.js';
import CurvedArrowShape from './CurvedArrowShape.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @constructor
 *
 * @param {Object} [options]
 */
function MoveToTrashButton( options ) {

  options = merge( {
    arrowColor: 'black',

    // RectangularPushButton options
    baseColor: new Color( 230, 230, 240 ),
    disabledBaseColor: 'white',
    buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
    cornerRadius: 6,
    xMargin: 7,
    yMargin: 3,
    tandem: Tandem.REQUIRED
  }, options );

  const trashNode = new FontAwesomeNode( 'trash', {
    tandem: options.tandem.createTandem( 'trashPath' )
  } );

  const arrowShape = new CurvedArrowShape( 10, -0.9 * Math.PI, -0.2 * Math.PI, {
    headWidth: 12,
    tailWidth: 4,
    tandem: options.tandem.createTandem( 'arrowShape' )
  } );

  const arrowPath = new Path( arrowShape, {
    fill: options.arrowColor,
    right: trashNode.left + ( 0.75 * trashNode.width ), // a bit to the left of center
    bottom: trashNode.top,
    tandem: options.tandem.createTandem( 'arrowPath' )
  } );

  options.content = new Node( {
    children: [ trashNode, arrowPath ],
    scale: 0.4
  } );

  RectangularPushButton.call( this, options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'MoveToTrashButton', this );
}

sceneryPhet.register( 'MoveToTrashButton', MoveToTrashButton );

inherit( RectangularPushButton, MoveToTrashButton );
export default MoveToTrashButton;