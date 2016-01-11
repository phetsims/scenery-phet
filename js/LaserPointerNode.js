// Copyright 2015, University of Colorado Boulder

/**
 * A laser pointer, with on/off button (toggle or momentary).
 * Default orientation is pointing to the right. Origin is at right center (the edge of the output nozzle).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RoundMomentaryButton = require( 'SUN/buttons/RoundMomentaryButton' );
  var RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Property.<boolean>} onProperty - is the laser on?
   * @param {Object} [options]
   * @constructor
   */
  function LaserPointerNode( onProperty, options ) {

    options = _.extend( {

      // nozzle and body options
      bodySize: new Dimension2( 110, 78 ),
      nozzleSize: new Dimension2( 20, 60 ),
      topColor: 'rgb( 170, 170, 170 )',
      bottomColor: 'rgb( 40, 40, 40 )',
      highlightColor: 'rgb( 245, 245, 245 )',
      stroke: 'black',
      cornerRadius: 5,

      // button options
      buttonType: 'toggle', // {string} 'toggle'|'momentary'
      buttonColor: 'red',
      buttonRadius: 22,
      buttonTouchExpansion: 15,

      // PhET-iO
      tandem: null

    }, options );

    // validate options
    assert && assert( options.buttonType === 'toggle' || options.buttonType === 'momentary',
      'invalid buttonType: ' + options.buttonType );

    // the narrow part that the light will come out of
    var nozzleNode = new Rectangle( 0, 0, options.nozzleSize.width + options.cornerRadius, options.nozzleSize.height, {
      cornerRadius: options.cornerRadius,
      fill: new LinearGradient( 0, 0, 0, options.nozzleSize.height )
        .addColorStop( 0, options.topColor )
        .addColorStop( 0.3, options.highlightColor )
        .addColorStop( 1, options.bottomColor ),
      stroke: options.stroke,
      right: 0,
      centerY: 0
    } );

    // the main body of the laser pointer
    var bodyNode = new Rectangle( 0, 0, options.bodySize.width, options.bodySize.height, {
      cornerRadius: options.cornerRadius,
      fill: new LinearGradient( 0, 0, 0, options.bodySize.height )
        .addColorStop( 0, options.topColor )
        .addColorStop( 0.3, options.highlightColor )
        .addColorStop( 1, options.bottomColor ),
      stroke: options.stroke,
      right: nozzleNode.left + options.cornerRadius, // overlap to hide corner radius
      centerY: nozzleNode.centerY
    } );

    // the button that controls whether the laser is on or off
    var buttonOptions = {
      radius: options.buttonRadius,
      touchExpansion: options.buttonTouchExpansion,
      baseColor: options.buttonColor,
      center: bodyNode.center,
      tandem: options.tandem && options.tandem.createTandem( 'button' )
    };

    // @private
    this.button = ( options.buttonType === 'toggle' ) ?
                  new RoundStickyToggleButton( false, true, onProperty, buttonOptions ) :
                  new RoundMomentaryButton( false, true, onProperty, buttonOptions );

    // add any children specified by the client
    options.children = [ nozzleNode, bodyNode, this.button ].concat( options.children || [] );
    Node.call( this, options );

    this.tandem = options.tandem; // @private
    this.tandem && this.tandem.addInstance( this );

    // @private called by dispose
    var thisNode = this;
    this.disposeLaserPointerNode = function() {
      thisNode.button.dispose();
      thisNode.tandem && thisNode.tandem.removeInstance( thisNode );
    };
  }

  sceneryPhet.register( 'LaserPointerNode', LaserPointerNode );

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
    setEnabled: function( value ) { this.button.enabled = value; },
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
