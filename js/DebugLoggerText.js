// Copyright 2019-2023, University of Colorado Boulder

/**
 * DebugLoggerText is a node that can be added as a child to the view and can show debug log messages.
 * This is most often used when a console is not available, such as when debugging on iPads or other tablets.
 *
 * Typically, an instance of this is created and made global for use on a given screen.  Example:
 *   phet.debugLoggerNode = new DebugLoggerText();
 *   this.addChild( phet.debugLoggerNode );
 *
 * ...and then logging is accomplished by calling the logger like this:
 *   phet.debugLoggerNode.log( 'my insightful message' );
 *
 * Tip from MK - start by putting the above line in assert.js
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import merge from '../../phet-core/js/merge.js';
import { Color, RichText } from '../../scenery/js/imports.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_NUM_MESSAGES = 4;
const DEFAULT_POSITION = new Vector2( 20, 20 );
const DEFAULT_FONT = new PhetFont( 20 );
const DEFAULT_TEXT_COLOR = Color.red;

class DebugLoggerText extends RichText {

  /**
   * @param {Object} [options]
   * @constructor
   */
  constructor( options ) {

    options = merge( {
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
   * @param {string} message
   * @public
   */
  log( message ) {

    if ( this.messages.length >= this.numMessagesToDisplay ) {

      // remove the oldest message
      this.messages.pop();
    }

    // add the newest message
    this.messages.unshift( message );

    // munge the messages together and set the value of the text
    this.string = _.reduce( this.messages, ( memo, compositeMessage ) => {
      return `${memo}<br>${compositeMessage}`;
    } );
  }
}

sceneryPhet.register( 'DebugLoggerText', DebugLoggerText );
export default DebugLoggerText;