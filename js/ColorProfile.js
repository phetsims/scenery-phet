// Copyright 2002-2015, University of Colorado Boulder

/**
 * Abstract class for color profiles for simulations. See GravityAndOrbitsColors for an example.
 * This file was modelled after MoleculeShapesColors.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  function ColorProfile( colors ) {

    var thisProfile = this;

    this.colors = colors; // @private

    // initial properties object, to load into the PropertySet (so reset works nicely)
    // all properties are @public (read-only) except profileNameProperty, which is @public
    var initialProperties = {
      profileName: 'default' // {string} @public - name of the color profile, e.g. 'default' or 'projector'
    };

    for ( var key in colors ) {
      assert && assert( colors[ key ].hasOwnProperty( 'default' ), 'missing default color for "' + key + '"' );
      initialProperties[ key ] = colors[ key ].default;
    }
    PropertySet.call( this, initialProperties );

    // receives iframe communication to set a color
    window.addEventListener( 'message', function( evt ) {
      var data = JSON.parse( evt.data );
      if ( data.type === 'setColor' ) {
        thisProfile[ data.name ] = new Color( data.value );
      }
    } );

    // Applies all colors for the specific named color scheme, ignoring colors that aren't specified for it.
    this.profileNameProperty.link( function( profileName ) {
      for ( var key in thisProfile.colors ) {
        var oldColor = thisProfile[ key ];
        var colorObject = thisProfile.colors[ key ];
        var newColor = ( profileName in colorObject ) ? colorObject[ profileName ] : colorObject[ 'default' ];
        if ( !newColor.equals( oldColor ) ) {
          thisProfile[ key ] = newColor;
          thisProfile.reportColor( key );
        }
      }
      thisProfile.trigger( 'profileChanged' );
    } );

    // initial communication
    for ( var colorName in colors ) {
      this.reportColor( colorName );
    }
  }

  return inherit( PropertySet, ColorProfile, {

    // sends iframe communication to report the current color for the key name
    reportColor: function( key ) {
      var hexColor = this[ key ].toNumber().toString( 16 );
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
