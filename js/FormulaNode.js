// Copyright 2015-2020, University of Colorado Boulder

/**
 * Displays a LaTeX-style mathematical formula with KaTeX.
 *
 * IMPORTANT: Using this will require including the KaTeX preloads, and may require generation of a custom bundle for
 * the simulation. Currently two preloads will be needed, one for the CSS/font-files, and one for the JS, e.g.:
 * - katex-0.11.0-css-all.js
 * - katex-0.11.0.min.js
 *
 * IMPORTANT: See packageKatexCSS.js for more information, particularly about generating a particular customized preload
 * file that includes only the font-files needed.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Saurabh Totey
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import DOM from '../../scenery/js/nodes/DOM.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @constructor
 * @param {string} formula - LaTeX-style string, assumed to be in math mode
 * @param {Object} [options]
 */
function FormulaNode( formula, options ) {
  options = merge( {
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

  /**
   * @override - We need to have a fairly custom bounds measurement method, since it's a block-level element
   * @returns {Bounds2}
   */
  calculateDOMBounds: function() {
    // Grab a particular child node for measurement, since it's an inline element and contains everything graphical.
    const htmlList = this._span.getElementsByClassName( 'katex-html' );

    // Empty if we have no formula yet
    if ( htmlList.length === 0 ) {
      return Bounds2.NOTHING.copy();
    }

    // Our element from the list
    const element = htmlList[ 0 ];

    // offsetLeft is always 0 once in place, and this seems like the best way to measure the change both before AND
    // after it's been added to the DOM.
    return Bounds2.rect( 0, element.offsetTop, element.offsetWidth, element.offsetHeight );
  },

  /**
   * @override - FormulaNode needs this override in order to render formulas correctly
   *  in DOM's invalidateDOM method, the temporaryContainer is given a size
   *  temporaryContainer having a size affects the size of the formula and renders calculateDOMBounds useless
   *  this method is almost the same as the one it overrides,
   *  but it just removes temporaryContainer's size so that calculateDOMBounds can work and this can render correctly
   */
  invalidateDOM: function() {
    // prevent this from being executed as a side-effect from inside one of its own calls
    if ( this.invalidateDOMLock ) {
      return;
    }
    this.invalidateDOMLock = true;

    // we will place ourselves in a temporary container to get our real desired bounds
    const temporaryContainer = document.createElement( 'div' );
    $( temporaryContainer ).css( {
      display: 'hidden',
      padding: '0 !important',
      margin: '0 !important',
      position: 'absolute',
      left: 0,
      top: 0
    } );

    // move to the temporary container
    this._container.removeChild( this._element );
    temporaryContainer.appendChild( this._element );
    document.body.appendChild( temporaryContainer );

    // bounds computation and resize our container to fit precisely
    const selfBounds = this.calculateDOMBounds();
    this.invalidateSelf( selfBounds );
    this._$container.width( selfBounds.getWidth() );
    this._$container.height( selfBounds.getHeight() );

    // move back to the main container
    document.body.removeChild( temporaryContainer );
    temporaryContainer.removeChild( this._element );
    this._container.appendChild( this._element );

    // unlock
    this.invalidateDOMLock = false;
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
      displayMode: this._displayMode,
      strict: errorCode => {
        if ( _.includes( [ 'unknownSymbol', 'unicodeTextInMathMode' ], errorCode ) ) {
          return 'ignore';
        }
        return 'error';
      }
    } );

    // recompute bounds
    this.invalidateDOM();
  }
} );

// Allow the mutate() call to change displayMode and formula.
FormulaNode.prototype._mutatorKeys = [ 'displayMode', 'formula' ].concat( DOM.prototype._mutatorKeys );

export default FormulaNode;