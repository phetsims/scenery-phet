// Copyright 2013-2015, University of Colorado Boulder

/**
 * A button meant for conditionally being able to clear thermal energy from a system. Has a trash can with an arrow,
 * and appears disabled if there is no thermal energy.
 *
 * @author Sam Reid
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
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

  /**
   * @constructor
   *
   * @param {Object} [options]
   */
  function ClearThermalButton( options ) {
    options = _.extend( {
      baseColor: new Color( 230, 230, 240 ),
      disabledBaseColor: 'white',
      cornerRadius: 6,
      buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
      contentAppearanceStrategy: function( content, interactionStateProperty ) {
        function updateEnabled( state ) {
          if ( content ) {
            var enabled = state !== 'disabled' && state !== 'disabled-pressed';

            arrowPath.fill = enabled ? '#f05a28' : 'rgba(0,0,0,0.3)';
            trashPath.fill = enabled ? 'black' : 'rgba(0,0,0,0.3)';
          }
        }
        interactionStateProperty.link( updateEnabled );
        this.dispose = function() {
          interactionStateProperty.unlink( updateEnabled );
        };
      },
      xMargin: 7,
      yMargin: 3,
      tandem: Tandem.tandemRequired()
    }, options );

    var arrowShape = new CurvedArrowShape( 10, -0.9 * Math.PI, -0.2 * Math.PI, {
      tandem: options.tandem.createTandem( 'arrowShape' ),
      headWidth: 12,
      tailWidth: 4
      // TODO
    } );

    // @private {Path}
    var trashPath = new FontAwesomeNode( 'trash', { tandem: options.tandem.createTandem( 'trashPath' ) } );
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

  sceneryPhet.register( 'ClearThermalButton', ClearThermalButton );

  return inherit( RectangularPushButton, ClearThermalButton );
} );