// Copyright 2022, University of Colorado Boulder

/**
 * In every screen, the question bar at the top provides a framing question and context.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import StatusBar, { StatusBarOptions } from '../../../../vegas/js/StatusBar.js';
import { Text } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

type SelfOptions = {
  labelText: string
};
export type QuestionBarOptions = SelfOptions & Omit<StatusBarOptions, 'floatToTop'>

class QuestionBar extends StatusBar {

  constructor( layoutBounds: Bounds2, boundsProperty: Property<Bounds2>, providedOptions: QuestionBarOptions ) {

    const options = optionize<QuestionBarOptions, {}>( {
      floatToTop: true,
      barHeight: 70
    }, providedOptions );
    super( layoutBounds, boundsProperty, options );

    const labelText = new Text( options.labelText, {
      font: new PhetFont( {
        weight: 'bold',
        size: '23px'
      } )
    } );
    this.addChild( labelText );

    this.positioningBoundsProperty.link( bounds2 => {
      labelText.centerY = bounds2.centerY;
      labelText.left = 30;
    } );
  }
}

centerAndSpread.register( 'QuestionBar', QuestionBar );
export default QuestionBar;