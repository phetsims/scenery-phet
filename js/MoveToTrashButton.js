// Copyright 2017-2019, University of Colorado Boulder

/**
 * A button whose icon means 'move to trash'.
 * The arrow can be color-coded to the thing being deleted by setting options.arrowColor.
 *
 * @author Sam Reid
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonInteractionState = require( 'SUN/buttons/ButtonInteractionState' );
  var Color = require( 'SCENERY/util/Color' );
  var CurvedArrowShape = require( 'SCENERY_PHET/CurvedArrowShape' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants
  var DISABLED_COLOR = 'rgba( 0, 0, 0, 0.3 )';

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function MoveToTrashButton( options ) {

    options = _.extend( {

      // {Color|string} by default the arrow is color-coded for thermal energy, see scenery-phet#320
      baseColor: new Color( 230, 230, 240 ),
      disabledBaseColor: 'white',
      arrowColor: 'black',
      cornerRadius: 6,
      buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
      xMargin: 7,
      yMargin: 3,
      tandem: Tandem.required
    }, options );

    assert && assert( !options.contentAppearanceStrategy, 'MoveToTrashButton sets contentAppearanceStrategy' );
    options.contentAppearanceStrategy = function( content, interactionStateProperty ) {

      function updateEnabled( state ) {
        if ( content ) {
          var enabled = state !== ButtonInteractionState.DISABLED &&
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

    var arrowShape = new CurvedArrowShape( 10, -0.9 * Math.PI, -0.2 * Math.PI, {
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
  }

  sceneryPhet.register( 'MoveToTrashButton', MoveToTrashButton );

  return inherit( RectangularPushButton, MoveToTrashButton );
} );