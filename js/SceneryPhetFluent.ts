// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from scenery-phet-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import type { FluentVariable } from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( SceneryPhetStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'scenery_phet_title', 'scenery-phet.titleStringProperty' );
addToMapIfDefined( 'screen_buttons', 'screen.buttonsStringProperty' );
addToMapIfDefined( 'screen_components', 'screen.componentsStringProperty' );
addToMapIfDefined( 'screen_dialogs', 'screen.dialogsStringProperty' );
addToMapIfDefined( 'screen_keyboard', 'screen.keyboardStringProperty' );
addToMapIfDefined( 'screen_sliders', 'screen.slidersStringProperty' );
addToMapIfDefined( 'screen_spinners', 'screen.spinnersStringProperty' );
addToMapIfDefined( 'units_nm', 'units_nmStringProperty' );
addToMapIfDefined( 'shortCircuit', 'shortCircuitStringProperty' );
addToMapIfDefined( 'heat', 'heatStringProperty' );
addToMapIfDefined( 'cool', 'coolStringProperty' );
addToMapIfDefined( 'key_tab', 'key.tabStringProperty' );
addToMapIfDefined( 'key_shift', 'key.shiftStringProperty' );
addToMapIfDefined( 'key_alt', 'key.altStringProperty' );
addToMapIfDefined( 'key_option', 'key.optionStringProperty' );
addToMapIfDefined( 'key_k', 'key.kStringProperty' );
addToMapIfDefined( 'key_l', 'key.lStringProperty' );
addToMapIfDefined( 'key_capsLock', 'key.capsLockStringProperty' );
addToMapIfDefined( 'key_enter', 'key.enterStringProperty' );
addToMapIfDefined( 'key_backspace', 'key.backspaceStringProperty' );
addToMapIfDefined( 'key_delete', 'key.deleteStringProperty' );
addToMapIfDefined( 'key_space', 'key.spaceStringProperty' );
addToMapIfDefined( 'key_esc', 'key.escStringProperty' );
addToMapIfDefined( 'key_fn', 'key.fnStringProperty' );
addToMapIfDefined( 'key_pageUp', 'key.pageUpStringProperty' );
addToMapIfDefined( 'key_pageDown', 'key.pageDownStringProperty' );
addToMapIfDefined( 'key_home', 'key.homeStringProperty' );
addToMapIfDefined( 'key_end', 'key.endStringProperty' );
addToMapIfDefined( 'key_a', 'key.aStringProperty' );
addToMapIfDefined( 'key_c', 'key.cStringProperty' );
addToMapIfDefined( 'key_d', 'key.dStringProperty' );
addToMapIfDefined( 'key_r', 'key.rStringProperty' );
addToMapIfDefined( 'key_s', 'key.sStringProperty' );
addToMapIfDefined( 'key_w', 'key.wStringProperty' );
addToMapIfDefined( 'key_one', 'key.oneStringProperty' );
addToMapIfDefined( 'key_two', 'key.twoStringProperty' );
addToMapIfDefined( 'key_three', 'key.threeStringProperty' );
addToMapIfDefined( 'key_toGrabOrRelease', 'key.toGrabOrReleaseStringProperty' );
addToMapIfDefined( 'webglWarning_title', 'webglWarning.titleStringProperty' );
addToMapIfDefined( 'webglWarning_body', 'webglWarning.bodyStringProperty' );
addToMapIfDefined( 'webglWarning_contextLossFailure', 'webglWarning.contextLossFailureStringProperty' );
addToMapIfDefined( 'webglWarning_contextLossReload', 'webglWarning.contextLossReloadStringProperty' );
addToMapIfDefined( 'webglWarning_ie11StencilBody', 'webglWarning.ie11StencilBodyStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_sliderControls', 'keyboardHelpDialog.sliderControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_adjustSlider', 'keyboardHelpDialog.adjustSliderStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_spinnerControls', 'keyboardHelpDialog.spinnerControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_adjustInSmallerSteps', 'keyboardHelpDialog.adjustInSmallerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_adjustInLargerSteps', 'keyboardHelpDialog.adjustInLargerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_jumpToMinimum', 'keyboardHelpDialog.jumpToMinimumStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_jumpToMaximum', 'keyboardHelpDialog.jumpToMaximumStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_adjust', 'keyboardHelpDialog.adjustStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_slider', 'keyboardHelpDialog.sliderStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_spinner', 'keyboardHelpDialog.spinnerStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_heatCoolControls', 'keyboardHelpDialog.heatCoolControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_maximumHeat', 'keyboardHelpDialog.maximumHeatStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_maximumCool', 'keyboardHelpDialog.maximumCoolStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_heatCoolOff', 'keyboardHelpDialog.heatCoolOffStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_minimum', 'keyboardHelpDialog.minimumStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_maximum', 'keyboardHelpDialog.maximumStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_generalNavigation', 'keyboardHelpDialog.generalNavigationStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_basicActions', 'keyboardHelpDialog.basicActionsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveToNextItem', 'keyboardHelpDialog.moveToNextItemStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveToPreviousItem', 'keyboardHelpDialog.moveToPreviousItemStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveToNextItemOrGroup', 'keyboardHelpDialog.moveToNextItemOrGroupStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveToPreviousItemOrGroup', 'keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_pressButtons', 'keyboardHelpDialog.pressButtonsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveBetweenItemsInAGroup', 'keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_setValuesInKeypad', 'keyboardHelpDialog.setValuesInKeypadStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_resetAll', 'keyboardHelpDialog.resetAllStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_exitADialog', 'keyboardHelpDialog.exitADialogStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_toggleCheckboxes', 'keyboardHelpDialog.toggleCheckboxesStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_or', 'keyboardHelpDialog.orStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_hyphen', 'keyboardHelpDialog.hyphenStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_comboBox_headingString', 'keyboardHelpDialog.comboBox.headingStringStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_comboBox_closeWithoutChanging', 'keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_comboBox_options', 'keyboardHelpDialog.comboBox.optionsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_comboBox_option', 'keyboardHelpDialog.comboBox.optionStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveDraggableItems', 'keyboardHelpDialog.moveDraggableItemsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_move', 'keyboardHelpDialog.moveStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveSlower', 'keyboardHelpDialog.moveSlowerStringProperty' );
addToMapIfDefined( 'speed_normal', 'speed.normalStringProperty' );
addToMapIfDefined( 'speed_slow', 'speed.slowStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_faucetControls', 'keyboardHelpDialog.faucetControls.faucetControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_adjustFaucetFlow', 'keyboardHelpDialog.faucetControls.adjustFaucetFlowStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_adjustInSmallerSteps', 'keyboardHelpDialog.faucetControls.adjustInSmallerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_adjustInLargerSteps', 'keyboardHelpDialog.faucetControls.adjustInLargerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_closeFaucet', 'keyboardHelpDialog.faucetControls.closeFaucetStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_openFaucetFully', 'keyboardHelpDialog.faucetControls.openFaucetFullyStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_openFaucetBriefly', 'keyboardHelpDialog.faucetControls.openFaucetBrieflyStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_timingControls_timingControls', 'keyboardHelpDialog.timingControls.timingControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_timingControls_pauseOrPlayAction', 'keyboardHelpDialog.timingControls.pauseOrPlayActionStringProperty' );
addToMapIfDefined( 'speed_fast', 'speed.fastStringProperty' );
addToMapIfDefined( 'symbol_ohms', 'symbol.ohmsStringProperty' );
addToMapIfDefined( 'symbol_resistivity', 'symbol.resistivityStringProperty' );
addToMapIfDefined( 'wavelength', 'wavelengthStringProperty' );
addToMapIfDefined( 'rulerCapitalized', 'rulerCapitalizedStringProperty' );
addToMapIfDefined( 'ruler', 'rulerStringProperty' );
addToMapIfDefined( 'zero', 'zeroStringProperty' );
addToMapIfDefined( 'one', 'oneStringProperty' );
addToMapIfDefined( 'two', 'twoStringProperty' );
addToMapIfDefined( 'three', 'threeStringProperty' );
addToMapIfDefined( 'four', 'fourStringProperty' );
addToMapIfDefined( 'five', 'fiveStringProperty' );
addToMapIfDefined( 'six', 'sixStringProperty' );
addToMapIfDefined( 'seven', 'sevenStringProperty' );
addToMapIfDefined( 'eight', 'eightStringProperty' );
addToMapIfDefined( 'nine', 'nineStringProperty' );
addToMapIfDefined( 'ten', 'tenStringProperty' );
addToMapIfDefined( 'offScaleIndicator_pointsOffScale', 'offScaleIndicator.pointsOffScaleStringProperty' );
addToMapIfDefined( 'ResetAllButton_name', 'ResetAllButton.nameStringProperty' );
addToMapIfDefined( 'ResetAllButton_name__comment', 'ResetAllButton.name__commentStringProperty' );
addToMapIfDefined( 'ResetAllButton_name__deprecated', 'ResetAllButton.name__deprecatedStringProperty' );
addToMapIfDefined( 'SoundToggleButton_name', 'SoundToggleButton.nameStringProperty' );
addToMapIfDefined( 'SoundToggleButton_name__comment', 'SoundToggleButton.name__commentStringProperty' );
addToMapIfDefined( 'SoundToggleButton_name__deprecated', 'SoundToggleButton.name__deprecatedStringProperty' );
addToMapIfDefined( 'units_centimeters', 'units.centimetersStringProperty' );
addToMapIfDefined( 'units_centimetersSquared', 'units.centimetersSquaredStringProperty' );
addToMapIfDefined( 'units_hertz', 'units.hertzStringProperty' );
addToMapIfDefined( 'units_percent', 'units.percentStringProperty' );
addToMapIfDefined( 'units_seconds', 'units.secondsStringProperty' );
addToMapIfDefined( 'a11y_simSection_screenSummary_keyboardShortcutsHint', 'a11y.simSection.screenSummary.keyboardShortcutsHintStringProperty' );
addToMapIfDefined( 'a11y_simSection_playArea', 'a11y.simSection.playAreaStringProperty' );
addToMapIfDefined( 'a11y_simSection_controlArea', 'a11y.simSection.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_resetAll_accessibleName', 'a11y.resetAll.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_resetAll_accessibleContextResponse', 'a11y.resetAll.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_soundToggle_label', 'a11y.soundToggle.labelStringProperty' );
addToMapIfDefined( 'a11y_soundToggle_alert_simSoundOn', 'a11y.soundToggle.alert.simSoundOnStringProperty' );
addToMapIfDefined( 'a11y_soundToggle_alert_simSoundOff', 'a11y.soundToggle.alert.simSoundOffStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_slider_leftRightArrowKeys', 'a11y.keyboardHelpDialog.slider.leftRightArrowKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_slider_upDownArrowKeys', 'a11y.keyboardHelpDialog.slider.upDownArrowKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_slider_shiftLeftRightArrowKeys', 'a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_slider_shiftUpDownArrowKeys', 'a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_tabDescription', 'a11y.keyboardHelpDialog.general.tabDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_shiftTabDescription', 'a11y.keyboardHelpDialog.general.shiftTabDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_tabGroupDescription', 'a11y.keyboardHelpDialog.general.tabGroupDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_shiftTabGroupDescription', 'a11y.keyboardHelpDialog.general.shiftTabGroupDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_pressButtonsDescription', 'a11y.keyboardHelpDialog.general.pressButtonsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_groupNavigationDescription', 'a11y.keyboardHelpDialog.general.groupNavigationDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_setValuesInKeypadDescription', 'a11y.keyboardHelpDialog.general.setValuesInKeypadDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_exitDialogDescription', 'a11y.keyboardHelpDialog.general.exitDialogDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_toggleCheckboxesDescription', 'a11y.keyboardHelpDialog.general.toggleCheckboxesDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_comboBox_closeWithoutChangingDescription', 'a11y.keyboardHelpDialog.comboBox.closeWithoutChangingDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_draggableItems_moveDescription', 'a11y.keyboardHelpDialog.draggableItems.moveDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_draggableItems_moveSlowerDescription', 'a11y.keyboardHelpDialog.draggableItems.moveSlowerDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_timingControls_pauseOrPlayActionDescription', 'a11y.keyboardHelpDialog.timingControls.pauseOrPlayActionDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_timingControls_pauseOrPlayActionMacOSDescription', 'a11y.keyboardHelpDialog.timingControls.pauseOrPlayActionMacOSDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_adjustFaucetFlowDescription', 'a11y.keyboardHelpDialog.faucetControls.adjustFaucetFlowDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_adjustInSmallerStepsDescription', 'a11y.keyboardHelpDialog.faucetControls.adjustInSmallerStepsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_adjustInLargerStepsDescription', 'a11y.keyboardHelpDialog.faucetControls.adjustInLargerStepsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_closeFaucetDescription', 'a11y.keyboardHelpDialog.faucetControls.closeFaucetDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_closeFaucetWithEndDescription', 'a11y.keyboardHelpDialog.faucetControls.closeFaucetWithEndDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_openFaucetFullyDescription', 'a11y.keyboardHelpDialog.faucetControls.openFaucetFullyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_openFaucetFullyWithHomeDescription', 'a11y.keyboardHelpDialog.faucetControls.openFaucetFullyWithHomeDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_openFaucetBrieflyDescription', 'a11y.keyboardHelpDialog.faucetControls.openFaucetBrieflyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleName', 'a11y.eraserButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_playControlButton_play', 'a11y.playControlButton.playStringProperty' );
addToMapIfDefined( 'a11y_playControlButton_pause', 'a11y.playControlButton.pauseStringProperty' );
addToMapIfDefined( 'a11y_playControlButton_stop', 'a11y.playControlButton.stopStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_playingAccessibleContextResponse', 'a11y.playPauseButton.playingAccessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_pausedAccessibleContextResponse', 'a11y.playPauseButton.pausedAccessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_stepButton_stepForward', 'a11y.stepButton.stepForwardStringProperty' );
addToMapIfDefined( 'a11y_stepButton_playingDescription', 'a11y.stepButton.playingDescriptionStringProperty' );
addToMapIfDefined( 'a11y_stepButton_pausedDescription', 'a11y.stepButton.pausedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControlNode_simSpeedDescription', 'a11y.timeControlNode.simSpeedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControlNode_label', 'a11y.timeControlNode.labelStringProperty' );
addToMapIfDefined( 'a11y_timeControlNode_simSpeeds', 'a11y.timeControlNode.simSpeedsStringProperty' );
addToMapIfDefined( 'a11y_playPauseStepButtonGroup_playingHelpText', 'a11y.playPauseStepButtonGroup.playingHelpTextStringProperty' );
addToMapIfDefined( 'a11y_playPauseStepButtonGroup_pausedHelpText', 'a11y.playPauseStepButtonGroup.pausedHelpTextStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_down', 'a11y.movementAlerter.downStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_left', 'a11y.movementAlerter.leftStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_right', 'a11y.movementAlerter.rightStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_up', 'a11y.movementAlerter.upStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_upAndToTheRight', 'a11y.movementAlerter.upAndToTheRightStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_upAndToTheLeft', 'a11y.movementAlerter.upAndToTheLeftStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_downAndToTheRight', 'a11y.movementAlerter.downAndToTheRightStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_downAndToTheLeft', 'a11y.movementAlerter.downAndToTheLeftStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_leftBorderAlert', 'a11y.movementAlerter.leftBorderAlertStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_rightBorderAlert', 'a11y.movementAlerter.rightBorderAlertStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_topBorderAlert', 'a11y.movementAlerter.topBorderAlertStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_bottomBorderAlert', 'a11y.movementAlerter.bottomBorderAlertStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_movable', 'a11y.grabDrag.movableStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_button', 'a11y.grabDrag.buttonStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_defaultObjectToGrab', 'a11y.grabDrag.defaultObjectToGrabStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_released', 'a11y.grabDrag.releasedStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_grabbed', 'a11y.grabDrag.grabbedStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_spaceToGrabOrRelease', 'a11y.grabDrag.spaceToGrabOrReleaseStringProperty' );
addToMapIfDefined( 'a11y_groupSort_sortable', 'a11y.groupSort.sortableStringProperty' );
addToMapIfDefined( 'a11y_groupSort_navigable', 'a11y.groupSort.navigableStringProperty' );
addToMapIfDefined( 'a11y_groupSort_grabbedAccessibleContextResponse', 'a11y.groupSort.grabbedAccessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_groupSort_releasedAccessibleContextResponse', 'a11y.groupSort.releasedAccessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_voicing_grabbedAlert', 'a11y.voicing.grabbedAlertStringProperty' );
addToMapIfDefined( 'a11y_voicing_draggableAlert', 'a11y.voicing.draggableAlertStringProperty' );
addToMapIfDefined( 'a11y_close', 'a11y.closeStringProperty' );
addToMapIfDefined( 'a11y_zoomIn', 'a11y.zoomInStringProperty' );
addToMapIfDefined( 'a11y_zoomOut', 'a11y.zoomOutStringProperty' );
addToMapIfDefined( 'a11y_measuringTape', 'a11y.measuringTapeStringProperty' );
addToMapIfDefined( 'a11y_measuringTapeTip', 'a11y.measuringTapeTipStringProperty' );
addToMapIfDefined( 'a11y_info', 'a11y.infoStringProperty' );
addToMapIfDefined( 'a11y_offScaleIndicator_pointsOffScaleUp', 'a11y.offScaleIndicator.pointsOffScaleUpStringProperty' );
addToMapIfDefined( 'a11y_offScaleIndicator_pointsOffScaleDown', 'a11y.offScaleIndicator.pointsOffScaleDownStringProperty' );
addToMapIfDefined( 'a11y_offScaleIndicator_pointsOffScaleLeft', 'a11y.offScaleIndicator.pointsOffScaleLeftStringProperty' );
addToMapIfDefined( 'a11y_offScaleIndicator_pointsOffScaleRight', 'a11y.offScaleIndicator.pointsOffScaleRightStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_accessibleName', 'a11y.stopwatch.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_accessibleHelpText', 'a11y.stopwatch.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_resetButton_accessibleName', 'a11y.stopwatch.resetButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_resetButton_accessibleContextResponse', 'a11y.stopwatch.resetButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_playButton_accessibleName', 'a11y.stopwatch.playButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_pauseButton_accessibleName', 'a11y.stopwatch.pauseButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_negativeNumber', 'a11y.negativeNumberStringProperty' );
addToMapIfDefined( 'a11y_scientificNotation', 'a11y.scientificNotationStringProperty' );
addToMapIfDefined( 'a11y_units_centimetersPattern', 'a11y.units.centimetersPatternStringProperty' );
addToMapIfDefined( 'a11y_units_centimetersSquaredPattern', 'a11y.units.centimetersSquaredPatternStringProperty' );
addToMapIfDefined( 'a11y_units_hertzPattern', 'a11y.units.hertzPatternStringProperty' );
addToMapIfDefined( 'a11y_units_percentPattern', 'a11y.units.percentPatternStringProperty' );
addToMapIfDefined( 'a11y_units_secondsPattern', 'a11y.units.secondsPatternStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${stringProperty.value}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const SceneryPhetFluent = {
  "scenery-phet": {
    titleStringProperty: _.get( SceneryPhetStrings, 'scenery-phet.titleStringProperty' )
  },
  screen: {
    buttonsStringProperty: _.get( SceneryPhetStrings, 'screen.buttonsStringProperty' ),
    componentsStringProperty: _.get( SceneryPhetStrings, 'screen.componentsStringProperty' ),
    dialogsStringProperty: _.get( SceneryPhetStrings, 'screen.dialogsStringProperty' ),
    keyboardStringProperty: _.get( SceneryPhetStrings, 'screen.keyboardStringProperty' ),
    slidersStringProperty: _.get( SceneryPhetStrings, 'screen.slidersStringProperty' ),
    spinnersStringProperty: _.get( SceneryPhetStrings, 'screen.spinnersStringProperty' )
  },
  WavelengthSlider: {
    pattern_0wavelength_1unitsStringProperty: _.get( SceneryPhetStrings, 'WavelengthSlider.pattern_0wavelength_1unitsStringProperty' )
  },
  frequencyUnitsPatternStringProperty: _.get( SceneryPhetStrings, 'frequencyUnitsPatternStringProperty' ),
  stopwatchValueUnitsPatternStringProperty: _.get( SceneryPhetStrings, 'stopwatchValueUnitsPatternStringProperty' ),
  units_nmStringProperty: _.get( SceneryPhetStrings, 'units_nmStringProperty' ),
  shortCircuitStringProperty: _.get( SceneryPhetStrings, 'shortCircuitStringProperty' ),
  heatStringProperty: _.get( SceneryPhetStrings, 'heatStringProperty' ),
  coolStringProperty: _.get( SceneryPhetStrings, 'coolStringProperty' ),
  key: {
    tabStringProperty: _.get( SceneryPhetStrings, 'key.tabStringProperty' ),
    shiftStringProperty: _.get( SceneryPhetStrings, 'key.shiftStringProperty' ),
    altStringProperty: _.get( SceneryPhetStrings, 'key.altStringProperty' ),
    optionStringProperty: _.get( SceneryPhetStrings, 'key.optionStringProperty' ),
    kStringProperty: _.get( SceneryPhetStrings, 'key.kStringProperty' ),
    lStringProperty: _.get( SceneryPhetStrings, 'key.lStringProperty' ),
    capsLockStringProperty: _.get( SceneryPhetStrings, 'key.capsLockStringProperty' ),
    enterStringProperty: _.get( SceneryPhetStrings, 'key.enterStringProperty' ),
    backspaceStringProperty: _.get( SceneryPhetStrings, 'key.backspaceStringProperty' ),
    deleteStringProperty: _.get( SceneryPhetStrings, 'key.deleteStringProperty' ),
    spaceStringProperty: _.get( SceneryPhetStrings, 'key.spaceStringProperty' ),
    escStringProperty: _.get( SceneryPhetStrings, 'key.escStringProperty' ),
    fnStringProperty: _.get( SceneryPhetStrings, 'key.fnStringProperty' ),
    pageUpStringProperty: _.get( SceneryPhetStrings, 'key.pageUpStringProperty' ),
    pageDownStringProperty: _.get( SceneryPhetStrings, 'key.pageDownStringProperty' ),
    homeStringProperty: _.get( SceneryPhetStrings, 'key.homeStringProperty' ),
    endStringProperty: _.get( SceneryPhetStrings, 'key.endStringProperty' ),
    aStringProperty: _.get( SceneryPhetStrings, 'key.aStringProperty' ),
    cStringProperty: _.get( SceneryPhetStrings, 'key.cStringProperty' ),
    dStringProperty: _.get( SceneryPhetStrings, 'key.dStringProperty' ),
    rStringProperty: _.get( SceneryPhetStrings, 'key.rStringProperty' ),
    sStringProperty: _.get( SceneryPhetStrings, 'key.sStringProperty' ),
    wStringProperty: _.get( SceneryPhetStrings, 'key.wStringProperty' ),
    oneStringProperty: _.get( SceneryPhetStrings, 'key.oneStringProperty' ),
    twoStringProperty: _.get( SceneryPhetStrings, 'key.twoStringProperty' ),
    threeStringProperty: _.get( SceneryPhetStrings, 'key.threeStringProperty' ),
    toGrabOrReleaseStringProperty: _.get( SceneryPhetStrings, 'key.toGrabOrReleaseStringProperty' )
  },
  webglWarning: {
    titleStringProperty: _.get( SceneryPhetStrings, 'webglWarning.titleStringProperty' ),
    bodyStringProperty: _.get( SceneryPhetStrings, 'webglWarning.bodyStringProperty' ),
    contextLossFailureStringProperty: _.get( SceneryPhetStrings, 'webglWarning.contextLossFailureStringProperty' ),
    contextLossReloadStringProperty: _.get( SceneryPhetStrings, 'webglWarning.contextLossReloadStringProperty' ),
    ie11StencilBodyStringProperty: _.get( SceneryPhetStrings, 'webglWarning.ie11StencilBodyStringProperty' )
  },
  keyboardHelpDialog: {
    sliderControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.sliderControlsStringProperty' ),
    adjustSliderStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustSliderStringProperty' ),
    spinnerControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.spinnerControlsStringProperty' ),
    adjustInSmallerStepsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustInSmallerStepsStringProperty' ),
    adjustInLargerStepsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustInLargerStepsStringProperty' ),
    jumpToMinimumStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMinimumStringProperty' ),
    jumpToMaximumStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMaximumStringProperty' ),
    adjustStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustStringProperty' ),
    sliderStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.sliderStringProperty' ),
    spinnerStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.spinnerStringProperty' ),
    heatCoolControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.heatCoolControlsStringProperty' ),
    maximumHeatStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.maximumHeatStringProperty' ),
    maximumCoolStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.maximumCoolStringProperty' ),
    heatCoolOffStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.heatCoolOffStringProperty' ),
    verbSliderPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.verbSliderPatternStringProperty' ),
    verbInSmallerStepsPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.verbInSmallerStepsPatternStringProperty' ),
    verbInLargerStepsPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.verbInLargerStepsPatternStringProperty' ),
    minimumStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.minimumStringProperty' ),
    maximumStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.maximumStringProperty' ),
    jumpToMinimumPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMinimumPatternStringProperty' ),
    jumpToMaximumPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMaximumPatternStringProperty' ),
    generalNavigationStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.generalNavigationStringProperty' ),
    basicActionsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.basicActionsStringProperty' ),
    moveToNextItemStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToNextItemStringProperty' ),
    moveToPreviousItemStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToPreviousItemStringProperty' ),
    moveToNextItemOrGroupStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToNextItemOrGroupStringProperty' ),
    moveToPreviousItemOrGroupStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty' ),
    pressButtonsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.pressButtonsStringProperty' ),
    moveBetweenItemsInAGroupStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty' ),
    setValuesInKeypadStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.setValuesInKeypadStringProperty' ),
    resetAllStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.resetAllStringProperty' ),
    exitADialogStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.exitADialogStringProperty' ),
    toggleCheckboxesStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.toggleCheckboxesStringProperty' ),
    orStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.orStringProperty' ),
    hyphenStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.hyphenStringProperty' ),
    grabOrReleaseHeadingPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.grabOrReleaseHeadingPatternStringProperty' ),
    grabOrReleaseLabelPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.grabOrReleaseLabelPatternStringProperty' ),
    comboBox: {
      chooseAThingPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.chooseAThingPatternStringProperty' ),
      headingStringStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.headingStringStringProperty' ),
      popUpListPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.popUpListPatternStringProperty' ),
      moveThroughPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.moveThroughPatternStringProperty' ),
      chooseNewPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.chooseNewPatternStringProperty' ),
      closeWithoutChangingStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty' ),
      optionsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.optionsStringProperty' ),
      optionStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.optionStringProperty' )
    },
    moveDraggableItemsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveDraggableItemsStringProperty' ),
    moveStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveStringProperty' ),
    moveSlowerStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveSlowerStringProperty' ),
    faucetControls: {
      faucetControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.faucetControlsStringProperty' ),
      adjustFaucetFlowStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.adjustFaucetFlowStringProperty' ),
      adjustInSmallerStepsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.adjustInSmallerStepsStringProperty' ),
      adjustInLargerStepsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.adjustInLargerStepsStringProperty' ),
      closeFaucetStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.closeFaucetStringProperty' ),
      openFaucetFullyStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.openFaucetFullyStringProperty' ),
      openFaucetBrieflyStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.openFaucetBrieflyStringProperty' )
    },
    timingControls: {
      timingControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.timingControls.timingControlsStringProperty' ),
      pauseOrPlayActionStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.timingControls.pauseOrPlayActionStringProperty' )
    }
  },
  speed: {
    normalStringProperty: _.get( SceneryPhetStrings, 'speed.normalStringProperty' ),
    slowStringProperty: _.get( SceneryPhetStrings, 'speed.slowStringProperty' ),
    fastStringProperty: _.get( SceneryPhetStrings, 'speed.fastStringProperty' )
  },
  symbol: {
    ohmsStringProperty: _.get( SceneryPhetStrings, 'symbol.ohmsStringProperty' ),
    resistivityStringProperty: _.get( SceneryPhetStrings, 'symbol.resistivityStringProperty' )
  },
  comboBoxDisplay: {
    valueUnitsStringProperty: _.get( SceneryPhetStrings, 'comboBoxDisplay.valueUnitsStringProperty' )
  },
  wavelengthNMValuePatternStringProperty: _.get( SceneryPhetStrings, 'wavelengthNMValuePatternStringProperty' ),
  measuringTapeReadoutPatternStringProperty: _.get( SceneryPhetStrings, 'measuringTapeReadoutPatternStringProperty' ),
  wavelengthStringProperty: _.get( SceneryPhetStrings, 'wavelengthStringProperty' ),
  rulerCapitalizedStringProperty: _.get( SceneryPhetStrings, 'rulerCapitalizedStringProperty' ),
  rulerStringProperty: _.get( SceneryPhetStrings, 'rulerStringProperty' ),
  zeroStringProperty: _.get( SceneryPhetStrings, 'zeroStringProperty' ),
  oneStringProperty: _.get( SceneryPhetStrings, 'oneStringProperty' ),
  twoStringProperty: _.get( SceneryPhetStrings, 'twoStringProperty' ),
  threeStringProperty: _.get( SceneryPhetStrings, 'threeStringProperty' ),
  fourStringProperty: _.get( SceneryPhetStrings, 'fourStringProperty' ),
  fiveStringProperty: _.get( SceneryPhetStrings, 'fiveStringProperty' ),
  sixStringProperty: _.get( SceneryPhetStrings, 'sixStringProperty' ),
  sevenStringProperty: _.get( SceneryPhetStrings, 'sevenStringProperty' ),
  eightStringProperty: _.get( SceneryPhetStrings, 'eightStringProperty' ),
  nineStringProperty: _.get( SceneryPhetStrings, 'nineStringProperty' ),
  tenStringProperty: _.get( SceneryPhetStrings, 'tenStringProperty' ),
  offScaleIndicator: {
    pointsOffScaleStringProperty: _.get( SceneryPhetStrings, 'offScaleIndicator.pointsOffScaleStringProperty' )
  },
  ResetAllButton: {
    nameStringProperty: _.get( SceneryPhetStrings, 'ResetAllButton.nameStringProperty' ),
    name__commentStringProperty: _.get( SceneryPhetStrings, 'ResetAllButton.name__commentStringProperty' ),
    name__deprecatedStringProperty: _.get( SceneryPhetStrings, 'ResetAllButton.name__deprecatedStringProperty' )
  },
  SoundToggleButton: {
    nameStringProperty: _.get( SceneryPhetStrings, 'SoundToggleButton.nameStringProperty' ),
    name__commentStringProperty: _.get( SceneryPhetStrings, 'SoundToggleButton.name__commentStringProperty' ),
    name__deprecatedStringProperty: _.get( SceneryPhetStrings, 'SoundToggleButton.name__deprecatedStringProperty' )
  },
  scientificNotationStringProperty: _.get( SceneryPhetStrings, 'scientificNotationStringProperty' ),
  units: {
    centimetersStringProperty: _.get( SceneryPhetStrings, 'units.centimetersStringProperty' ),
    centimetersPatternStringProperty: _.get( SceneryPhetStrings, 'units.centimetersPatternStringProperty' ),
    centimetersSquaredStringProperty: _.get( SceneryPhetStrings, 'units.centimetersSquaredStringProperty' ),
    centimetersSquaredPatternStringProperty: _.get( SceneryPhetStrings, 'units.centimetersSquaredPatternStringProperty' ),
    hertzStringProperty: _.get( SceneryPhetStrings, 'units.hertzStringProperty' ),
    hertzPatternStringProperty: _.get( SceneryPhetStrings, 'units.hertzPatternStringProperty' ),
    percentStringProperty: _.get( SceneryPhetStrings, 'units.percentStringProperty' ),
    percentPatternStringProperty: _.get( SceneryPhetStrings, 'units.percentPatternStringProperty' ),
    secondsStringProperty: _.get( SceneryPhetStrings, 'units.secondsStringProperty' ),
    secondsPatternStringProperty: _.get( SceneryPhetStrings, 'units.secondsPatternStringProperty' )
  },
  a11y: {
    simSection: {
      screenSummary: {
        multiScreenIntroStringProperty: _.get( SceneryPhetStrings, 'a11y.simSection.screenSummary.multiScreenIntroStringProperty' ),
        singleScreenIntroPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.simSection.screenSummary.singleScreenIntroPatternStringProperty' ),
        keyboardShortcutsHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_simSection_screenSummary_keyboardShortcutsHint', _.get( SceneryPhetStrings, 'a11y.simSection.screenSummary.keyboardShortcutsHintStringProperty' ) )
      },
      playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_simSection_playArea', _.get( SceneryPhetStrings, 'a11y.simSection.playAreaStringProperty' ) ),
      controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_simSection_controlArea', _.get( SceneryPhetStrings, 'a11y.simSection.controlAreaStringProperty' ) )
    },
    resetAll: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_resetAll_accessibleName', _.get( SceneryPhetStrings, 'a11y.resetAll.accessibleNameStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_resetAll_accessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.resetAll.accessibleContextResponseStringProperty' ) )
    },
    soundToggle: {
      labelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_soundToggle_label', _.get( SceneryPhetStrings, 'a11y.soundToggle.labelStringProperty' ) ),
      alert: {
        simSoundOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_soundToggle_alert_simSoundOn', _.get( SceneryPhetStrings, 'a11y.soundToggle.alert.simSoundOnStringProperty' ) ),
        simSoundOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_soundToggle_alert_simSoundOff', _.get( SceneryPhetStrings, 'a11y.soundToggle.alert.simSoundOffStringProperty' ) )
      }
    },
    keyboardHelpDialog: {
      slider: {
        orKeysPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.orKeysPatternStringProperty' ),
        leftRightArrowKeysStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_slider_leftRightArrowKeys', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.leftRightArrowKeysStringProperty' ) ),
        upDownArrowKeysStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_slider_upDownArrowKeys', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.upDownArrowKeysStringProperty' ) ),
        defaultStepsDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.defaultStepsDescriptionPatternStringProperty' ),
        defaultStepsAdjustSliderDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.defaultStepsAdjustSliderDescriptionPatternStringProperty' ),
        shiftLeftRightArrowKeysStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_slider_shiftLeftRightArrowKeys', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeysStringProperty' ) ),
        shiftUpDownArrowKeysStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_slider_shiftUpDownArrowKeys', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeysStringProperty' ) ),
        smallerStepsDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.smallerStepsDescriptionPatternStringProperty' ),
        smallerStepsAdjustSliderDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.smallerStepsAdjustSliderDescriptionPatternStringProperty' ),
        largerStepsDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.largerStepsDescriptionPatternStringProperty' ),
        largerStepsAdjustSliderDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.largerStepsAdjustSliderDescriptionPatternStringProperty' ),
        jumpToMinimumDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.jumpToMinimumDescriptionPatternStringProperty' ),
        jumpToMaximumDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.jumpToMaximumDescriptionPatternStringProperty' )
      },
      general: {
        resetAllDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.resetAllDescriptionPatternStringProperty' ),
        tabDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_tabDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.tabDescriptionStringProperty' ) ),
        shiftTabDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_shiftTabDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.shiftTabDescriptionStringProperty' ) ),
        tabGroupDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_tabGroupDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.tabGroupDescriptionStringProperty' ) ),
        shiftTabGroupDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_shiftTabGroupDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.shiftTabGroupDescriptionStringProperty' ) ),
        pressButtonsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_pressButtonsDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.pressButtonsDescriptionStringProperty' ) ),
        groupNavigationDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_groupNavigationDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.groupNavigationDescriptionStringProperty' ) ),
        setValuesInKeypadDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_setValuesInKeypadDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.setValuesInKeypadDescriptionStringProperty' ) ),
        exitDialogDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_exitDialogDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.exitDialogDescriptionStringProperty' ) ),
        toggleCheckboxesDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_toggleCheckboxesDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.toggleCheckboxesDescriptionStringProperty' ) )
      },
      grabOrReleaseDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.grabOrReleaseDescriptionPatternStringProperty' ),
      comboBox: {
        popUpListPatternDescriptionStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.popUpListPatternDescriptionStringProperty' ),
        moveThroughPatternDescriptionStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.moveThroughPatternDescriptionStringProperty' ),
        chooseNewPatternDescriptionStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.chooseNewPatternDescriptionStringProperty' ),
        closeWithoutChangingDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_comboBox_closeWithoutChangingDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.closeWithoutChangingDescriptionStringProperty' ) )
      },
      draggableItems: {
        moveDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_draggableItems_moveDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.draggableItems.moveDescriptionStringProperty' ) ),
        moveSlowerDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_draggableItems_moveSlowerDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.draggableItems.moveSlowerDescriptionStringProperty' ) )
      },
      timingControls: {
        pauseOrPlayActionDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_timingControls_pauseOrPlayActionDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.timingControls.pauseOrPlayActionDescriptionStringProperty' ) ),
        pauseOrPlayActionMacOSDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_timingControls_pauseOrPlayActionMacOSDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.timingControls.pauseOrPlayActionMacOSDescriptionStringProperty' ) )
      },
      faucetControls: {
        adjustFaucetFlowDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_adjustFaucetFlowDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.adjustFaucetFlowDescriptionStringProperty' ) ),
        adjustInSmallerStepsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_adjustInSmallerStepsDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.adjustInSmallerStepsDescriptionStringProperty' ) ),
        adjustInLargerStepsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_adjustInLargerStepsDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.adjustInLargerStepsDescriptionStringProperty' ) ),
        closeFaucetDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_closeFaucetDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.closeFaucetDescriptionStringProperty' ) ),
        closeFaucetWithEndDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_closeFaucetWithEndDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.closeFaucetWithEndDescriptionStringProperty' ) ),
        openFaucetFullyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_openFaucetFullyDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.openFaucetFullyDescriptionStringProperty' ) ),
        openFaucetFullyWithHomeDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_openFaucetFullyWithHomeDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.openFaucetFullyWithHomeDescriptionStringProperty' ) ),
        openFaucetBrieflyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_openFaucetBrieflyDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.openFaucetBrieflyDescriptionStringProperty' ) )
      }
    },
    eraserButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.eraserButton.accessibleNameStringProperty' ) )
    },
    playControlButton: {
      playStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playControlButton_play', _.get( SceneryPhetStrings, 'a11y.playControlButton.playStringProperty' ) ),
      pauseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playControlButton_pause', _.get( SceneryPhetStrings, 'a11y.playControlButton.pauseStringProperty' ) ),
      stopStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playControlButton_stop', _.get( SceneryPhetStrings, 'a11y.playControlButton.stopStringProperty' ) )
    },
    playPauseButton: {
      playingAccessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseButton_playingAccessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.playPauseButton.playingAccessibleContextResponseStringProperty' ) ),
      pausedAccessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseButton_pausedAccessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.playPauseButton.pausedAccessibleContextResponseStringProperty' ) )
    },
    stepButton: {
      stepForwardStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepButton_stepForward', _.get( SceneryPhetStrings, 'a11y.stepButton.stepForwardStringProperty' ) ),
      playingDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepButton_playingDescription', _.get( SceneryPhetStrings, 'a11y.stepButton.playingDescriptionStringProperty' ) ),
      pausedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepButton_pausedDescription', _.get( SceneryPhetStrings, 'a11y.stepButton.pausedDescriptionStringProperty' ) )
    },
    timeControlNode: {
      simSpeedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControlNode_simSpeedDescription', _.get( SceneryPhetStrings, 'a11y.timeControlNode.simSpeedDescriptionStringProperty' ) ),
      labelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControlNode_label', _.get( SceneryPhetStrings, 'a11y.timeControlNode.labelStringProperty' ) ),
      simSpeedsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControlNode_simSpeeds', _.get( SceneryPhetStrings, 'a11y.timeControlNode.simSpeedsStringProperty' ) )
    },
    playPauseStepButtonGroup: {
      playingHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseStepButtonGroup_playingHelpText', _.get( SceneryPhetStrings, 'a11y.playPauseStepButtonGroup.playingHelpTextStringProperty' ) ),
      pausedHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseStepButtonGroup_pausedHelpText', _.get( SceneryPhetStrings, 'a11y.playPauseStepButtonGroup.pausedHelpTextStringProperty' ) )
    },
    movementAlerter: {
      downStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_down', _.get( SceneryPhetStrings, 'a11y.movementAlerter.downStringProperty' ) ),
      leftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_left', _.get( SceneryPhetStrings, 'a11y.movementAlerter.leftStringProperty' ) ),
      rightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_right', _.get( SceneryPhetStrings, 'a11y.movementAlerter.rightStringProperty' ) ),
      upStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_up', _.get( SceneryPhetStrings, 'a11y.movementAlerter.upStringProperty' ) ),
      upAndToTheRightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_upAndToTheRight', _.get( SceneryPhetStrings, 'a11y.movementAlerter.upAndToTheRightStringProperty' ) ),
      upAndToTheLeftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_upAndToTheLeft', _.get( SceneryPhetStrings, 'a11y.movementAlerter.upAndToTheLeftStringProperty' ) ),
      downAndToTheRightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_downAndToTheRight', _.get( SceneryPhetStrings, 'a11y.movementAlerter.downAndToTheRightStringProperty' ) ),
      downAndToTheLeftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_downAndToTheLeft', _.get( SceneryPhetStrings, 'a11y.movementAlerter.downAndToTheLeftStringProperty' ) ),
      leftBorderAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_leftBorderAlert', _.get( SceneryPhetStrings, 'a11y.movementAlerter.leftBorderAlertStringProperty' ) ),
      rightBorderAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_rightBorderAlert', _.get( SceneryPhetStrings, 'a11y.movementAlerter.rightBorderAlertStringProperty' ) ),
      topBorderAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_topBorderAlert', _.get( SceneryPhetStrings, 'a11y.movementAlerter.topBorderAlertStringProperty' ) ),
      bottomBorderAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_bottomBorderAlert', _.get( SceneryPhetStrings, 'a11y.movementAlerter.bottomBorderAlertStringProperty' ) )
    },
    grabDrag: {
      grabPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.grabDrag.grabPatternStringProperty' ),
      movableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_movable', _.get( SceneryPhetStrings, 'a11y.grabDrag.movableStringProperty' ) ),
      buttonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_button', _.get( SceneryPhetStrings, 'a11y.grabDrag.buttonStringProperty' ) ),
      defaultObjectToGrabStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_defaultObjectToGrab', _.get( SceneryPhetStrings, 'a11y.grabDrag.defaultObjectToGrabStringProperty' ) ),
      releasedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_released', _.get( SceneryPhetStrings, 'a11y.grabDrag.releasedStringProperty' ) ),
      grabbedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_grabbed', _.get( SceneryPhetStrings, 'a11y.grabDrag.grabbedStringProperty' ) ),
      gestureHelpTextPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.grabDrag.gestureHelpTextPatternStringProperty' ),
      spaceToGrabOrReleaseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_spaceToGrabOrRelease', _.get( SceneryPhetStrings, 'a11y.grabDrag.spaceToGrabOrReleaseStringProperty' ) )
    },
    groupSort: {
      sortableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_sortable', _.get( SceneryPhetStrings, 'a11y.groupSort.sortableStringProperty' ) ),
      navigableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_navigable', _.get( SceneryPhetStrings, 'a11y.groupSort.navigableStringProperty' ) ),
      grabbedAccessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_grabbedAccessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.groupSort.grabbedAccessibleContextResponseStringProperty' ) ),
      releasedAccessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_releasedAccessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.groupSort.releasedAccessibleContextResponseStringProperty' ) )
    },
    listItemPunctuation: {
      semicolonPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.listItemPunctuation.semicolonPatternStringProperty' ),
      commaPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.listItemPunctuation.commaPatternStringProperty' ),
      periodPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.listItemPunctuation.periodPatternStringProperty' )
    },
    voicing: {
      simSection: {
        screenSummary: {
          singleScreenIntroPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.voicing.simSection.screenSummary.singleScreenIntroPatternStringProperty' )
        }
      },
      grabDragHintPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.voicing.grabDragHintPatternStringProperty' ),
      grabbedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voicing_grabbedAlert', _.get( SceneryPhetStrings, 'a11y.voicing.grabbedAlertStringProperty' ) ),
      draggableAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voicing_draggableAlert', _.get( SceneryPhetStrings, 'a11y.voicing.draggableAlertStringProperty' ) )
    },
    closeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_close', _.get( SceneryPhetStrings, 'a11y.closeStringProperty' ) ),
    zoomInStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_zoomIn', _.get( SceneryPhetStrings, 'a11y.zoomInStringProperty' ) ),
    zoomOutStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_zoomOut', _.get( SceneryPhetStrings, 'a11y.zoomOutStringProperty' ) ),
    measuringTapeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_measuringTape', _.get( SceneryPhetStrings, 'a11y.measuringTapeStringProperty' ) ),
    measuringTapeTipStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_measuringTapeTip', _.get( SceneryPhetStrings, 'a11y.measuringTapeTipStringProperty' ) ),
    infoStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_info', _.get( SceneryPhetStrings, 'a11y.infoStringProperty' ) ),
    offScaleIndicator: {
      pointsOffScaleUpStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_offScaleIndicator_pointsOffScaleUp', _.get( SceneryPhetStrings, 'a11y.offScaleIndicator.pointsOffScaleUpStringProperty' ) ),
      pointsOffScaleDownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_offScaleIndicator_pointsOffScaleDown', _.get( SceneryPhetStrings, 'a11y.offScaleIndicator.pointsOffScaleDownStringProperty' ) ),
      pointsOffScaleLeftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_offScaleIndicator_pointsOffScaleLeft', _.get( SceneryPhetStrings, 'a11y.offScaleIndicator.pointsOffScaleLeftStringProperty' ) ),
      pointsOffScaleRightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_offScaleIndicator_pointsOffScaleRight', _.get( SceneryPhetStrings, 'a11y.offScaleIndicator.pointsOffScaleRightStringProperty' ) )
    },
    stopwatch: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_accessibleName', _.get( SceneryPhetStrings, 'a11y.stopwatch.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_accessibleHelpText', _.get( SceneryPhetStrings, 'a11y.stopwatch.accessibleHelpTextStringProperty' ) ),
      resetButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_resetButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.stopwatch.resetButton.accessibleNameStringProperty' ) ),
        accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_resetButton_accessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.stopwatch.resetButton.accessibleContextResponseStringProperty' ) )
      },
      playButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_playButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.stopwatch.playButton.accessibleNameStringProperty' ) )
      },
      pauseButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_pauseButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.stopwatch.pauseButton.accessibleNameStringProperty' ) )
      }
    },
    negativeNumber: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_negativeNumber', _.get( SceneryPhetStrings, 'a11y.negativeNumberStringProperty' ), [{"name":"value"}] ),
    scientificNotation: new FluentPattern<{ base: FluentVariable, exponent: FluentVariable, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_scientificNotation', _.get( SceneryPhetStrings, 'a11y.scientificNotationStringProperty' ), [{"name":"base"},{"name":"exponent"},{"name":"value"}] ),
    units: {
      centimetersPattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_centimetersPattern', _.get( SceneryPhetStrings, 'a11y.units.centimetersPatternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] ),
      centimetersSquaredPattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_centimetersSquaredPattern', _.get( SceneryPhetStrings, 'a11y.units.centimetersSquaredPatternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] ),
      hertzPattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_hertzPattern', _.get( SceneryPhetStrings, 'a11y.units.hertzPatternStringProperty' ), [{"name":"value"}] ),
      percentPattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_percentPattern', _.get( SceneryPhetStrings, 'a11y.units.percentPatternStringProperty' ), [{"name":"value"}] ),
      secondsPattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_secondsPattern', _.get( SceneryPhetStrings, 'a11y.units.secondsPatternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
    }
  }
};

export default SceneryPhetFluent;

sceneryPhet.register('SceneryPhetFluent', SceneryPhetFluent);
