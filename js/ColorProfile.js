// Copyright 2015-2016, University of Colorado Boulder

/**
 * Abstract type for handling color profiles in simulations. Handles multiple color profiles (by string name), and controls color property values
 * based on the active color profile.
 *
 * It also contains hooks that allow synchronizing the colors over iframe communication, so that colors can be controlled by a color picker.
 *
 * ColorProfile will take an object map ({string} color name => {Object} profile map) and will create a {Property<Color>} for each, that will
 * change based on the color profile's profileNameProperty's current value.
 *
 * For example:
 *
 * var profile = new ColorProfile( {
 *   fishFill: {
 *     default: new Color( 0, 0, 0 ),
 *     projector: 'white'
 *   },
 *   fishStroke: {
 *     default: '#0f0'
 *     projector: Color.BLUE
 *   }
 * }, [ 'default', 'projector' ] );
 *
 * creates a ColorProfile object that now contains the three properties:
 * {
 *   profileNameProperty: {Property.<string>} - initially 'default',
 *   fishFillProperty: {Property.<Color>} - initially the new Color( 0, 0, 0 ),
 *   fishStrokeProperty: {Property.<Color>} - initially #0f0 converted to a Color object
 * }
 *
 * The color properties will change whenever the profileName property changes, so:
 *
 * profile.profileNameProperty.value = 'projector';
 *
 * will set the ColorProfile to the 'projector' profile name, updating both of the color properties to their specified 'projector' colors
 * (converted to Scenery Color objects as necessary).
 *
 * NOTE: It is acceptable to omit a non-default profile key for colors, e.g. just { default: ... }. If a profile key is not present for the color,
 *       then the default will be used.
 *
 * NOTE: It is ideal to pass color properties directly to Scenery object fill/strokes, e.g.:
 *
 *   new Path( ..., { fill: profile.fishFillProperty } );
 *
 * NOTE: Generally a require.js module should be responsible for returning a singleton instance of ColorProfile for a simulation, e.g.
 *       GravityAndOrbitsColorProfile.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @public
   * @constructor
   *
   * @param {Object} colors - See documentation above
   * @param {Array.<string>} profileNames - A list of valid profile names that can be taken.
   */
  function ColorProfile( colors, profileNames ) {
    var self = this;

    // @public {Property.<string>}
    // The current profile name. Change this Property's value to change which profile is currently active.
    // 'default' will use all default colors, and 'projector' is a common color profile that is also used.
    var profileNameProperty = this.profileNameProperty = new Property( 'default', {
      validValues: profileNames
    } );

    Object.keys( colors ).sort().forEach( function( key ) {
      if ( colors.hasOwnProperty( key ) ) {
        // Turn strings/hex to Color objects
        var colorMap = _.mapValues( colors[ key ], Color.toColor );

        assert && assert( colorMap.hasOwnProperty( 'default' ), 'missing default color for ColorProfile: ' + key );
        assert && assert( key !== 'profileName', 'Unlikely, but would have hilarious consequences since we would overwrite profileNameProperty' );

        // Set the property on the color profile
        var property = self[ key + 'Property' ] = new Property( colorMap.default );

        // Update our property on profile name changes
        profileNameProperty.lazyLink( function( profileName ) {
          property.value = colorMap[ profileName ] || colorMap.default;
        } );

        // Communicate color changes to the iframe
        property.link( function( color ) {
          self.reportColor( key );
        } );
      }
    } );

    // receives iframe communication to set a color
    window.addEventListener( 'message', function( evt ) {
      var data = JSON.parse( evt.data );
      if ( data.type === 'setColor' ) {
        self[ data.name + 'Property' ].value = new Color( data.value );
      }
    } );
  }

  sceneryPhet.register( 'ColorProfile', ColorProfile );

  return inherit( Object, ColorProfile, {
    /**
     * Sends color change events as iframe messages, so that a container can be notified (and possibly update color pickers).
     * @private
     *
     * @param {string} key - The color name that was changed
     */
    reportColor: function( key ) {
      var hexColor = this[ key + 'Property' ].value.toNumber().toString( 16 );
      while ( hexColor.length < 6 ) {
        hexColor = '0' + hexColor;
      }

      window.parent && window.parent.postMessage( JSON.stringify( {
        type: 'reportColor',
        name: key,
        value: '#' + hexColor
      } ), '*' );
    }
  } );
} );
