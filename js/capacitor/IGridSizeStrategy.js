// Copyright 2019, University of Colorado Boulder

/**
 * Interface for all strategies used to determine the size of the grid used to cover a 2D surface with objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 *
 * Moved from capacitor-lab-basics/js/common/view/IGridSizeStrategy.js on Oct 7, 2019
 */
define( require => {
  'use strict';

  // modules
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Util = require( 'DOT/Util' );

  function IGridSizeStrategy() {}

  sceneryPhet.register( 'IGridSizeStrategy', IGridSizeStrategy );

  inherit( Object, IGridSizeStrategy, {

    /**
     * Gets the size of the grid.
     * The number of cells in the grid may be more or less than numberOfObjects.
     * @private
     *
     * @param {number} numberOfObjects number of objects to put on the plate
     * @param {number}width width of the plate
     * @param {number}height height of the plate
     */
    getGridSize: function( numberOfObjects, width, height ) {
      assert && assert( false, 'getGridSize should be overridden by descendant classes.' );
    }
  }, {
    /**
     * This factory determines the strategy used throughout the application.
     * @public
     */
    createStrategy: function() { return new CCKStrategyWithRounding(); }
  } );

  /**
   * Strategy developed by Sam Reid, here's how he described it:
   * The main change is to use rounding instead of clamping to get the rows and columns.
   * Also, for one row or column, it should be exact (similar to the intent of the ModifiedCCKGridSizeStrategy subclass).
   * It looks like it exhibits better (though understandably imperfect) behavior in the problem cases.
   * Also, as opposed to the previous versions, the visible number of objects can exceed the specified numberOfObjects.
   * This may be the best we can do if we are showing a rectangular grid of charges.  We could get the count exactly
   * right if we show some (or one) of the columns having different numbers of charges than the others, but then
   * it may look nonuniform (and would require more extensive changes to the sim).
   *
   * @author Sam Reid (PhET Interactive Simulations)
   */
  function CCKStrategyWithRounding() {}

  sceneryPhet.register( 'CCKStrategyWithRounding', CCKStrategyWithRounding );

  inherit( Object, CCKStrategyWithRounding, {
    /**
     * @private
     *
     * @param {number} numberOfObjects [description]
     * @param {number} width
     * @param {number} height
     * @returns {Dimension2}
     */
    getGridSize: function( numberOfObjects, width, height ) {
      let columns = 0;
      let rows = 0;
      if ( numberOfObjects > 0 ) {

        const alpha = Math.sqrt( numberOfObjects / width / height );
        columns = Util.roundSymmetric( width * alpha );

        // compute rows 2 ways, choose the best fit
        const rows1 = Util.roundSymmetric( height * alpha );
        const rows2 = Util.roundSymmetric( numberOfObjects / columns );
        if ( rows1 !== rows2 ) {
          const error1 = Math.abs( numberOfObjects - ( rows1 * columns ) );
          const error2 = Math.abs( numberOfObjects - ( rows2 * columns ) );
          rows = ( error1 < error2 ) ? rows1 : rows2;
        }
        else {
          rows = rows1;
        }

        // handle boundary cases
        if ( columns === 0 ) {
          columns = 1;
          rows = numberOfObjects;
        }
        else if ( rows === 0 ) {
          rows = 1;
          columns = numberOfObjects;
        }
      }
      assert && assert( columns >= 0 && rows >= 0, 'There must be at least 1 column or 1 row of charges.' );
      return new Dimension2( columns, rows );
    }
  } );

  return IGridSizeStrategy;

} );
