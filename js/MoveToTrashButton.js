// Copyright 2017-2020, University of Colorado Boulder

/**
 * MoveToTrashButton is a push button whose icon means 'move to trash'.
 * The arrow can be color-coded to the thing being deleted by setting options.arrowColor.
 *
 * @author Sam Reid
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import RectangularButtonView from '../../sun/js/buttons/RectangularButtonView.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import FontAwesomeNode from '../../sun/js/FontAwesomeNode.js';
import CurvedArrowShape from './CurvedArrowShape.js';
import sceneryPhet from './sceneryPhet.js';

class MoveToTrashButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // MoveToTrashButton options
      arrowColor: 'black',

      // RectangularPushButton options
      baseColor: 'rgb( 230, 230, 240 )',
      disabledBaseColor: 'white',
      buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
      cornerRadius: 6,
      xMargin: 7,
      yMargin: 3
    }, options );

    const trashNode = new FontAwesomeNode( 'trash' );

    const arrowShape = new CurvedArrowShape( 10, -0.9 * Math.PI, -0.2 * Math.PI, {
      headWidth: 12,
      tailWidth: 4
    } );

    const arrowPath = new Path( arrowShape, {
      fill: options.arrowColor,
      right: trashNode.left + ( 0.75 * trashNode.width ), // a bit to the left of center
      bottom: trashNode.top
    } );

    assert && assert( !options.content, 'MoveToTrashButton sets content' );
    options.content = new Node( {
      children: [ trashNode, arrowPath ],
      scale: 0.4
    } );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'MoveToTrashButton', this );
  }
}

sceneryPhet.register( 'MoveToTrashButton', MoveToTrashButton );
export default MoveToTrashButton;