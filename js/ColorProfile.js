// Copyright 2015, University of Colorado Boulder

/**
 * Abstract type for handling color profiles in simulations. Handles multiple color profiles (by string name), and controls color property values
 * based on the active color profile.
 *
 * It also contains hooks that allow synchronizing the colors over iframe communication, so that colors can be controlled by a color picker.
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
   * @constructor
   *
   * @param {Object} colors - object hash, whose property names become Property names.
   *                          Each property is another hash, whose properties are the colors for each scheme.
   *                          (Confusing? You bet. See https://github.com/phetsims/scenery-phet/issues/277)
   * @param {Array.<string>} profileNames - A list of valid profile names that can be taken.
   */
  function ColorProfile( colors, profileNames ) {
    var self = this;

    // @public {Property.<string>} - The current profile name. Change this Property's value to change which profile is currently active.
    //                               'default' will use all default colors, and 'projector' is a common color profile that is also used.
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
