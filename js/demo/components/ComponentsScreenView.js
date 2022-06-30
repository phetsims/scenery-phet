// Copyright 2014-2022, University of Colorado Boulder

/**
 * Demonstration of misc scenery-phet UI components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import DemosScreenView from '../../../../sun/js/demo/DemosScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetQueryParameters from '../../sceneryPhetQueryParameters.js';
import demoArrowNode from './demoArrowNode.js';
import demoBeakerNode from './demoBeakerNode.js';
import demoBicyclePumpNode from './demoBicyclePumpNode.js';
import demoBracketNode from './demoBracketNode.js';
import demoCapacitorNode from './demoCapacitorNode.js';
import demoComboBoxDisplay from './demoComboBoxDisplay.js';
import demoConductivityTesterNode from './demoConductivityTesterNode.js';
import demoDrawer from './demoDrawer.js';
import demoEyeDropperNode from './demoEyeDropperNode.js';
import demoFaucetNode from './demoFaucetNode.js';
import demoFlowBox from './demoFlowBox.js';
import demoFormulaNode from './demoFormulaNode.js';
import demoGaugeNode from './demoGaugeNode.js';
import demoGrabDragInteraction from './demoGrabDragInteraction.js';
import demoGridBox from './demoGridBox.js';
import demoHandleNode from './demoHandleNode.js';
import demoHeaterCoolerNode from './demoHeaterCoolerNode.js';
import demoKeyboardHelp from './demoKeyboardHelp.js';
import demoKeyNode from './demoKeyNode.js';
import demoKeypad from './demoKeypad.js';
import demoLaserPointerNode from './demoLaserPointerNode.js';
import demoManualConstraint from './demoManualConstraint.js';
import demoMeasuringTapeNode from './demoMeasuringTapeNode.js';
import demoNumberDisplay from './demoNumberDisplay.js';
import demoPaperAirplaneNode from './demoPaperAirplaneNode.js';
import demoProbeNode from './demoProbeNode.js';
import demoRichText from './demoRichText.js';
import demoRulerNode from './demoRulerNode.js';
import demoScientificNotationNode from './demoScientificNotationNode.js';
import demoSpectrumNode from './demoSpectrumNode.js';
import demoSprites from './demoSprites.js';
import demoStarNode from './demoStarNode.js';
import demoStopwatchNode from './demoStopwatchNode.js';
import demoThermometerNode from './demoThermometerNode.js';
import demoTimeControlNode from './demoTimeControlNode.js';
import demoWireNode from './demoWireNode.js';

export default class ComponentsScreenView extends DemosScreenView {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      selectedDemoLabel: sceneryPhetQueryParameters.component,
      tandem: Tandem.REQUIRED
    }, options );

    // To add a demo, add an entry here of type SunDemo.
    const demos = [
      { label: 'ArrowNode', createNode: demoArrowNode },
      { label: 'BeakerNode', createNode: demoBeakerNode },
      { label: 'BicyclePumpNode', createNode: demoBicyclePumpNode },
      { label: 'BracketNode', createNode: demoBracketNode },
      { label: 'CapacitorNode', createNode: demoCapacitorNode },
      { label: 'ComboBoxDisplay', createNode: demoComboBoxDisplay },
      { label: 'ConductivityTesterNode', createNode: demoConductivityTesterNode },
      { label: 'Drawer', createNode: demoDrawer },
      { label: 'EyeDropperNode', createNode: demoEyeDropperNode },
      { label: 'FaucetNode', createNode: demoFaucetNode },
      { label: 'FlowBox', createNode: demoFlowBox },
      { label: 'FormulaNode', createNode: demoFormulaNode },
      { label: 'GaugeNode', createNode: demoGaugeNode },
      { label: 'GridBox', createNode: demoGridBox },
      { label: 'GrabDragInteraction', createNode: demoGrabDragInteraction },
      { label: 'HandleNode', createNode: demoHandleNode },
      { label: 'HeaterCoolerNode', createNode: demoHeaterCoolerNode },
      { label: 'KeyNode', createNode: demoKeyNode },
      { label: 'KeyboardHelp', createNode: demoKeyboardHelp },
      { label: 'Keypad', createNode: demoKeypad },
      { label: 'LaserPointerNode', createNode: demoLaserPointerNode },
      { label: 'ManualConstraint', createNode: demoManualConstraint },
      { label: 'MeasuringTapeNode', createNode: demoMeasuringTapeNode },
      { label: 'NumberDisplay', createNode: demoNumberDisplay },
      { label: 'PaperAirplaneNode', createNode: demoPaperAirplaneNode },
      { label: 'ProbeNode', createNode: demoProbeNode },
      { label: 'RichText', createNode: demoRichText },
      { label: 'RulerNode', createNode: demoRulerNode },
      { label: 'ScientificNotationNode', createNode: demoScientificNotationNode },
      { label: 'SpectrumNode', createNode: demoSpectrumNode },
      { label: 'Sprites', createNode: demoSprites },
      { label: 'StarNode', createNode: demoStarNode },
      { label: 'StopwatchNode', createNode: demoStopwatchNode },
      { label: 'ThermometerNode', createNode: demoThermometerNode },
      { label: 'TimeControlNode', createNode: demoTimeControlNode },
      { label: 'WireNode', createNode: demoWireNode }
    ];

    super( demos, options );
  }
}

sceneryPhet.register( 'ComponentsScreenView', ComponentsScreenView );