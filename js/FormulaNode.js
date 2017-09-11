// Copyright 2015-2017, University of Colorado Boulder

/**
 * Displays a LaTeX-style mathematical formula with KaTeX.
 *
 * IMPORTANT: Using this will require including the KaTeX preloads, and may require generation of a custom bundle for
 * the simulation. Currently two preloads will be needed, one for the CSS/font-files, and one for the JS, e.g.:
 * - katex-0.5.1-css-all.js
 * - katex-0.5.1.min.js
 *
 * IMPORTANT: See packageKatexCSS.js for more information, particularly about generating a particular customized preload
 * file that includes only the font-files needed.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DOM = require( 'SCENERY/nodes/DOM' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @constructor
   * @param {string} formula - LaTeX-style string, assumed to be in math mode
   * @param {Object} [options]
   */
  function FormulaNode( formula, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      // Defaults
      displayMode: true // If false, it will render with the 'inline math' mode which is vertically constrained more.
    }, options );

    // @private
    this._span = document.createElement( 'span' );

    // @private - Store these initially, so we can update the formula before mutating.
    this._formula = formula; // {string}
    this._displayMode = options.displayMode; // {boolean}

    DOM.call( this, this._span );

    this.updateFormula();

    this.mutate( options );
  }

  sceneryPhet.register( 'FormulaNode', FormulaNode );

  inherit( DOM, FormulaNode, {
    // @override - We need to have a fairly custom bounds measurement method, since it's a block-level element
    calculateDOMBounds: function() {
      // Grab a particular child node for measurement, since it's an inline element and contains everything graphical.
      var htmlList = this._span.getElementsByClassName( 'katex-html' );

      // Empty if we have no formula yet
      if ( htmlList.length === 0 ) {
        return Bounds2.NOTHING.copy();
      }

      // Our element from the list
      var element = htmlList[ 0 ];

      // offsetLeft is always 0 once in place, and this seems like the best way to measure the change both before AND
      // after it's been added to the DOM.
      return Bounds2.rect( 0, element.offsetTop, element.offsetWidth, element.offsetHeight );
    },

    /**
     * Updates the formula to display. It should be a string, formatted with the general LaTeX style. Particular
     * function support is available at https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX.
     * @public
     *
     * @param {string} formula - The particular formula to display.
     */
    setFormula: function( formula ) {
      assert && assert( typeof formula === 'string' );

      if ( formula !== this._formula ) {
        this._formula = formula;
        this.updateFormula();
      }

      return this;
    },
    set formula( value ) { return this.setFormula( value ); },

    /**
     * @returns {string} - The string for the formula that is currently displayed.
     */
    getFormula: function() {
      return this._formula;
    },
    get formula() { return this.getFormula(); },

    /**
     * Updates the {boolean} display mode.
     *
     * If true, the formula will be displayed in the display-mode ($$ in LaTeX) style, which is typically separated from
     * other text, and on its own line.
     *
     * If false, the formula will be displayed in the 'inline math' ($ in LaTeX) style, which is typically
     * meant to be embedded within flowed text.
     *
     * @param {boolean} mode
     */
    setDisplayMode: function( mode ) {
      assert && assert( typeof mode === 'boolean' );

      if ( mode !== this._displayMode ) {
        this._displayMode = mode;

        this.updateFormula();
      }

      return this;
    },
    set displayMode( value ) { return this.setDisplayMode( value ); },

    /**
     * @returns {boolean} - Whether the displayMode is currently true.
     */
    getDisplayMode: function() {
      return this._displayMode;
    },
    get displayMode() { return this.getDisplayMode(); },

    // @private - Updates the displayed formula and its bounds.
    updateFormula: function() {
      katex.render( this._formula, this._span, {
        displayMode: this._displayMode
      } );

      // recompute bounds
      this.invalidateDOM();
    }
  } );

  // Allow the mutate() call to change displayMode and formula.
  FormulaNode.prototype._mutatorKeys = [ 'displayMode', 'formula' ].concat( DOM.prototype._mutatorKeys );

  return FormulaNode;
} );
