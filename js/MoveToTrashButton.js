// Copyright 2017-2020, University of Colorado Boulder

/**
 * A button whose icon means 'move to trash'.
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
import ButtonInteractionState from '../../sun/js/buttons/ButtonInteractionState.js';
import RectangularButtonView from '../../sun/js/buttons/RectangularButtonView.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import FontAwesomeNode from '../../sun/js/FontAwesomeNode.js';
import Tandem from '../../tandem/js/Tandem.js';
import CurvedArrowShape from './CurvedArrowShape.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DISABLED_COLOR = 'rgba( 0, 0, 0, 0.3 )';

/**
 * @constructor
 *
 * @param {Object} [options]
 */
function MoveToTrashButton( options ) {

  options = merge( {

    // {Color|string} by default the arrow is color-coded for thermal energy, see scenery-phet#320
    baseColor: new Color( 230, 230, 240 ),
    disabledBaseColor: 'white',
    arrowColor: 'black',
    cornerRadius: 6,
    buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
    xMargin: 7,
    yMargin: 3,
    tandem: Tandem.REQUIRED
  }, options );

  assert && assert( !options.contentAppearanceStrategy, 'MoveToTrashButton sets contentAppearanceStrategy' );
  options.contentAppearanceStrategy = function( content, interactionStateProperty ) {

    function updateEnabled( state ) {
      if ( content ) {
        const enabled = state !== ButtonInteractionState.DISABLED &&
                        state !== ButtonInteractionState.DISABLED_PRESSED;

        arrowPath.fill = enabled ? options.arrowColor : DISABLED_COLOR;
        trashPath.fill = enabled ? 'black' : DISABLED_COLOR;
      }
    }

    interactionStateProperty.link( updateEnabled );
    this.dispose = function() {
      interactionStateProperty.unlink( updateEnabled );
    };
  };

  var trashPath = new FontAwesomeNode( 'trash', { tandem: options.tandem.createTandem( 'trashPath' ) } );

  const arrowShape = new CurvedArrowShape( 10, -0.9 * Math.PI, -0.2 * Math.PI, {
    tandem: options.tandem.createTandem( 'arrowShape' ),
    headWidth: 12,
    tailWidth: 4
  } );

  var arrowPath = new Path( arrowShape, {
    tandem: options.tandem.createTandem( 'arrowPath' ),
    bottom: trashPath.top,
    right: trashPath.left + trashPath.width * 0.75
  } );

  options.content = new Node( {
    children: [ trashPath, arrowPath ],
    scale: 0.4
  } );

  RectangularPushButton.call( this, options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'MoveToTrashButton', this );
}

sceneryPhet.register( 'MoveToTrashButton', MoveToTrashButton );

inherit( RectangularPushButton, MoveToTrashButton );
export default MoveToTrashButton;