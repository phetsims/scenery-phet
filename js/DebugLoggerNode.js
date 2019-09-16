// Copyright 2019, University of Colorado Boulder

/**
 * DebugLoggerNode is a node that can be added as a child to the view and can show debug log messages.  This is most
 * often used when a console is not available, such as when debugging on iPads or other tablets.
 *
 * Typically, an instance of this is created and made global for use on a given screen.  Example:
 *   phet.debugLoggerNode = new DebugLogger;
 *   this.addChild( phet.debugLoggerNode );
 *
 * ...and then logging is accomplished by calling the logger like this:
 *   phet.debugLoggerNode.log( 'my insightful message' );
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const DEFAULT_NUM_MESSAGES = 4;
  const DEFAULT_POSITION = new Vector2( 20, 20 );
  const DEFAULT_FONT = new PhetFont( 20 );
  const DEFAULT_TEXT_COLOR = Color.red;

  class DebugLoggerNode extends RichText {

    /**
     * @param {Object} [options]
     * @constructor
     */
    constructor( options ) {

      options = _.extend( {
        left: DEFAULT_POSITION.x,
        top: DEFAULT_POSITION.y,
        numMessagesToDisplay: DEFAULT_NUM_MESSAGES,
        font: DEFAULT_FONT,
        fill: DEFAULT_TEXT_COLOR
      }, options );

      super( '', options );

      this.numMessagesToDisplay = options.numMessagesToDisplay;
      this.messages = [];
    }

    /**
     * log a message
     * @param {String} message
     */
    log( message ) {

      if ( this.messages.length >= this.numMessagesToDisplay ) {

        // remove the oldest message
        this.messages.shift();
      }

      // add the newest message
      this.messages.push( message );

      // munge the messages together and set the value of the text
      this.text = _.reduce( this.messages, ( memo, compositeMessage ) => {
        return memo + '<br>' + compositeMessage;
      } );
    }
  }

  return sceneryPhet.register( 'DebugLoggerNode', DebugLoggerNode );
} );