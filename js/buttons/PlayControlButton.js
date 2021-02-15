// Copyright 2021, University of Colorado Boulder

/**
 * A round toggle button that displays some custom icon when playing and a triangular "Play" icon when not playing.
 *
 * @author Sam Reid
 * @author Jesse Greenberg
 */

import merge from '../../../phet-core/js/merge.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Path from '../../../scenery/js/nodes/Path.js';
import BooleanRoundToggleButton from '../../../sun/js/buttons/BooleanRoundToggleButton.js';
import PlayIconShape from '../PlayIconShape.js';
import sceneryPhet from '../sceneryPhet.js';

class PlayControlButton extends BooleanRoundToggleButton {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Node} stopIcon - icon for when isPlayingProperty value is true
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, stopIcon, options ) {
    options = merge( {

      // {number}
      radius: 28,

      // It's dimensions are calculated dynamically based on radius below to make sure the play and pause buttons are
      // in sync.
      xMargin: 0,
      yMargin: 0
    }, options );

    // play and pause icons are sized relative to the radius
    const playHeight = options.radius;
    const playWidth = options.radius * 0.8;
    const playPath = new Path( new PlayIconShape( playWidth, playHeight ), { fill: 'black' } );

    // put the play and stop symbols inside circles so they have the same bounds,
    // otherwise BooleanToggleNode will re-adjust their positions relative to each other
    const playCircle = new Circle( options.radius );
    playPath.centerX = options.radius * 0.05; // move to right slightly since we don't want it exactly centered
    playPath.centerY = 0;
    playCircle.addChild( playPath );

    const stopCircle = new Circle( options.radius );
    stopIcon.centerX = 0;
    stopIcon.centerY = 0;
    stopCircle.addChild( stopIcon );

    super( stopCircle, playCircle, isPlayingProperty, options );
  }
}

sceneryPhet.register( 'PlayControlButton', PlayControlButton );
export default PlayControlButton;