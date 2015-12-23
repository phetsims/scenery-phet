// Copyright 2015, University of Colorado Boulder

/**
 * A laser pointer, with on/off button.
 * Default orientation is pointing to the right. Origin is at right center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var modelsOfTheHydrogenAtom = require( 'MODELS_OF_THE_HYDROGEN_ATOM/modelsOfTheHydrogenAtom' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RoundMomentaryButton = require( 'SUN/buttons/RoundMomentaryButton' );
  var RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );

  /**
   * @param {Property.<boolean>} onProperty - is the laser on?
   * @param {Object} [options]
   * @constructor
   */
  function LaserPointerNode( onProperty, options ) {

    options = _.extend( {

      // nozzle and body options
      bodySize: new Dimension2( 78, 110 ),
      nozzleSize: new Dimension2( 60, 20 ),
      baseColor: 'rgb( 50, 50, 50 )',
      highlightColor: 'rgb( 245, 245, 245 )',
      stroke: 'black',
      cornerRadius: 5,

      // button options
      buttonType: 'toggle', // {string} 'toggle'|'momentary'
      buttonColor: 'red',
      buttonRadius: 22,
      buttonTouchExpansion: 15

    }, options );

    // validate options
    assert && assert( options.buttonType === 'toggle' || options.buttonType === 'momentary',
      'invalid buttonType: ' + options.buttonType );

    // the narrow part that the light will come out of
    var nozzleNode = new Rectangle( 0, 0, options.nozzleSize.width + options.cornerRadius, options.nozzleSize.height, {
      cornerRadius: options.cornerRadius,
      fill: new LinearGradient( 0, 0, options.nozzleSize.width, 0 )
        .addColorStop( 0, options.baseColor )
        .addColorStop( 0.3, options.highlightColor )
        .addColorStop( 1, options.baseColor ),
      stroke: options.stroke
    } );

    // the main body of the laser pointer
    var bodyNode = new Rectangle( 0, 0, options.bodySize.width, options.bodySize.height, {
      cornerRadius: options.cornerRadius,
      fill: new LinearGradient( 0, 0, options.bodySize.width, 0 )
        .addColorStop( 0, options.baseColor )
        .addColorStop( 0.3, options.highlightColor )
        .addColorStop( 1, options.baseColor ),
      stroke: options.stroke,
      centerX: nozzleNode.centerX,
      top: nozzleNode.bottom - options.cornerRadius // overlap to hide corner radius
    } );

    // the button that controls whether the laser is on or off
    var buttonOptions = {
      radius: options.buttonRadius,
      touchExpansion: options.buttonTouchExpansion,
      baseColor: options.buttonColor,
      center: bodyNode.center
    };
    // @private
    this.button = ( options.buttonType === 'toggle' ) ?
                 new RoundStickyToggleButton( false, true, onProperty, buttonOptions ) :
                 new RoundMomentaryButton( false, true, onProperty, buttonOptions );

    // @private called by dispose
    this.disposeLaserPointerNode = function() {
      this.button.dispose();
    };

    options.children = [ nozzleNode, bodyNode, this.button ];
    Node.call( this, options );
  }

  modelsOfTheHydrogenAtom.register( 'LaserPointerNode', LaserPointerNode );

  return inherit( Node, LaserPointerNode, {

    // @public
    dispose: function() {
      this.disposeLaserPointerNode();
    },

    /**
     * Sets the enabled state of the laser's button.
     * @param {boolean} value
     * @public
     */
    setEnabled: function( value ) {
      this.button.enabled = value;
    },
    set enabled( value ) { this.setEnabled( value ); },

    /**
     * Gets the enabled state of the laser's button.
     * @returns {boolean}
     * @public
     */
    getEnabled: function() {return this.button.enabled; },
    get enabled() { return this.getEnabled(); }
  } );
} );
