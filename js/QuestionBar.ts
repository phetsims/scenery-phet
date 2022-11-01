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
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../axon/js/Multilink.js';

type SelfOptions = {
  questionString: string | TReadOnlyProperty<string>;
};
export type QuestionBarOptions = SelfOptions & StrictOmit<StatusBarOptions, 'floatToTop'>;

const QUESTION_TEXT_MARGIN = 30;

export default class QuestionBar extends StatusBar {

  private readonly disposeQuestionBar: () => void;

  public constructor( layoutBounds: Bounds2, visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions?: QuestionBarOptions ) {

    const options = optionize<QuestionBarOptions, SelfOptions, StatusBarOptions>()( {
      floatToTop: true,
      barHeight: 70,
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    super( layoutBounds, visibleBoundsProperty, options );

    const questionText = new Text( options.questionString, {
      font: new PhetFont( {
        weight: 'bold',
        size: '23px'
      } ),
      maxWidth: layoutBounds.width - QUESTION_TEXT_MARGIN * 2,
      tandem: options.tandem.createTandem( 'questionText' )
    } );

    this.addChild( questionText );

    Multilink.multilink( [ questionText.localBoundsProperty, this.positioningBoundsProperty ], ( localBounds, positioningBounds ) => {
      questionText.centerY = positioningBounds.centerY;
      questionText.left = QUESTION_TEXT_MARGIN;
    } );

    this.disposeQuestionBar = () => {
      questionText.dispose(); // may be linked to a string Property
    };
  }

  public override dispose(): void {
    this.disposeQuestionBar();
    super.dispose();
  }
}

sceneryPhet.register( 'QuestionBar', QuestionBar );