// Copyright 2022, University of Colorado Boulder

/**
 * In every screen, the question bar at the top provides a framing question and context.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import sceneryPhet from './sceneryPhet.js';
import StatusBar, { StatusBarOptions } from '../../scenery-phet/js/StatusBar.js';
import { Text } from '../../scenery/js/imports.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import Tandem from '../../tandem/js/Tandem.js';
import IProperty from '../../axon/js/IProperty.js';

type SelfOptions = {
  labelText: string;
};
export type QuestionBarOptions = SelfOptions & StrictOmit<StatusBarOptions, 'floatToTop'>;

const QUESTION_TEXT_MARGIN = 30;

class QuestionBar extends StatusBar {

  public constructor( layoutBounds: Bounds2, visibleBoundsProperty: IProperty<Bounds2>, providedOptions: QuestionBarOptions ) {

    const options = optionize<QuestionBarOptions, SelfOptions, StatusBarOptions>()( {
      floatToTop: true,
      barHeight: 70,
      tandem: Tandem.OPTIONAL
    }, providedOptions );
    super( layoutBounds, visibleBoundsProperty, options );

    const labelText = new Text( options.labelText, {
      font: new PhetFont( {
        weight: 'bold',
        size: '23px'
      } ),
      maxWidth: layoutBounds.width - QUESTION_TEXT_MARGIN * 2,
      tandem: options.tandem.createTandem( 'labelText' )
    } );
    this.addChild( labelText );

    this.positioningBoundsProperty.link( bounds2 => {
      labelText.centerY = bounds2.centerY;
      labelText.left = QUESTION_TEXT_MARGIN;
    } );
  }
}

sceneryPhet.register( 'QuestionBar', QuestionBar );
export default QuestionBar;