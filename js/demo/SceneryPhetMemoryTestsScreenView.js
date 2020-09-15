// Copyright 2020, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import MemoryTestsScreenView from '../../../sun/js/demo/MemoryTestsScreenView.js';
import TimerToggleButton from '../buttons/TimerToggleButton.js';
import sceneryPhet from '../sceneryPhet.js';

class SceneryPhetMemoryTestsScreenView extends MemoryTestsScreenView {

  constructor() {
    super( {
      iterationsPerStep: 100
    } );
  }

  /**
   * Creates scenery-phet UI components. Add the components that you want to test here.
   * @returns {Node[]}
   * @protected
   * @override
   */
  createComponents() {
    return [
      new TimerToggleButton( new BooleanProperty( false ) )
    ];
  }
}

sceneryPhet.register( 'SceneryPhetMemoryTestsScreenView', SceneryPhetMemoryTestsScreenView );
export default SceneryPhetMemoryTestsScreenView;