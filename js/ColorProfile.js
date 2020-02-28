// Copyright 2015-2020, University of Colorado Boulder

/**
 * Abstract type for handling color profiles in simulations. Handles multiple color profiles (by string name),
 * and controls color Property values based on the active color profile.
 *
 * It also contains hooks that allow synchronizing the colors over iframe communication, so that colors can be
 * controlled by a color picker.
 *
 * ColorProfile will take an object map ({string} color name => {Object} profile map) and will create a
 * {Property.<Color>} for each, that will change based on the color profile's profileNameProperty's current value.
 *
 * For example:
 *
 * var profile = new ColorProfile( [ 'default', 'projector' ], {
 *   fishFill: {
 *     default: new Color( 0, 0, 0 ),
 *     projector: 'white'
 *   },
 *   fishStroke: {
 *     default: '#0f0'
 *     projector: Color.BLUE
 *   }
 * } );
 *
 * creates a ColorProfile object that now contains the three Properties:
 * {
 *   profileNameProperty: {Property.<string>} - initially 'default',
 *   fishFillProperty: {Property.<Color>} - initially the new Color( 0, 0, 0 ),
 *   fishStrokeProperty: {Property.<Color>} - initially #0f0 converted to a Color object
 * }
 *
 * The color Properties will change whenever the profileName Property changes, so:
 *
 * profile.profileNameProperty.value = 'projector';
 *
 * will set the ColorProfile to the 'projector' profile, updating both of the color Properties to their specified
 * 'projector' colors (converted to Scenery Color objects as necessary).
 *
 * NOTE: It is acceptable to omit a non-default profile key for colors, e.g. just { default: ... }. If a profile key
 * is not present for the color, then the default will be used.
 *
 * NOTE: It is ideal to pass color Properties directly to Scenery object fill/strokes, e.g.:
 *
 *   new Path( ..., { fill: profile.fishFillProperty } );
 *
 * NOTE: Generally a require.js module should be responsible for returning a singleton instance of ColorProfile for
 * a simulation, e.g. GravityAndOrbitsColorProfile.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Aaron Davis
 */

import Property from '../../axon/js/Property.js';
import StringProperty from '../../axon/js/StringProperty.js';
import inherit from '../../phet-core/js/inherit.js';
import Color from '../../scenery/js/util/Color.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const tandem = Tandem.GLOBAL.createTandem( 'colorProfile' );

/**
 * @public
 * @constructor
 *
 * @param {Array.<string>} profileNames - A list of valid profile names that can be taken.
 * @param {Object} colors - See documentation above
 */
function ColorProfile( profileNames, colors ) {
  const self = this;

  // @public (read-only)
  this.profileNames = profileNames;

  // Query parameter may override the default profile name.
  const initialProfileName = phet.chipper.queryParameters.colorProfile || ColorProfile.DEFAULT_COLOR_PROFILE_NAME;
  if ( profileNames.indexOf( initialProfileName ) === -1 ) {
    throw new Error( `invalid colorProfile: ${initialProfileName}` );
  }

  // @public {Property.<string>}
  // The current profile name. Change this Property's value to change which profile is currently active.
  this.profileNameProperty = new StringProperty( initialProfileName, {
    tandem: tandem.createTandem( 'profileNameProperty' ),
    validValues: profileNames
  } );

  Object.keys( colors ).sort().forEach( function( key ) {
    if ( colors.hasOwnProperty( key ) ) {

      // Turn strings/hex to Color objects
      const colorMap = _.mapValues( colors[ key ], Color.toColor );

      assert && assert( colorMap.hasOwnProperty( ColorProfile.DEFAULT_COLOR_PROFILE_NAME ),
        `missing default color for key=${key}` );
      assert && assert( key !== 'profileName',
        'Unlikely, but would have hilarious consequences since we would overwrite profileNameProperty' );

      // Use the requested initial profile, fallback to default.
      const initialColor = colorMap[ initialProfileName ] || colorMap[ ColorProfile.DEFAULT_COLOR_PROFILE_NAME ];

      // Create a Property for the color
      const colorProperty = new Property( initialColor );
      self[ key + 'Property' ] = colorProperty;

      // Update the Property on profile name changes
      self.profileNameProperty.lazyLink( function( profileName ) {
        colorProperty.value = colorMap[ profileName ] || colorMap[ ColorProfile.DEFAULT_COLOR_PROFILE_NAME ];
      } );

      // Communicate color changes to the iframe
      colorProperty.link( function( color ) {
        self.reportColor( key );
      } );
    }
  } );

  // receives iframe communication to set a color
  window.addEventListener( 'message', function( evt ) {
    let data;
    try {
      data = JSON.parse( evt.data );
    }
    catch( e ) {
      // We don't do anything with the caught value. If this happens, it is not JSON. This can happen with the
      // LoL wrappers, see https://github.com/phetsims/joist/issues/484.
    }
    if ( data && data.type === 'setColor' ) {
      self[ data.name + 'Property' ].value = new Color( data.value );
    }
  } );
}

sceneryPhet.register( 'ColorProfile', ColorProfile );

// @public (read-only) the default profile required by all ColorProfile instances
ColorProfile.DEFAULT_COLOR_PROFILE_NAME = 'default';

// @public (read-only) a common profile that appears in sims that have 'Projector Mode' feature
ColorProfile.PROJECTOR_COLOR_PROFILE_NAME = 'projector';

export default inherit( Object, ColorProfile, {
  /**
   * Sends color change events as iframe messages, so that a container can be notified (and possibly update color pickers).
   * @private
   *
   * @param {string} key - The color name that was changed
   */
  reportColor: function( key ) {
    let hexColor = this[ key + 'Property' ].value.toNumber().toString( 16 );
    while ( hexColor.length < 6 ) {
      hexColor = '0' + hexColor;
    }

    ( window.parent !== window ) && window.parent.postMessage( JSON.stringify( {
      type: 'reportColor',
      name: key,
      value: '#' + hexColor
    } ), '*' );
  },

  /**
   * Does this ColorProfile has the specified color profile?
   * @param {string} profileName
   * @returns {boolean}
   */
  hasProfile( profileName ) {
    return ( this.profileNames.indexOf( profileName ) !== -1 );
  }
} );