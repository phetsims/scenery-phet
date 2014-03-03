// Copyright 2002-2014, University of Colorado Boulder

/**
 * Renders text that contains subscripts and superscripts.
 * This was created to render chemical formulas (e.g. 'H<sub>3</sub>O<sup>+</sup>') but will undoubtedly have other uses.
 * Text must be provided in HTML format, and may contain only plaintext, <sub> and <sup>.
 * Each <sub> and <sup> tag must be preceded by plaintext, and nesting of tags is not supported.
 * This node's y position will be at the text's baseline.
 * <p>
 * Beware of using this for situations where the text changes frequently.
 * The implementation relies on jQuery to parse the HTML, and this has not been profiled.
 * More significantly, since the HTML string is general, changing it requires rebuilding the node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  function SubSupText( text, options ) {

    // defaults
    options = _.extend( {
      // all text
      fill: 'black',
      font: new PhetFont( 20 ),
      // plain text
      textXSpacing: 2, // space between plain text and whatever precedes it
      // subscripts
      subScale: 0.75, // scale of subscript relative to plain text
      subXSpacing: 2, // space between subscript and whatever precedes it
      subYOffset: 0, // offset of subscript's center from baseline
      // superscripts
      supScale: 0.75, // scale of superscript relative to plain text
      supXSpacing: 2, // space between superscript and whatever precedes it
      supYOffset: 5 // offset of superscript's center from cap line, default is non-zero because of Text height inaccuracies
    }, options );

    // scenery.Text properties with setters and getters
    this._text = text; // @private
    this._options = options; // @private

    // compute cap line offset from baseline, must be recomputed if font changes!
    var tmpText = new Text( 'X', { font: options.font } );
    this._capLineYOffset = ( tmpText.top - tmpText.y ); // @private

    Node.call( this );

    // Single parent for all Text nodes, so that we can change properties without affecting children added by clients.
    this._textParent = new Node(); // @private
    this.addChild( this._textParent );

    this.update();

    this.mutate( options );
  }

  return inherit( Node, SubSupText, {

    /*
     * @private
     * @throws Error if the text doesn't follow the constraints defines in the JSdoc above
     */
    update: function() {

      var thisNode = this;
      var options = thisNode._options;

      thisNode._textParent.removeAllChildren();

      var node, previousNode, previousNodeType;
      $( $.parseHTML( thisNode._text ) ).each( function( index, element ) {
        if ( element.nodeType === 3 ) {
          // Text
          node = new Text( element.nodeValue, { font: options.font, fill: options.fill } );
          thisNode._textParent.addChild( node );
          if ( previousNode ) {
            node.left = previousNode.right + options.textXSpacing;
          }
        }
        else if ( element.nodeType === 1 ) {
          // Element
          if ( previousNodeType !== 3 ) {
            throw new Error( 'sub or sup element must be preceded by text' );
          }

          if ( element.tagName === 'SUB' ) { // HTML spec says that element names are uppercase
            node = new Text( element.innerHTML, { font: options.font, fill: options.fill, scale: options.subScale } );
            thisNode._textParent.addChild( node );
            node.left = previousNode.right + options.subXSpacing;
            node.centerY = previousNode.y + options.subYOffset; // center on baseline
          }
          else if ( element.tagName === 'SUP' ) { // HTML spec says that element names are uppercase
            node = new Text( element.innerHTML, { font: options.font, fill: options.fill, scale: options.supScale } );
            thisNode._textParent.addChild( node );
            node.left = previousNode.right + options.supXSpacing;
            node.centerY = previousNode.y + thisNode._capLineYOffset + options.supYOffset; // center on cap line
          }
          else {
            throw new Error( 'unsupported tagName: ' + element.tagName );
          }
        }
        else {
          throw new Error( 'unsupported nodeType: ' + element.nodeType );
        }
        previousNode = node;
        previousNodeType = element.nodeType;
      } );
    },

    // text ----------------------------------------------------------

    setText: function( text ) {
      this._text = text;
      this.update();
    },

    getText: function() { return this._text; },

    // ES5
    set text( value ) { this.setText( value ); },
    get text() { return this.getText(); },

    // fill ----------------------------------------------------------

    setFill: function( fill ) {
      this._options.fill = fill;
      var childrenCount = this._textParent.getChildrenCount();
      for ( var i = 0; i < childrenCount; i++ ) {
        this._textParent.getChildAt( i ).fill = fill;
      }
    },

    getFill: function() { return this._fill; },

    // ES5
    set fill( value ) { this.setFill( value ); },
    get fill() { return this.getFill(); }

    //TODO add setters and getters for other scenery.Text properties as needed
  } );
} );
