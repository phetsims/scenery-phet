// Copyright 2015-2018, University of Colorado Boulder

/**
 * A laser pointer, with optional on/off button (toggle or momentary).
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
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RoundMomentaryButton = require( 'SUN/buttons/RoundMomentaryButton' );
  var RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEFAULT_OPTIONS = {

    // {Property.<boolean>} Set this if you want to control enabled via your own Property.
    // Otherwise use this.enabledProperty or the setter/getter for enabled.
    enabledProperty: null,

    // nozzle and body options
    bodySize: new Dimension2( 110, 78 ),
    nozzleSize: new Dimension2( 20, 60 ),
    topColor: 'rgb( 170, 170, 170 )',
    bottomColor: 'rgb( 40, 40, 40 )',
    highlightColor: 'rgb( 245, 245, 245 )',
    highlightColorStop: 0.3,  // {number} color stop for highlight, (0,1) exclusive range
    stroke: 'black',
    lineWidth: 1,
    cornerRadius: 5,

    // button options
    hasButton: true, // {boolean} other button options are ignore if this is false
    buttonType: 'toggle', // {string} 'toggle'|'momentary'
    buttonColor: 'red',
    buttonRadius: 22,
    buttonTouchAreaDilation: 15,
    buttonMouseAreaDilation: 0,
    buttonRotation: 0, // {number} use this to adjust lighting on the button
    buttonAccessibleName: '',
    buttonDescriptionContent: '',

    // When enabled, the glass shows a semi-circular blue-ish lens on the output of the laser pointer node.
    // It does not change the origin of the laser pointer node, which is at the center of the casing.  The glass is
    // sometimes used to help cue the user that it is a non-laser light source.
    // See https://github.com/phetsims/scenery-phet/issues/366
    hasGlass: false,
    glassOptions: null, // {Object|null} to be filled in with defaults below, or overriden, see DEFAULT_GLASS_OPTIONS

    // PhET-iO
    tandem: Tandem.required
  };
  assert && Object.freeze( DEFAULT_OPTIONS );

  // Glass options, nested as discussed in https://github.com/phetsims/tasks/issues/730
  var DEFAULT_GLASS_OPTIONS = {
    mainColor: 'rgb(188,225,238)',
    highlightColor: 'white',
    shadowColor: 'white',
    stroke: 'black',
    heightProportion: 0.7, // The fraction of the nozzle height, between 0 (no height) and 1 (the nozzle height)
    proportionStickingOut: 0.5 // The amount the glass "sticks out" between 0 (not at all) and 1 (hemisphere)
  };
  assert && Object.freeze( DEFAULT_GLASS_OPTIONS );

  /**
   * @param {Property.<boolean>} onProperty - is the laser on?
   * @param {Object} [options]
   * @constructor
   */
  function LaserPointerNode( onProperty, options ) {

    options = _.extend( {}, DEFAULT_OPTIONS, options );

    options.glassOptions = _.extend( {}, DEFAULT_GLASS_OPTIONS, options.glassOptions );

    assert && assert( options.highlightColorStop > 0 && options.highlightColorStop < 1 );

    this.enabledProperty = options.enabledProperty || new Property( true ); // @public

    // validate options
    assert && assert( options.buttonType === 'toggle' || options.buttonType === 'momentary',
      'invalid buttonType: ' + options.buttonType );

    var self = this;
    var children = [];

    // the narrow part that the light will come out of
    var nozzleNode = new Rectangle( 0, 0, options.nozzleSize.width + options.cornerRadius, options.nozzleSize.height, {
      cornerRadius: options.cornerRadius,
      fill: new LinearGradient( 0, 0, 0, options.nozzleSize.height )
        .addColorStop( 0, options.topColor )
        .addColorStop( options.highlightColorStop, options.highlightColor )
        .addColorStop( 1, options.bottomColor ),
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      right: 0,
      centerY: 0
    } );
    children.push( nozzleNode );

    // the main body of the laser pointer
    var bodyNode = new Rectangle( 0, 0, options.bodySize.width, options.bodySize.height, {
      cornerRadius: options.cornerRadius,
      fill: new LinearGradient( 0, 0, 0, options.bodySize.height )
        .addColorStop( 0, options.topColor )
        .addColorStop( options.highlightColorStop, options.highlightColor )
        .addColorStop( 1, options.bottomColor ),
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      right: nozzleNode.left + options.cornerRadius, // overlap to hide corner radius
      centerY: nozzleNode.centerY
    } );
    children.push( bodyNode );

    // the optional button that controls whether the laser is on or off
    if ( options.hasButton ) {

      var buttonOptions = {
        radius: options.buttonRadius,
        touchAreaDilation: options.buttonTouchAreaDilation,
        mouseAreaDilation: options.buttonMouseAreaDilation,
        baseColor: options.buttonColor,
        rotation: options.buttonRotation,
        center: bodyNode.center,
        tandem: options.tandem.createTandem( 'button' ),

        // a11y
        labelContent: options.buttonAccessibleName,
        labelTagName: 'label',
        descriptionContent: options.buttonDescriptionContent
      };

      // @private
      this.button = ( options.buttonType === 'toggle' ) ?
                    new RoundStickyToggleButton( false, true, onProperty, buttonOptions ) :
                    new RoundMomentaryButton( false, true, onProperty, buttonOptions );

      children.push( this.button );
    }

    // Add the glass, if any
    if ( options.hasGlass ) {
      var glassDiameter = options.nozzleSize.height * options.glassOptions.heightProportion;
      var glassOptions = _.extend( {}, options.glassOptions, {

        // The origin is at the output point of the nozzle, translate accordingly
        centerX: Util.linear( 0, 1, -glassDiameter / 2, 0, options.glassOptions.proportionStickingOut ),

        // Center vertically
        centerY: 0
      } );
      var glassNode = new ShadedSphereNode( glassDiameter, glassOptions );

      // Glass is behind everything else.
      children.unshift( glassNode );
    }

    // add any children specified by the client
    options.children = children.concat( options.children || [] );
    Node.call( this, options );

    // enables and disables the button
    var enabledObserver = function( enabled ) {
      self.button && ( self.button.enabled = enabled );
    };
    this.enabledProperty.link( enabledObserver );

    // @private called by dispose
    this.disposeLaserPointerNode = function() {
      self.button && self.button.dispose();
      self.enabledProperty.unlink( enabledObserver );
    };
  }

  sceneryPhet.register( 'LaserPointerNode', LaserPointerNode );

  return inherit( Node, LaserPointerNode, {

    // @public
    dispose: function() {
      this.disposeLaserPointerNode();
      Node.prototype.dispose.call( this );
    },

    /**
     * Sets the enabled state.
     * @param {boolean} value
     * @public
     */
    setEnabled: function( value ) { this.enabledProperty.set( value ); },
    set enabled( value ) { this.setEnabled( value ); },

    /**
     * Gets the enabled state.
     * @returns {boolean}
     * @public
     */
    getEnabled: function() {return this.enabledProperty.get(); },
    get enabled() { return this.getEnabled(); }
  }, {

    DEFAULT_OPTIONS: DEFAULT_OPTIONS
  } );
} );
