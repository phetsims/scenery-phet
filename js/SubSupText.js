// Copyright 2014-2016, University of Colorado Boulder

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

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  /**
   *
   * @param {string} text
   * @param {Object} [options]
   * @constructor
   */
  function SubSupText( text, options ) {

    // defaults
    options = _.extend( {
      // all text
      fill: 'black',
      font: new PhetFont( 20 ),
      // plain text
      textXSpacing: 0, // space between plain text and whatever precedes it
      // subscripts
      subScale: 0.75, // scale of subscript relative to plain text
      subXSpacing: 0, // space between subscript and whatever precedes it
      subYOffset: 0, // offset of subscript's center from baseline
      // superscripts
      supScale: 0.75, // scale of superscript relative to plain text
      supXSpacing: 0, // space between superscript and whatever precedes it
      supYOffset: 0, // offset of superscript's center from cap line
      capHeightScale: 0.75 // fudge factor for computing cap height, compensates for inaccuracy of Text.height
    }, options );

    // scenery.Text properties with setters and getters
    this._text = text; // @private
    this._options = options; // @private

    // compute cap line offset from baseline, must be recomputed if font changes!
    var tmpText = new Text( 'X', { font: options.font } );
    this._capLineYOffset = options.capHeightScale * ( tmpText.top - tmpText.y ); // @private

    Node.call( this );

    // Single parent for all Text nodes, so that we can change properties without affecting children added by clients.
    this._textParent = new Node(); // @private
    this.addChild( this._textParent );

    this.update();

    this.mutate( options );
  }

  sceneryPhet.register( 'SubSupText', SubSupText );

  return inherit( Node, SubSupText, {

    /*
     * @private
     * @throws Error if the text doesn't follow the constraints defines in the JSdoc above
     */
    update: function() {
      var text = this._text;
      var options = this._options;

      /*---------------------------------------------------------------------------*
       * Parsing the text into slices
       *
       * E.g. if we have a string (with embedding marks represented by LTR, RTL, POP):
       * RTL + 'Molecule: ' + LTR + 'Na<sub>2</sub>O' + POP + POP
       *
       * Then we will result in an array of slices:
       *
       * [
       *   { mode: 'normal', string: RTL + 'Molecule: ' + LTR + 'Na' + POP + POP },
       *   { mode: 'sub', string: RTL + LTR + '2' + POP + POP },
       *   { mode: 'normal', string: RTL + LTR + 'O' + POP + POP }
       * ]
       *
       * See https://github.com/phetsims/scenery-phet/issues/207 for details on the embedding mark handling.
       *---------------------------------------------------------------------------*/

      var regex = /<\/?[^>]+>/g; // Regular expression that will identify start and end tags
      var match; // {string} - Matched string with an index, from regex.exec( string ). Also has .index property.
      var index = 0;
      var mode = 'normal'; // 'normal', 'sub', 'sup' - Current "mode", nesting not supported
      var slices = []; // {Array.<{ mode: 'normal'|'sub'|'sup', string: {string} }>} - Strings tagged with sub/sup info

      // Pushes a string slice (tagged with the current sub/sup mode) to the slices array.
      function addSlice( startIndex, endIndex ) {
        // Ignore empty strings
        if ( endIndex > startIndex ) {
          slices.push( {
            mode: mode,

            // Use embeddedSlice so that embedding marks are added to keep the directions the same.
            // See https://github.com/phetsims/scenery-phet/issues/207
            string: StringUtils.embeddedSlice( text, startIndex, endIndex )
          } );
        }
      }

      // Iterate through regex matches. The match will be the full string of the tag, like '</sub>', and will have the
      // index of the match in the string.
      while ( ( match = regex.exec( text ) ) !== null ) {
        var matchString = match[ 0 ]; // e.g. '</sub>'
        var matchIndex = match.index;

        // If we have remaining text before this tag, add it as a slice
        addSlice( index, matchIndex );
        index = matchIndex + matchString.length;

        // Change modes, with assertions to ensure we have the expected tag values
        if ( mode === 'normal' ) {
          assert && assert( matchString === '<sub>' || matchString === '<sup>',
            'Unexpected tag in normal mode: ' + matchString );

          if ( matchString === '<sub>' ) {
            mode = 'sub';
          }
          else if ( matchString === '<sup>' ) {
            mode = 'sup';
          }
          else {
            // Break out and stop parsing tags, see https://github.com/phetsims/scenery/issues/528.
            // Would have happened after assertion failure
            break;
          }
        }
        else if ( mode === 'sub' ) {
          assert && assert( matchString === '</sub>',
            'Unexpected tag in sub mode: ' + matchString );

          mode = 'normal';

          if ( matchString !== '</sub>' ) {
            // Break out and stop parsing tags, see https://github.com/phetsims/scenery/issues/528.
            // Would have happened after assertion failure
            break;
          }
        }
        else if ( mode === 'sup' ) {
          assert && assert( matchString === '</sup>',
            'Unexpected tag in sup mode: ' + matchString );

          mode = 'normal';

          if ( matchString !== '</sup>' ) {
            // Break out and stop parsing tags, see https://github.com/phetsims/scenery/issues/528.
            // Would have happened after assertion failure
            break;
          }
        }
      }

      // At the end, add a slice for any text that's between the last tag and the end of the string
      addSlice( index, text.length );

      /*---------------------------------------------------------------------------*
       * Node construction
       *---------------------------------------------------------------------------*/

      // For non-normal slices, what their centerY and centerX values should be set to.
      var centerYs = {
        sub: options.subYOffset,
        sup: this._capLineYOffset + options.supYOffset
      };

      var centerXs = {
        sub: options.subXSpacing,
        sup: options.supXSpacing
      };

      // What slices scale should be set to.
      var scales = {
        normal: 1,
        sub: options.subScale,
        sup: options.supScale
      };

      this._textParent.removeAllChildren();

      var previousSlice;
      for ( var i = 0; i < slices.length; i++ ) {
        var slice = slices[ i ];
        var node = new Text( slice.string, {
          font: options.font,
          fill: options.fill,
          scale: scales[ slice.mode ],
          left: previousSlice ? previousSlice.node.right + options.textXSpacing : 0
        } );
        if ( slice.mode !== 'normal' ) {
          node.centerY = centerYs[ slice.mode ];
          node.left = previousSlice.node.right + centerXs[ slice.mode ];
        }
        slice.node = node;
        this._textParent.addChild( node );
        previousSlice = slice;
      }
    },

    // text ----------------------------------------------------------

    // @public
    setText: function( text ) {
      this._text = text;
      this.update();
    },
    set text( value ) { this.setText( value ); },

    // @public
    getText: function() { return this._text; },
    get text() { return this.getText(); },

    // fill ----------------------------------------------------------

    // @public
    setFill: function( fill ) {
      this._options.fill = fill;
      var childrenCount = this._textParent.getChildrenCount();
      for ( var i = 0; i < childrenCount; i++ ) {
        this._textParent.getChildAt( i ).fill = fill;
      }
    },
    set fill( value ) { this.setFill( value ); },

    // @public
    getFill: function() { return this._fill; },
    get fill() { return this.getFill(); }

    //TODO add setters and getters for other scenery.Text properties as needed
  } );
} );
