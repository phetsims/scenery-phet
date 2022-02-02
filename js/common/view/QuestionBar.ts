// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import centerAndSpread from '../../centerAndSpread.js';
import StatusBar from '../../../../vegas/js/StatusBar.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';

type QuestionBarSelfOptions = {};
type StatusBarOptions = {}; // TODO: Add Options in StatusBar
export type QuestionBarOptions = QuestionBarSelfOptions & Omit<StatusBarOptions, 'floatToTop'>

class QuestionBar extends StatusBar {

  constructor( layoutBounds: Bounds2, boundsProperty: Property<Bounds2>, providedOptions: QuestionBarOptions ) {

    const options = optionize<QuestionBarOptions>( {
      floatToTop: true
    }, providedOptions );
    super( layoutBounds, boundsProperty, options );
  }
}

centerAndSpread.register( 'QuestionBar', QuestionBar );
export default QuestionBar;