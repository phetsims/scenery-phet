// Copyright 2019-2022, University of Colorado Boulder

/**
 * Displays a fraction based on a numerator/denominator Property pair.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import EnumerationDeprecated from '../../phet-core/js/EnumerationDeprecated.js';
import merge from '../../phet-core/js/merge.js';
import MixedFractionNode from './MixedFractionNode.js';
import sceneryPhet from './sceneryPhet.js';

class PropertyFractionNode extends MixedFractionNode {
  /**
   * @param {Property.<number>} numeratorProperty
   * @param {Property.<number>} denominatorProperty
   * @param {Object} [options]
   */
  constructor( numeratorProperty, denominatorProperty, options ) {
    options = merge( {
      // {PropertyFractionNode.DisplayType}
      type: PropertyFractionNode.DisplayType.IMPROPER,

      // {boolean}
      simplify: false,

      // {boolean}
      showZeroImproperFraction: true
    }, options );

    assert && assert( PropertyFractionNode.DisplayType.includes( options.type ) );
    assert && assert( typeof options.simplify === 'boolean' );

    super( options );

    // @private {Property.<number>}
    this.numeratorProperty = numeratorProperty;
    this.denominatorProperty = denominatorProperty;

    // @private {function}
    this.propertyListener = this.updateFromProperties.bind( this );

    // @private {PropertyFractionNode.DisplayType}
    this.type = options.type;

    // @private {boolean}
    this.simplify = options.simplify;
    this.showZeroImproperFraction = options.showZeroImproperFraction;

    this.numeratorProperty.lazyLink( this.propertyListener );
    this.denominatorProperty.lazyLink( this.propertyListener );
    this.updateFromProperties();
  }

  /**
   * Updates our display based on our Property values.
   * @private
   */
  updateFromProperties() {
    const numerator = this.numeratorProperty.value;
    const denominator = this.denominatorProperty.value;

    const hasWhole = this.type === PropertyFractionNode.DisplayType.IMPROPER || !this.simplify || numerator === 0 || numerator >= denominator;
    const hasFraction = this.type === PropertyFractionNode.DisplayType.IMPROPER || !this.simplify || ( this.showZeroImproperFraction ? numerator > 0 : ( numerator % denominator !== 0 ) );

    this.denominator = hasFraction ? denominator : null;

    if ( this.type === PropertyFractionNode.DisplayType.MIXED ) {
      this.whole = hasWhole ? Math.floor( numerator / denominator ) : null;
      this.numerator = hasFraction ? ( numerator % denominator ) : null;
    }
    else {
      this.numerator = numerator;
    }
  }

  /**
   * Releases references.
   * @public
   * @override
   */
  dispose() {
    this.numeratorProperty.unlink( this.propertyListener );
    this.denominatorProperty.unlink( this.propertyListener );

    super.dispose();
  }
}

// @public {EnumerationDeprecated}
PropertyFractionNode.DisplayType = EnumerationDeprecated.byKeys( [
  'IMPROPER', // e.g. 3/2
  'MIXED' // e.g. 1 1/2
] );

sceneryPhet.register( 'PropertyFractionNode', PropertyFractionNode );
export default PropertyFractionNode;