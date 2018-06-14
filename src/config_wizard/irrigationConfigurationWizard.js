import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {connect, Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import {
  Button, Tooltip, OverlayTrigger, Panel, Label,
  FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import $ from 'jquery';

const csrfTokenValue = $('input[name="csrfmiddlewaretoken"]').val();
const noHtml = <noscript />;  //<span className="hidden"/>;

/*
 * CROP CLASS CONSTANTS:
 */

const CROP_CLASS__ORCHARD  = 'Orchard';
const CROP_CLASS__ROW_CROP = 'Row';
const CROP_CLASS__VINE = 'Vine';
const CROP_CLASS__FIELD = 'Field';
const CROP_CLASS__ALFALFA = 'Alfalfa';
const SUPPORTED_CROP_CLASSES = [
  CROP_CLASS__ORCHARD,
  CROP_CLASS__ROW_CROP, 
  CROP_CLASS__VINE,
  CROP_CLASS__FIELD,
  CROP_CLASS__ALFALFA,
];

/*
 * QUESTION TYPE CONSTANTS:
 */
///

const QUESTION_IRRIGATION_SYSTEM_TYPE   = 'QUESTION_IRRIGATION_SYSTEM_TYPE';
const QUESTION_ORCHARD_TREE_SPACING        = 'QUESTION_ORCHARD_TREE_SPACING';
const QUESTION_VINE_SPACING        = 'QUESTION_VINE_SPACING';
const QUESTION_APPLICATION_RATE_AND_UNITS = 'QUESTION_APPLICATION_RATE_AND_UNITS';
const QUESTION_NUMBER_OF_SETS = 'QUESTION_NUMBER_OF_SETS';

const QUESTION_BED_WIDTH = 'QUESTION_BED_WIDTH';
const QUESTION_ROWS_PER_BED = 'QUESTION_ROWS_PER_BED';
const QUESTION_DRIP_TAPES_PER_BED = 'QUESTION_DRIP_TAPES_PER_BED';

const ASK_SOMEONE_ELSE_HEADING_TEXT = 'Who do you want to answer this question for you?';

/*
 * ACTION TYPE CONSTANTS:
 */
///

const BEGIN_IRRIGATION_CONFIG_WIZARD_WITH_CHOICE = 'BEGIN_IRRIGATION_CONFIG_WIZARD_WITH_CHOICE';
const BEGIN_IRRIGATION_CONFIG_FROM_SCRATCH = 'BEGIN_IRRIGATION_CONFIG_FROM_SCRATCH';
const BEGIN_IRRIGATION_CONFIG_FROM_IMPORT = 'BEGIN_IRRIGATION_CONFIG_FROM_IMPORT';
const BEGIN_IRRIGATION_CONFIG_FOR_INDIVIDUAL_QUESTION = 'BEGIN_IRRIGATION_CONFIG_FOR_INDIVIDUAL_QUESTION';
const ASK_IF_USER_WANTS_TO_PICK_UP_WHERE_THEY_LEFT_OFF = 'ASK_IF_USER_WANTS_TO_PICK_UP_WHERE_THEY_LEFT_OFF';

const REQUEST_IMPORTED_IRRIGATION_CONFIG = 'REQUEST_IMPORTED_IRRIGATION_CONFIG';
const RECEIVE_IMPORTED_IRRIGATION_CONFIG = 'RECEIVE_IMPORTED_IRRIGATION_CONFIG';

const RECORD_IRRIGATION_CONFIG_ANSWER = 'RECORD_IRRIGATION_CONFIG_ANSWER';
const SAVED_IRRIGATION_CONFIG_WIZARD_PROGRESS = 'SAVED_IRRIGATION_CONFIG_WIZARD_PROGRESS';
const BEGIN_SAVING_IRRIGATION_CONFIG_WIZARD_PROGRESS = 'BEGIN_SAVING_IRRIGATION_CONFIG_WIZARD_PROGRESS';
const GO_BACK_TO_PREVIOUS_QUESTION = 'GO_BACK_TO_PREVIOUS_QUESTION';

const DO_IRRIGATION_CONFIG_FOR_ANOTHER_FIELD = 'DO_IRRIGATION_CONFIG_FOR_ANOTHER_FIELD';

const SUBMIT_IRRIGATION_CONFIG_USING_IMPORT = 'SUBMIT_IRRIGATION_CONFIG_USING_IMPORT';
const ADVANCE_TO_NEXT_IRRIGATION_CONFIG_QUESTION = 'ADVANCE_TO_NEXT_IRRIGATION_CONFIG_QUESTION';

const MARK_IRRIGATION_CONFIG_QUESTION_AS_NOT_KNOWN_BY_USER = 'MARK_IRRIGATION_CONFIG_QUESTION_AS_NOT_KNOWN_BY_USER';

const REQUEST_USERS_FOR_ASKING_QUESTIONS = 'REQUEST_USERS_FOR_ASKING_QUESTIONS';
const RECEIVE_USERS_FOR_ASKING_QUESTIONS = 'RECEIVE_USERS_FOR_ASKING_QUESTIONS';

const REQUEST_BLOCKS_NEEDING_IRRIGATION_CONFIG = 'REQUEST_BLOCKS_NEEDING_IRRIGATION_CONFIG';
const RECEIVE_BLOCKS_NEEDING_IRRIGATION_CONFIG = 'RECEIVE_BLOCKS_NEEDING_IRRIGATION_CONFIG';

const REQUEST_BLOCKS_WITH_COMPLETED_IRRIGATION_CONFIG = 'REQUEST_BLOCKS_WITH_COMPLETED_IRRIGATION_CONFIG';
const RECEIVE_BLOCKS_WITH_COMPLETED_IRRIGATION_CONFIG = 'RECEIVE_BLOCKS_WITH_COMPLETED_IRRIGATION_CONFIG';

const REQUEST_BLOCK_AND_IRRIGATION_CONFIG_DATA            = 'REQUEST_BLOCK_AND_IRRIGATION_CONFIG_DATA';
const RECEIVE_BLOCK_AND_IRRIGATION_CONFIG_DATA            = 'RECEIVE_BLOCK_AND_IRRIGATION_CONFIG_DATA';
const FAILED_TO_RECEIVE_BLOCK_AND_IRRIGATION_CONFIG_DATA  = 'FAILED_TO_RECEIVE_BLOCK_AND_IRRIGATION_CONFIG_DATA';
const RECEIVED_BLOCK_OF_UNSUPPORTED_CROP_CLASS            = 'RECEIVED_BLOCK_OF_UNSUPPORTED_CROP_CLASS';
// const REQUEST_ANOTHER_BLOCK_FOR_IRRIGATION_CONFIG = 'REQUEST_ANOTHER_BLOCK_FOR_IRRIGATION_CONFIG'
// const RECEIVE_ANOTHER_BLOCK_FOR_IRRIGATION_CONFIG = 'RECEIVE_ANOTHER_BLOCK_FOR_IRRIGATION_CONFIG'

const BEGIN_TO_ASK_SOMEONE_IRRIGATION_CONFIG_QUESTION = 'BEGIN_TO_ASK_SOMEONE_IRRIGATION_CONFIG_QUESTION';
const CANCEL_ASKING_SOMEONE_IRRIGATION_CONFIG_QUESTION = 'CANCEL_ASKING_SOMEONE_IRRIGATION_CONFIG_QUESTION';
// const EMAIL_IRRIGATION_CONFIGURATION_QUESTION = 'EMAIL_IRRIGATION_CONFIGURATION_QUESTION' //not implemented yet
const SEND_USER_IRRIGATION_CONFIG_QUESTION = 'SEND_USER_IRRIGATION_CONFIG_QUESTION';

const FINISH_IRRIGATION_CONFIG = 'FINISH_IRRIGATION_CONFIG';

const SUBMIT_FORM_FROM_IMPORTED_IRRIGATION_CONFIG = 'SUBMIT_FORM_FROM_IMPORTED_IRRIGATION_CONFIG';
const ANSWER_INDIVIDUAL_IRRIGATION_CONFIG_QUESTION = 'ANSWER_INDIVIDUAL_IRRIGATION_CONFIG_QUESTION';

const IRRIGATION_CONFIG_WIZARD_ANSWER_VALIDITY_CHANGED = 'IRRIGATION_CONFIG_WIZARD_ANSWER_VALIDITY_CHANGED';

const CLEAR_CURRENT_BLOCK_AND_IRRIGATION_CONFIG_DATA = 'CLEAR_CURRENT_BLOCK_AND_IRRIGATION_CONFIG_DATA';

/*
 * ACTION FUNCTIONS:
 */
///

function clearCurrentBlockAndIrrigationConfigData() {
  return {
    type: CLEAR_CURRENT_BLOCK_AND_IRRIGATION_CONFIG_DATA
  }
}

function beginIrrigationConfigFromScratch(irrigationConfig, block) {
  return {
    type: BEGIN_IRRIGATION_CONFIG_FROM_SCRATCH,
    block,
    irrigationConfig
  };
}

function beginIrrigationConfigForIndividualQuestion(irrigationConfig, block, questionIndex) {
  const wizardState = irrigationConfig['ui_wizard_state'];
  return {
    type: BEGIN_IRRIGATION_CONFIG_FOR_INDIVIDUAL_QUESTION,
    block,
    questionIndex,
    irrigationConfig,
    wizardState,
    answers: wizardState.answers ? wizardState.answers : {}
  };
}

function submitFormFromImportedIrrigationConfig(results) {
  return (dispatch) => {
    //dispatch actual action object:
    dispatch({
      type: SUBMIT_FORM_FROM_IMPORTED_IRRIGATION_CONFIG,
      results
    })
    dispatch(saveIrrigationConfigWizardProgress())
  }
}

function requestImportedIrrigationConfig(fromBlock) {
  return {
    type: REQUEST_IMPORTED_IRRIGATION_CONFIG,
    fromBlock
  };
}

function receiveImportedIrrigationConfig() {
  return {
    type: RECEIVE_IMPORTED_IRRIGATION_CONFIG
  };
}

function fetchImportedIrrigationConfig(fromBlock) {
  return (dispatch, getState) => {
    dispatch(requestImportedIrrigationConfig(fromBlock))

    $.ajax({
      url: "/irrigation/cfg/block/"+fromBlock.id+'/',
      beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
    }).done(data => {
      const state = getState();

      const forBlock = state.block;
      const importedConfig = data.irrigation_properties;
      const { answers } = data['ui_wizard_state'];

      dispatch(receiveImportedIrrigationConfig())
      dispatch(beginIrrigationConfigFromImport(forBlock, fromBlock, importedConfig, answers));
    });
  }
}

function chooseToPickUpWhereTheyLeftOff() {
  //essentially import from itself using already fetched data:
  return (dispatch, getState) => {
    const state = getState();
    dispatch(beginIrrigationConfigFromImport(
      state.block,
      state.block,
      state.irrigationConfig.irrigation_properties,
      state.irrigationConfig.ui_wizard_state.answers
    ));
  }
}

function beginIrrigationConfigFromImport(forBlock, fromBlock, importedConfig, answers) {
  //TODO: consider not keeping importedConfig on the state, but combine it with irr. props
  return {
    type: BEGIN_IRRIGATION_CONFIG_FROM_IMPORT,
    block: forBlock,
    importedBlock: fromBlock,
    importedConfig,
    answers
  };
}

function recordIrrigationConfigAnswer(questionIndex, inputName, answer, willSaveProgress) {
  return {
    'type': RECORD_IRRIGATION_CONFIG_ANSWER,
    questionIndex,
    inputName,
    answer,
    willSaveProgress
  }
}

function beginSavingIrrigationConfigWizardProgress() {
  return {
    type: BEGIN_SAVING_IRRIGATION_CONFIG_WIZARD_PROGRESS
  }
}

function saveIrrigationConfigWizardProgress() {
  const getResults = (state) => {
    let values = {
      crop_class: state.block.crop_class
    };

    if(state.importedBlock) {
      return {
        ...values,
        ...state.reviewedConfig
      };
    }

    const { answers } = state;
    Object.keys(answers).forEach(key => {
      const answer = answers[key];
      if(answer.inputs) {
        values = {
          ...values,
          ...answer.inputs
        }
      }
    })

    return values
  }

  return (dispatch, getState) => {
    dispatch(beginSavingIrrigationConfigWizardProgress());

    //send wizard progress to server:
    const state = getState();
    let results = getResults(state);

    const dataToSend = {
      ...state.irrigationConfig,
      'ui_wizard_state': {
        answers: state.answers,
        currQuestionIndex: state.currQuestionIndex,
        hasJustFinished: state.hasJustFinished,
        isEnteringFormFromImport: state.isEnteringFormFromImport,
        isFinished: state.isFinished,
        questions: state.questions
      },
      // 'ui_wizard_state': state,
      'irrigation_properties': {
        ...results
      },
      'end_date': "2016-12-31"
    };
    console.log('sending data to server:', dataToSend);

    $.ajax({
        url: "/irrigation/cfg/block/"+state.block.id+"/",
        contentType: 'application/json',
        data: JSON.stringify(dataToSend),
        dataType: "json",
        method: 'PUT',
        processData: false,
        beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-CSRFToken', csrfTokenValue);}
    }).done(data => {
      console.log("RECEIVED DATA AFTER SAVE", data);
      dispatch(savedIrrigationConfigWizardProgress());
      if(state.hasJustFinished) {
        dispatch(finishIrrigationConfig(true));
        dispatch(saveIrrigationConfigWizardProgress());
      }
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.error('submission of wizard progress failed');
    });
  }
}

function savedIrrigationConfigWizardProgress() {
  return {
    type: SAVED_IRRIGATION_CONFIG_WIZARD_PROGRESS
  }
}

function answerIrrigationConfigQuestion(questionIndex, inputName, answer, advanceAndSave=true) {
  return (dispatch) => {
    dispatch(recordIrrigationConfigAnswer(questionIndex, inputName, answer, advanceAndSave));
    if(advanceAndSave) {
      dispatch(advanceToNextIrrigationConfigQuestion());
      dispatch(saveIrrigationConfigWizardProgress());
    }
  }
}

// function answerIndividualIrrigationConfigQuestion(questionIndex, inputName, answer) {
//   return (dispatch) => {
//     dispatch(recordIrrigationConfigAnswer(questionIndex, inputName, answer));
//     dispatch(finishIrrigationConfig(true));
//     dispatch(saveIrrigationConfigWizardProgress());
//   }
// }

function advanceToNextIrrigationConfigQuestion() {
  return {
    type: ADVANCE_TO_NEXT_IRRIGATION_CONFIG_QUESTION
  }
}

function finishIrrigationConfig(isSuccessful) {
  return {
    type: FINISH_IRRIGATION_CONFIG,
    success: isSuccessful
  }
}

function goBacktoPreviousIrrigationConfigQuestion() {
  return (dispatch) => {
    // dispatch an actual action first...
    dispatch({
      type: GO_BACK_TO_PREVIOUS_QUESTION
    });
    // ...then save the progress
    dispatch(saveIrrigationConfigWizardProgress());
  }
}

function beginToAskSomeoneElseIrrigationConfigQuestion(questionIndex) {
  return {
    type: BEGIN_TO_ASK_SOMEONE_IRRIGATION_CONFIG_QUESTION,
    questionIndex: questionIndex
  }
}

function chooseUserToSendIrrigationConfigQuestion(user, questionIndex) {
  return (dispatch, getState) => {
    dispatch(sendUserIrrigationConfigQuestion(user));
    const state = getState();
    const dataToSend = {
      'to_user_id': user.id,
      'question_id': state.currQuestionIndex
    }

    $.ajax({
        url: "/irrigation/cfg/block/{blockId}/send_to_user/".replace('{blockId}', state.block.id),
        contentType: 'application/json',
        data: JSON.stringify(dataToSend),
        dataType: "json",
        method: 'POST',
        processData: false,
        beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-CSRFToken', csrfTokenValue);}
    }).done((data) => {
      console.log('sent email!!!!!!!!!!', data)
      dispatch(advanceToNextIrrigationConfigQuestion());
      dispatch(saveIrrigationConfigWizardProgress());
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.error('failed to send email');
      // dispatch(advanceToNextIrrigationConfigQuestion());
      // dispatch(saveIrrigationConfigWizardProgress());
    });
  }
}

function sendUserIrrigationConfigQuestion(user) {
  return {
    type: SEND_USER_IRRIGATION_CONFIG_QUESTION,
    user: user
  }
}

function cancelAskingSomeoneIrrigationConfigQuestion() {
  return {
    type: CANCEL_ASKING_SOMEONE_IRRIGATION_CONFIG_QUESTION
  }
}

function markIrrigationConfigQuestionAsNotKnownByUser(questionIndex) {
  return (dispatch) => {
    // dispatch actual action object first...
    dispatch({
      type: MARK_IRRIGATION_CONFIG_QUESTION_AS_NOT_KNOWN_BY_USER,
      questionIndex: questionIndex
    });

    dispatch(advanceToNextIrrigationConfigQuestion());
    dispatch(saveIrrigationConfigWizardProgress());
  }
}

function requestUsersForAskingQuestions(ranchId) {
  return {
    type: REQUEST_USERS_FOR_ASKING_QUESTIONS,
    ranchId
  };
}

function receiveUsersForAskingQuestions(users) {
  return {
    type: RECEIVE_USERS_FOR_ASKING_QUESTIONS,
    users
  };
}

function fetchUsersForAskingQuestions(ranchId) {
  return (dispatch) => {
    dispatch(requestUsersForAskingQuestions(ranchId))

    $.ajax({
      url: "/company/users/ranch/"+ranchId+'/',
      beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
    }).done((data) => {
      dispatch(receiveUsersForAskingQuestions(data.users));
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.error('failed to receive other users list');
    });
  }
}

function requestBlocksNeedingIrrigationConfig() {
  return {
    type: REQUEST_BLOCKS_NEEDING_IRRIGATION_CONFIG
  };
}

function receiveBlocksNeedingIrrigationConfig(blocks) {
  return {
    type: RECEIVE_BLOCKS_NEEDING_IRRIGATION_CONFIG,
    blocks
  };
}

function fetchBlocksNeedingIrrigationConfig() {
  return (dispatch) => {
    dispatch(requestBlocksNeedingIrrigationConfig())

    $.ajax({
      url: "/irrigation/configuration/state/not_finished/crop_class/All/",
      beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
    }).done( (data) => {
      const blocks = data.map(block => {
        return {
          id: block.block_id,
          name: block.block_name
        }
      })
      dispatch(receiveBlocksNeedingIrrigationConfig(blocks));
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.error('failed to receive blocks list w/ incomplete irrigation');
    });
  }
}

function requestBlocksWithCompletedIrrigationConfig(cropClass) {
  return {
    type: REQUEST_BLOCKS_WITH_COMPLETED_IRRIGATION_CONFIG,
    cropClass
  };
}

function receiveBlocksWithCompletedIrrigationConfig(blocks, cropClass) {
  return {
    type: RECEIVE_BLOCKS_WITH_COMPLETED_IRRIGATION_CONFIG,
    blocks,
    cropClass
  };
}

function fetchBlocksWithCompletedIrrigationConfig(cropClass, beginWizardAfterFetch=true) {
  console.log('fetching finished blocks of crop class:', cropClass);

  return (dispatch, getState) => {
    dispatch(requestBlocksWithCompletedIrrigationConfig(cropClass))

    $.ajax({
      url: "/irrigation/configuration/state/finished/crop_class/{cropClass}/"
              .replace('{cropClass}', cropClass),
      beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
    }).done((data) => {
      const blocks = data.map(block => {
        return {
          id: block.block_id,
          name: block.block_name
        }
      })
      dispatch(receiveBlocksWithCompletedIrrigationConfig(blocks, cropClass));

      if(beginWizardAfterFetch) {
        const currState = getState();
        if(currState.hasReceivedInitialBlockAndConfigData && !currState.hasBegan) {
          dispatch(beginIrrigationConfigWizard());
        }
      }
    }).fail((jqXHR, textStatus, errorThrown) => {
      debugger
      console.error('failed to receive blocks list w/ complete config')
    });
  }
}

function requestBlockAndIrrigationConfigData(blockId) {
  return {
    type: REQUEST_BLOCK_AND_IRRIGATION_CONFIG_DATA,
    blockId
  }
}

/*
    } else if (block.crop_class == CROP_CLASS__ALFALFA) {
      questions = alfalfaQuestions
    } else if (block.crop_class == CROP_CLASS__FIELD) {
      questions = fieldQuestions
*/
function receiveBlockAndIrrigationConfigData(irrigationConfig, block) {
  const get_questions_for_crop_class = (crop_class) => {
    let questions = [];
    if(block.crop_class == CROP_CLASS__ORCHARD) {
      questions = orchardQuestions
    } else if (block.crop_class == CROP_CLASS__ROW_CROP) {
      questions = rowCropQuestions
    } else if (block.crop_class == CROP_CLASS__VINE) {
      questions = vineQuestions
    } else {
      let msg = `${block.crop_class} crops are not supported`;
      console.log("Error: ", msg);
      
      //TODO: handle unsupported crop types
      //do not show wizard because we dont support this crop type
    }

    return questions
  }

  const questions = get_questions_for_crop_class(block.crop_class);

  return (dispatch) => {
    dispatch({
      type: RECEIVE_BLOCK_AND_IRRIGATION_CONFIG_DATA,
      irrigationConfig,
      block,
      questions
    })

    //new block may been in diff ranch -> diff list of users who can access it:
    dispatch(fetchUsersForAskingQuestions(block.ranch.id));
  }
}

function failedToReceiveBlockAndIrrigationConfigData() {
  return {
    type: FAILED_TO_RECEIVE_BLOCK_AND_IRRIGATION_CONFIG_DATA
  }
}

function receivedBlockOfUnsupportedCropClass(cropClass) {
  return {
    type: RECEIVED_BLOCK_OF_UNSUPPORTED_CROP_CLASS,
    cropClass
  }
}

function fetchInitialFarmBlockAndIrrigationConfigData(forBlockId) {
  return (dispatch, getState) => {
    if(!forBlockId)   forBlockId = getState().block.id

    dispatch(requestBlockAndIrrigationConfigData(forBlockId))

    //get config data first...
    $.ajax({
      url: "/irrigation/cfg/block/"+forBlockId+'/',
      beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
    }).done(configData => {
      configData['ui_wizard_state'] = configData['ui_wizard_state'];
      configData['irrigation_properties'] = configData['irrigation_properties'];

      //...and now get block data:
      $.ajax({
        url: "/farm/blocks?block_id="+forBlockId,
        beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
      }).done(data => {
        let block = data.blocks[0];
        const cropClass = block.crop_class;

        if(SUPPORTED_CROP_CLASSES.indexOf(cropClass) === -1) {
          console.error('received unsupported crop class:', cropClass)
          dispatch(receivedBlockOfUnsupportedCropClass(cropClass));
          return;
        } else {
          console.log('received supported crop class:', cropClass)
        }

        dispatch(fetchBlocksWithCompletedIrrigationConfig(cropClass))
        dispatch(fetchBlocksNeedingIrrigationConfig())

        dispatch(receiveBlockAndIrrigationConfigData(configData, block));

        const currState = getState();
        if(currState.hasReceivedConfiguredBlocks && !currState.hasBegan) {
          dispatch(beginIrrigationConfigWizard());  //questionPreviouslyLeftOffAt
        }
      }).fail(function() {
        //TODO: handle ajax call error through redux
        debugger
      })
    }).fail( () => {
        dispatch(failedToReceiveBlockAndIrrigationConfigData());
    });
  }
}

function beginIrrigationConfigWizard() {
  return (dispatch, getState) => {
    const state = getState();
    const config = state.irrigationConfig;
    if(config &&
      config.ui_wizard_state &&
      config.ui_wizard_state.currQuestionIndex || config.ui_wizard_state.isFinished
    ) {
      dispatch(askIfUserWantsToPickUpWhereTheyLeftOff())
    }
    else if(state.configuredBlocks.length) {
      dispatch(beginIrrigationConfigWizardWithChoice());
    } else {
      dispatch(beginIrrigationConfigFromScratch());
    }
  }
}

function askIfUserWantsToPickUpWhereTheyLeftOff() {
  return {
    type: ASK_IF_USER_WANTS_TO_PICK_UP_WHERE_THEY_LEFT_OFF
  }
}

function beginIrrigationConfigWizardWithChoice() {
  return {
    type: BEGIN_IRRIGATION_CONFIG_WIZARD_WITH_CHOICE
  }
}

function fetchInitialFarmBlockAndIrrigationConfigDataForIndividualQuestion(forBlockId, questionIndex) {
  return (dispatch, getState) => {
    dispatch(requestBlockAndIrrigationConfigData(forBlockId))

    $.ajax({
      url: "/irrigation/cfg/block/"+forBlockId+'/',
      beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
    }).done(configData => {
      if ( ! (typeof configData['ui_wizard_state'] === 'object')) {
          configData['ui_wizard_state'] = JSON.parse(configData['ui_wizard_state']);
      }
      configData['irrigation_properties'] = (configData['irrigation_properties'])
      $.ajax({
        url: "/farm/blocks?block_id="+forBlockId,
        beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
      }).done(data => {
        if(data.blocks.length !== 1) {
          console.error("Something went wrong loading the block for irrigation config wizard");
          return;
        }
        let block = data.blocks[0];
        const cropClass = block.crop_class;

        if(SUPPORTED_CROP_CLASSES.indexOf(cropClass) === -1) {
          console.error('received unsupported crop class:', cropClass)
          dispatch(receivedBlockOfUnsupportedCropClass(cropClass));
          return;
        } else {
          console.log('received supported crop class:', cropClass)
        }

        dispatch(receiveBlockAndIrrigationConfigData(configData, block));
        dispatch(beginIrrigationConfigForIndividualQuestion(configData, block, questionIndex));

        //now that we have the ranch id:
        dispatch(fetchUsersForAskingQuestions(block.ranch.id));
      }).fail(function(err) {
      //TODO: handle ajax call error through redux
          console.error("Error fetching farm/blocks");
        debugger;
        alert("It appears you don't have access to this block or something when wrong. Please click on the logo in the upper left.");
      })
    }).fail(function(err) {
      //TODO: handle ajax call error through redux
          console.error("Error fetching irrigation/cfg/block");
        debugger;
        alert("It appears you don't have access to this block or something when wrong. Please click on the logo in the upper left.");
    });
  }
}

function fetchAnotherBlockAndIrrigationConfigData(forBlockId) {
  return (dispatch, getState) => {
    const cropClass = getState().block.crop_class;

    dispatch(fetchBlocksWithCompletedIrrigationConfig(cropClass));
    dispatch(clearCurrentBlockAndIrrigationConfigData());
    dispatch(requestBlockAndIrrigationConfigData(forBlockId));
    window.history.pushState(forBlockId, 'Irrigation Configuration', '/irrigation/configuration/wizard/'+forBlockId+'/');
    $.ajax({
      url: "/irrigation/cfg/block/"+forBlockId+'/',
      beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
    }).done(irrigationConfigData => {
      $.ajax({
        url: "/farm/blocks?block_id="+forBlockId,
        beforeSend: function(jqXhr) {jqXhr.setRequestHeader('X-csrfTokenValue', csrfTokenValue);}
      }).done(data => {
        let block = data.blocks[0];
        const cropClass = block.crop_class;

        if(SUPPORTED_CROP_CLASSES.indexOf(cropClass) === -1) {
          console.error('received unsupported crop class:', cropClass)
          dispatch(receivedBlockOfUnsupportedCropClass(cropClass));
          return;
        } else {
          console.log('received supported crop class:', cropClass)
        }

        dispatch(receiveBlockAndIrrigationConfigData(irrigationConfigData, block));

        const currState = getState();
        if(currState.hasReceivedConfiguredBlocks && !currState.hasBegan) {
          dispatch(beginIrrigationConfigWizard());
        }
      });
    });
  }
}

function irrigationConfigWizardAnswerValidityChanged(questionIndex,inputIndex,isValid) {
  return {
    type: IRRIGATION_CONFIG_WIZARD_ANSWER_VALIDITY_CHANGED,
    isValid,
    questionIndex,
    inputIndex
  }
}

/*
 *
 * react/reducers/irrigation-configuration-wizard.js
 *
 */
///

//input types:
const SUBMIT_BUTTON_CHOICES    = 'SUBMIT_BUTTON_CHOICES'
const INPUT_NUMBER_2D         = 'INPUT_NUMBER_2D'
const INPUT_NUMBER            = 'INPUT_NUMBER'
const INPUT_RADIO_BUTTONS     = 'INPUT_RADIO_BUTTONS'
const SUBMIT_BUTTON            = 'SUBMIT_BUTTON'
const INPUT_NUMBER_AND_RADIO = 'INPUT_NUMBER_AND_RADIO'

//unit labels:
const UNIT_LABEL_FEET         = 'ft'
const UNIT_LABEL_GAL_PER_MIN = 'gal / min (gpm)'
const UNIT_LABEL_CUBIC_FT_PER_SEC = 'cubic-ft / sec (cfs)'
const UNIT_VALUE_GAL_PER_MIN = 'gal_per_min'
const UNIT_VALUE_CUBIC_FT_PER_SEC = 'cubic_feet_per_sec'

const UNIT_LABEL_GAL_PER_HR_PER_VINE = "gal / hr / vine"
const UNIT_LABEL_GAL_PER_HR_PER_TREE = "gal / hr / tree"
const UNIT_LABEL_GAL_PER_HR_PER_HUNDRED_FEET = "gal / hr / 100 ft"
const UNIT_LABEL_IN_PER_HR_PER_ACRE = "in / hr"

const UNIT_VALUE_GAL_PER_HR_PER_TREE = "gal_per_hr_per_tree"
const UNIT_VALUE_GAL_PER_HR_PER_HUNDRED_FEET = "gal_per_hr_per_hundred_ft"
const UNIT_VALUE_IN_PER_HR_PER_ACRE = "in_per_hr_per_acre"

//other:
const CONTINUE_BUTTON_TEXT    = 'Continue';

// Common for row, field & alfalfa
const DEFAULT_IRRIGATION_TYPES =  [
          {text: "Drip",                    value: "drip"},
          {text: "Subsurface Drip",         value: "subsurface_drip"},
          {text: "Sprinkler",               value: "sprinkler"},
          {text: "Flood",                   value: "flood"},
          {text: "Other",                   value: "other"}
];

const rowCropQuestions = [
  { //0
    type: QUESTION_IRRIGATION_SYSTEM_TYPE,
    text: "What is the field's irrigation system type?",
    inputs: [
      {
        wizardInputType: SUBMIT_BUTTON_CHOICES,
        formInputType: INPUT_RADIO_BUTTONS,
        formLabel: "Irrigation System Type",
        defaultFormValue: "",
        name: "irrigation_system_type",
        choices: DEFAULT_IRRIGATION_TYPES,
      }
    ]
  },
  { // 1
    type: QUESTION_BED_WIDTH,
    text: "What is the bed width?",
    inputs: [
      {
        wizardInputType: INPUT_NUMBER,
        formInputType: INPUT_NUMBER,
        formLabel: "Bed width",
        defaultFormValue: "",
        name: "bed_width",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        label: null,
        placeholder: null,
        unit: "in.",
        min: "0",
        step: "1",
        defaultValue: "0"
      }
    ]
  },
  { // 2
    type: QUESTION_ROWS_PER_BED,
    text: "How many plant rows are in each bed?",
    inputs: [
      {
        wizardInputType: INPUT_NUMBER,
        formInputType: INPUT_NUMBER,
        formLabel: "Plant rows per bed",
        defaultFormValue: "1",
        name: "rows_per_bed",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        label: null,
        placeholder: null,
        unit: "plant row(s)",
        min: "1",
        step: "1",
        defaultValue: "1"
      }
    ]
  },
  { // 3
     type: QUESTION_DRIP_TAPES_PER_BED,
     text: "How many drip tapes are in each bed?",
     inputs: [
       {
         wizardInputType: INPUT_NUMBER,
         formInputType: INPUT_NUMBER,
         formLabel: "Drip tapes per bed",
         defaultFormValue: "1",
         name: "drip_tapes_per_bed",
         submitButton: {
           text: CONTINUE_BUTTON_TEXT
         },
         label: null,
         placeholder: null,
         unit: "drip tape(s)",
         min: "1",
         step: "1",
         defaultValue: "1"
       }
     ]
  },
  { // 4
    type: QUESTION_APPLICATION_RATE_AND_UNITS,
    text: "What is the application rate?",
    irrigationTypes: {drip:true, subsurface_drip:true},
    inputs: [
      {
        wizardInputType: INPUT_NUMBER_AND_RADIO,
        formInputType: INPUT_NUMBER_AND_RADIO,
        defaultFormValue: [null, UNIT_VALUE_GAL_PER_HR_PER_HUNDRED_FEET],
        formLabel: "Application Rate (and units)",
        name: "application_rate_then_units",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        numInput: {
          label: null,
          placeholder: "0",
          unit: null,
          min: "0",
          step: ".1"
        },
        radioInput: {
          choices: [
            {text: UNIT_LABEL_GAL_PER_HR_PER_HUNDRED_FEET, value: UNIT_VALUE_GAL_PER_HR_PER_HUNDRED_FEET},
            {text: UNIT_LABEL_IN_PER_HR_PER_ACRE, value: UNIT_VALUE_IN_PER_HR_PER_ACRE}
          ]
        }
      }
    ]
  },
  {
    type: QUESTION_NUMBER_OF_SETS,
    text: "How many sets are in the field?",
    inputs: [
      {
        wizardInputType: INPUT_NUMBER,
        formInputType: INPUT_NUMBER,
        formLabel: "Sets in field",
        defaultFormValue: "1",
        name: "number_of_sets",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        label: null,
        placeholder: null,
        unit: "set(s)",
        min: "1",
        step: "1",
        defaultValue: "1"
      }
    ]
  }
];

const fieldCropQuestions = [
  { //0
    type: QUESTION_IRRIGATION_SYSTEM_TYPE,
    text: "What is the field's irrigation system type?",
    inputs: [
      {
        wizardInputType: SUBMIT_BUTTON_CHOICES,
        formInputType: INPUT_RADIO_BUTTONS,
        formLabel: "Irrigation System Type",
        defaultFormValue: "",
        name: "irrigation_system_type",
        choices: DEFAULT_IRRIGATION_TYPES,
      }
    ]
  },
  { // 1
    type: QUESTION_BED_WIDTH,
    text: "What is the bed width?",
    inputs: [
      {
        wizardInputType: INPUT_NUMBER,
        formInputType: INPUT_NUMBER,
        formLabel: "Bed width",
        defaultFormValue: "",
        name: "bed_width",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        label: null,
        placeholder: null,
        unit: "in.",
        min: "0",
        step: "1",
        defaultValue: "0"
      }
    ]
  },
  { // 2
    type: QUESTION_ROWS_PER_BED,
    text: "How many plant rows are in each bed?",
    inputs: [
      {
        wizardInputType: INPUT_NUMBER,
        formInputType: INPUT_NUMBER,
        formLabel: "Plant rows per bed",
        defaultFormValue: "1",
        name: "rows_per_bed",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        label: null,
        placeholder: null,
        unit: "plant row(s)",
        min: "1",
        step: "1",
        defaultValue: "1"
      }
    ]
  },
  { // 3
     type: QUESTION_DRIP_TAPES_PER_BED,
     text: "How many drip tapes are in each bed?",
     inputs: [
       {
         wizardInputType: INPUT_NUMBER,
         formInputType: INPUT_NUMBER,
         formLabel: "Drip tapes per bed",
         defaultFormValue: "1",
         name: "drip_tapes_per_bed",
         submitButton: {
           text: CONTINUE_BUTTON_TEXT
         },
         label: null,
         placeholder: null,
         unit: "drip tape(s)",
         min: "1",
         step: "1",
         defaultValue: "1"
       }
     ]
  },
  { // 4
    type: QUESTION_APPLICATION_RATE_AND_UNITS,
    text: "What is the application rate?",
    irrigationTypes: {drip:true, subsurface_drip:true},
    inputs: [
      {
        wizardInputType: INPUT_NUMBER_AND_RADIO,
        formInputType: INPUT_NUMBER_AND_RADIO,
        defaultFormValue: [null, UNIT_VALUE_GAL_PER_HR_PER_HUNDRED_FEET],
        formLabel: "Application Rate (and units)",
        name: "application_rate_then_units",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        numInput: {
          label: null,
          placeholder: "0",
          unit: null,
          min: "0",
          step: ".1"
        },
        radioInput: {
          choices: [
            {text: UNIT_LABEL_GAL_PER_HR_PER_HUNDRED_FEET, value: UNIT_VALUE_GAL_PER_HR_PER_HUNDRED_FEET},
            {text: UNIT_LABEL_IN_PER_HR_PER_ACRE, value: UNIT_VALUE_IN_PER_HR_PER_ACRE}
          ]
        }
      }
    ]
  },
  {
    type: QUESTION_NUMBER_OF_SETS,
    text: "How many sets are in the field?",
    inputs: [
      {
        wizardInputType: INPUT_NUMBER,
        formInputType: INPUT_NUMBER,
        formLabel: "Sets in field",
        defaultFormValue: "1",
        name: "number_of_sets",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        label: null,
        placeholder: null,
        unit: "set(s)",
        min: "1",
        step: "1",
        defaultValue: "1"
      }
    ]
  }
];
const orchardQuestions = [
  {
    type: QUESTION_IRRIGATION_SYSTEM_TYPE,
    text: "What is the field's irrigation system type?",
    inputs: [
      {
        wizardInputType: SUBMIT_BUTTON_CHOICES,
        formInputType: INPUT_RADIO_BUTTONS,
        formLabel: "Irrigation System Type",
        defaultFormValue: "",
        name: "irrigation_system_type",
        choices: [
          {text: "Drip",                    value: "drip"},
          {text: "Sprinkler",               value: "sprinkler"},
          {text: "Micro Sprinkler",         value: "microsprinkler"},
          {text: "Flood",                   value: "flood"},
          {text: "Other",                   value: "other"}
        ],
      }
    ]
  },
  {
    type: QUESTION_ORCHARD_TREE_SPACING,
    text: "What is the tree spacing?",
    inputs: [
      {
        wizardInputType: INPUT_NUMBER_2D,
        formInputType: INPUT_NUMBER_2D,
        defaultFormValue: [null, null],
        formLabel: "Tree spacing (within row x across row)",
        name: "tree_spacing_row_x_alley_width",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        dimensions: [
          {
            label: "Tree spacing",
            placeholder: "",
            unit: UNIT_LABEL_FEET,
            min: "5",
            max: "100",
            step: ".1"
          },
          {
            label: "Row spacing",
            placeholder: "",
            unit: UNIT_LABEL_FEET,
            min: "5",
            max: "100",
            step: ".1"
          }
        ]
      }
    ]
  },
  {
    type: QUESTION_APPLICATION_RATE_AND_UNITS,
    text: "What is the application rate?",
    irrigationTypes: {drip:true, sprinkler:true, microsprinkler:true},
    inputs: [
      {
        wizardInputType: INPUT_NUMBER_AND_RADIO,
        formInputType: INPUT_NUMBER_AND_RADIO,
        defaultFormValue: [null, UNIT_VALUE_GAL_PER_HR_PER_TREE],
        formLabel: "Application Rate (and units)",
        name: "application_rate_then_units",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        numInput: {
          label: null,
          placeholder: "0",
          unit: null,
          min: "0",
          step: ".1"
        },
        radioInput: {
          choices: [
            {text: UNIT_LABEL_GAL_PER_HR_PER_TREE, value: UNIT_VALUE_GAL_PER_HR_PER_TREE},
            {text: UNIT_LABEL_IN_PER_HR_PER_ACRE, value: UNIT_VALUE_IN_PER_HR_PER_ACRE}
          ]
        }
      }
    ]
  },
  {
    type: QUESTION_NUMBER_OF_SETS,
    text: "How many sets are in the field?",
    inputs: [
      {
        wizardInputType: INPUT_NUMBER,
        formInputType: INPUT_NUMBER,
        formLabel: "Sets in field",
        defaultFormValue: "1",
        name: "number_of_sets",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        label: null,
        placeholder: null,
        unit: "set(s)",
        min: "1",
        step: "1",
        defaultValue: "1"
      }
    ]
  }
];

const vineQuestions = [
  {
    type: QUESTION_IRRIGATION_SYSTEM_TYPE,
    text: "What is the field's irrigation system type?",
    inputs: [
      {
        wizardInputType: SUBMIT_BUTTON_CHOICES,
        formInputType: INPUT_RADIO_BUTTONS,
        formLabel: "Irrigation System Type",
        defaultFormValue: "",
        name: "irrigation_system_type",
        choices: [
          {text: "Drip",                    value: "drip"},
          {text: "Sprinkler",               value: "sprinkler"},
          {text: "Micro Sprinkler",         value: "microsprinkler"},
          {text: "Other",                   value: "other"}
       ],
      }
    ]
  },
  {
    type: QUESTION_VINE_SPACING,
    text: "What is the vine spacing?",
    inputs: [
      {
        wizardInputType: INPUT_NUMBER_2D,
        formInputType: INPUT_NUMBER_2D,
        defaultFormValue: [null, null],
        formLabel: "Vine spacing (within row x across row)",
        name: "tree_spacing_row_x_alley_width",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        dimensions: [
          {
            label: "Vine spacing",
            placeholder: "",
            unit: UNIT_LABEL_FEET,
            min: "5",
            max: "100",
            step: ".1"
          },
          {
            label: "Row spacing",
            placeholder: "",
            unit: UNIT_LABEL_FEET,
            min: "5",
            max: "100",
            step: ".1"
          }
        ]
      }
    ]
  },
  {
    type: QUESTION_APPLICATION_RATE_AND_UNITS,
    text: "What is the application rate?",
    irrigationTypes: {drip:true, subsurface_drip:true},
    inputs: [
      {
        wizardInputType: INPUT_NUMBER_AND_RADIO,
        formInputType: INPUT_NUMBER_AND_RADIO,
        defaultFormValue: [null, UNIT_VALUE_GAL_PER_HR_PER_TREE],
        formLabel: "Application Rate (and units)",
        name: "application_rate_then_units",
        submitButton: {
          text: CONTINUE_BUTTON_TEXT
        },
        numInput: {
          label: null,
          placeholder: "0",
          unit: null,
          min: "0",
          step: ".1"
        },
        radioInput: {
          choices: [
            {text: UNIT_LABEL_GAL_PER_HR_PER_VINE, value: UNIT_VALUE_GAL_PER_HR_PER_TREE},
          ]
        }
      }
    ]
  },
];

// const defaultQuestions = orchardQuestions;

const defaultState = {
  //TODO: think about separation of static data from variable data
  //i.e. refactor/move questions array out of this object
  //however, in Redux you only have 1 store. so everything is in this 1 state object

  answers: {},
  block: {},
  configuredBlocks: [],
  currQuestionIndex: null,
  failedToLoad: false,
  importedBlock: null,
  importedConfig: null,
  reviewedConfig: null,
  isFinished: false,
  hasJustFinished: false,
  hasReceivedOtherUsers: false,
  hasReceivedNonConfiguredBlocks: false,
  hasReceivedConfiguredBlocks: false,
  hasReceivedInitialBlockAndConfigData: false,
  isAskingSomeoneElse: false,
  isAnsweringIndividualQuestion: false,
  isInIndividualQuestionMode: false,
  isEnteringFormFromImport: false,
  isAskingImportOrFromScratch: false,
  isLoadingWizard: true,
  isSendingQuestionToUser: false,
  isSavingProgress: false,
  isRequestingConfiguredBlocks: false,
  isRequestingNonConfiguredBlocks: false,
  irrigationConfig: {},
  nonConfiguredBlocks: [],
  otherUsers: [],
  startingFromScratch: false,
  fooIsValid: false,
  questions: [],
  questionLeftOffAt: null,
  hadPreviouslyFinished: false,
  unsupportedCropClass: false
};

//reducer (must be pure function):
//ES7 spread operator "..." docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator
const irrigationConfigWizard = (state=defaultState, action) => {
  switch (action.type) {
    case BEGIN_IRRIGATION_CONFIG_WIZARD_WITH_CHOICE:
      return {
        ...state,
        // answers: {},
        isAskingImportOrFromScratch: true,
        isFinished: false,
        isLoadingWizard: false,
        isAnsweringIndividualQuestion: false,
        isAskingIfUserWantsToPickUpWhereTheyLeftOff: false
      }

    case BEGIN_IRRIGATION_CONFIG_FROM_SCRATCH:
      return {
        ...state,
        answers: {},
        importedBlock: null,
        isAskingImportOrFromScratch: false,
        startingFromScratch: true,
        currQuestionIndex: 0,
        reviewedConfig: null,
        importedConfig: null,
        isLoadingWizard: false,
        isAskingIfUserWantsToPickUpWhereTheyLeftOff: false,
        questionLeftOffAt: null,
        hadPreviouslyFinished: false
      }

    case BEGIN_IRRIGATION_CONFIG_FROM_IMPORT:
      return {
        ...state,
        answers: action.answers,
        block: action.block,
        currQuestionIndex: null,
        startingFromScratch: false,
        importedBlock: action.importedBlock,
        importedConfig: action.importedConfig,
        isAskingImportOrFromScratch: false,
        isEnteringFormFromImport: true,
        isFinished: false,
        isLoadingWizard: false,
        reviewedConfig: null,
        isAskingIfUserWantsToPickUpWhereTheyLeftOff: false,
        questionLeftOffAt: null,
        hadPreviouslyFinished: false
      }

    case ASK_IF_USER_WANTS_TO_PICK_UP_WHERE_THEY_LEFT_OFF:
      return {
        ...state,
        isLoadingWizard: false,
        isFinished: false,
        isAnsweringIndividualQuestion: false,
        isAskingIfUserWantsToPickUpWhereTheyLeftOff: true,
        questionLeftOffAt: state.irrigationConfig.ui_wizard_state.currQuestionIndex,
        hadPreviouslyFinished: state.irrigationConfig.ui_wizard_state.isFinished
      }

    case BEGIN_IRRIGATION_CONFIG_FOR_INDIVIDUAL_QUESTION:
      return {
        ...state,
        answers: action.answers,
        isAnsweringIndividualQuestion: true,
        isInIndividualQuestionMode: true,
        block: action.block,
        individualQuestionIndex: action.questionIndex,
        isLoadingWizard: false,
        irrigationConfig: action.irrigationConfig
      }

    case CLEAR_CURRENT_BLOCK_AND_IRRIGATION_CONFIG_DATA:
      return {
        ...state,
        isFinished: false,
        block: {},
        irrigationConfig: {},
        hasReceivedInitialBlockAndConfigData: false,
      }

    case REQUEST_BLOCK_AND_IRRIGATION_CONFIG_DATA:
      return {
        ...state,
        isLoadingWizard: true,
        unsupportedCropClass: false
      }

    case RECEIVE_BLOCK_AND_IRRIGATION_CONFIG_DATA:
      return {
        ...state,
        block: action.block,
        irrigationConfig: action.irrigationConfig,
        hasReceivedInitialBlockAndConfigData: true,
        isLoadingWizard: false,
        failedToLoad: false,
        questions: action.questions
      }

    case FAILED_TO_RECEIVE_BLOCK_AND_IRRIGATION_CONFIG_DATA:
      return {
        ...state,
        isLoadingWizard: false,
        failedToLoad: true
      }

    case RECEIVED_BLOCK_OF_UNSUPPORTED_CROP_CLASS:
      return {
        ...state,
        isLoadingWizard: false,
        failedToLoad: true,
        unsupportedCropClass: true
      }

    case REQUEST_USERS_FOR_ASKING_QUESTIONS:
      return {
        ...state,
        hasReceivedOtherUsers: false,
        otherUsers: []
      }

    case RECEIVE_USERS_FOR_ASKING_QUESTIONS:
      return {
        ...state,
        hasReceivedOtherUsers: true,
        otherUsers: action.users
      }

    case RECORD_IRRIGATION_CONFIG_ANSWER:
      const isAnswered = typeof action.answer !== 'undefined' && typeof action.answer !== null;
      let prevAnswerInfo = state.answers[action.questionIndex];
      let prevAnswerValues = prevAnswerInfo ? prevAnswerInfo.inputs : {};
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionIndex]: {
            isAnswered: isAnswered,
            isHandled: isAnswered,
            isMarkedAsNotKnown: false,
            isSentToOtherUser: false,
            questionType: state.questions[action.questionIndex].type,
            inputs: {
              ...prevAnswerValues,
              [action.inputName]: action.answer
            },
            isValid: true
          }
        },
        isSavingProgress: action.willSaveProgress
      }

    case IRRIGATION_CONFIG_WIZARD_ANSWER_VALIDITY_CHANGED:
      return {
        ...state,
        fooIsValid: !state.fooIsValid
        // answers: {
        //   ...state.answers,
        //   [action.questionIndex]: {
        //     ...state.answers[action.questionIndex],
        //     isValid: action.isValid
        //   }
        // }
      }

    case ADVANCE_TO_NEXT_IRRIGATION_CONFIG_QUESTION:
      const isLastQuestion = state.currQuestionIndex !== null && state.currQuestionIndex === state.questions.length-1;
      const nextQuestionIndex = isLastQuestion ? null : state.currQuestionIndex + 1;
      return {
        ...state,
        currQuestionIndex: state.isAnsweringIndividualQuestion ? null : nextQuestionIndex,
        hasJustFinished: state.isAnsweringIndividualQuestion || isLastQuestion,
        isSendingQuestionToUser: false,
        userReceivingQuestion: null,
        isAnsweringIndividualQuestion: false,
        individualQuestionIndex: null
      }

    case BEGIN_SAVING_IRRIGATION_CONFIG_WIZARD_PROGRESS:
      return {
        ...state,
        isSavingProgress: true
      }

    case SAVED_IRRIGATION_CONFIG_WIZARD_PROGRESS:
      return {
        ...state,
        isSavingProgress: false
      }

    case MARK_IRRIGATION_CONFIG_QUESTION_AS_NOT_KNOWN_BY_USER:
        return {
          ...state,
          answers: {
            ...state.answers,
            [action.questionIndex]: {
              isAnswered: false,
              isHandled: true,
              isSentToOtherUser: false,
              isMarkedAsNotKnown: true,
              value: null
            }
          }
        }

    case SEND_USER_IRRIGATION_CONFIG_QUESTION:
      return {
        ...state,
        answers: {
          ...state.answers,
          [state.currQuestionIndex]: {
            isAnswered: false,
            isHandled: true,
            isSentToOtherUser: true,
            // sentOn: Date.now().getUTCSeconds(),
            sentToUserId: action.userId,
            value: null,
            isMarkedAsNotKnown: false
          }
        },
        isAskingSomeoneElse: false,
        isSendingQuestionToUser: true,
        userReceivingQuestion: action.user
      }

    case SUBMIT_FORM_FROM_IMPORTED_IRRIGATION_CONFIG:
      return {
        ...state,
        hasJustFinished: true,
        reviewedConfig: action.results,
        isEnteringFormFromImport: false
      }

    case FINISH_IRRIGATION_CONFIG:
      return {
        ...state,
        hasJustFinished: false,
        isFinished: true,
        hasBegan: false
      }

    case GO_BACK_TO_PREVIOUS_QUESTION:
      return {
        ...state,
        currQuestionIndex: state.currQuestionIndex - 1
      }

    case BEGIN_TO_ASK_SOMEONE_IRRIGATION_CONFIG_QUESTION:
      return {
        ...state,
        isAskingSomeoneElse: true
      }

    case CANCEL_ASKING_SOMEONE_IRRIGATION_CONFIG_QUESTION:
      return {
        ...state,
        isAskingSomeoneElse: false
      }


    case REQUEST_BLOCKS_NEEDING_IRRIGATION_CONFIG:
      return {
        ...state,
        hasReceivedNonConfiguredBlocks: false,
        isRequestingNonConfiguredBlocks: true,
        nonConfiguredBlocks: []
      }

    case RECEIVE_BLOCKS_NEEDING_IRRIGATION_CONFIG:
      return {
        ...state,
        isRequestingNonConfiguredBlocks: false,
        hasReceivedNonConfiguredBlocks: true,
        nonConfiguredBlocks: action.blocks
      }

    case REQUEST_BLOCKS_WITH_COMPLETED_IRRIGATION_CONFIG:
      return {
        ...state,
        hasReceivedConfiguredBlocks: false,
        isRequestingConfiguredBlocks: true,
        configuredBlocks: []
      }

    case RECEIVE_BLOCKS_WITH_COMPLETED_IRRIGATION_CONFIG:
      return {
        ...state,
        hasReceivedConfiguredBlocks: true,
        isRequestingConfiguredBlocks: false,
        configuredBlocks: action.blocks
      }

    case REQUEST_IMPORTED_IRRIGATION_CONFIG:
    case RECEIVE_IMPORTED_IRRIGATION_CONFIG:
    default:
      return state;
  }
}

/*
 *
 * react/components/irrigation-configuration-wizard.js
 * +
 * react/containers/irrigation-configuration-wizard.js
 *
 */
///

class ButtonChoiceInput extends Component {
  render() {
    const { props } = this;
    let className = "btn btn-default wizard-input-button-choice";
    if( typeof props.size === "string") {
      className += " " + props.size;
    }
    const margin = typeof props.margin === 'string' ?
      'margin-'+props.margin : 'margin-top';
    let children = props.children;
    if(!children) {
      children = props.text ? props.text : props.value
    }
    return (
      <div className={"text-center "+margin}>
        <button
          className={className}
          onClick={() => props.onClick(props.value)}
        >
          {children}
        </button>
      </div>
    )
  }
}

class SubmitButton extends Component {
  render() {
    const { props } = this;
    const enabled = ('enabled' in props) ? props.enabled : true
    return (
      <div className="padding-top">
        <button
          disabled={!enabled}
          className="btn btn-primary btn-lg wizard-continue-btn"
          onClick={props.onSubmitButtonClick}
        >
          {props.buttonText}{" "}
          <i className="fa fa-lg fa-chevron-right inline-margin-left" />
        </button>
      </div>
    )
  }
}

class NumberAndRadioInput extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.getValues = this.getValues.bind(this);
    this.setNumValue = this.setNumValue.bind(this);
    this.setRadioValue = this.setRadioValue.bind(this);
    this.getInitialValue  = this.getInitialValue.bind(this);
    this.getInitialNumValue  = this.getInitialNumValue.bind(this);
    this.getInitialRadioValue  = this.getInitialRadioValue.bind(this);
    this.numValue = this.getInitialNumValue();
    this.isValid = false;
    this.radioValue = null;
    this.getResult  = this.getResult.bind(this);
    this.checkIsValid = this.checkIsValid.bind(this);
    this.setValidity = this.setValidity.bind(this);
  }
  submit() {
    const { props } = this;
    props.onSubmit(this.getValues());
  }
  checkIsValid() {
    const { props } = this;
    const values = this.getValues();
    for(let i=0, count=values.length; i<count; ++i) {
      let val = values[i];
      if(val === "" || val === null) {
        return false;   //invalid
      }
    }
    return true;        //valid
  }
  getResult() {
    //alias for getValues()
    return this.getValues();
  }
  getValues() {
    return [this.numValue, this.radioValue]
  }
  setNumValue(value) {
    this.numValue = value;        //sets input value
    this.setValidity()
  }
  setRadioValue(value) {
    this.radioValue = value;      //sets input value
    this.setValidity()
  }
  setValidity() {
    const { props } = this;
    const isValidAfter = this.checkIsValid()
    if(this.isValid !== isValidAfter) {
      this.isValid = isValidAfter
      if(props.onValidityChange)  props.onValidityChange(isValidAfter);
    }
  }
  getInitialValue(index) {
    const { props } = this;
    if(props.initialValues && props.initialValues.length == 2) {
      return props.initialValues[index];
    }
    return ""
  }
  getInitialNumValue() {
    return this.getInitialValue(0)
  }
  getInitialRadioValue() {
    return this.getInitialValue(1)
  }
  render() {
    const { props } = this;
    let submitButton;
    if(props.submitButton) {
      submitButton =
        <div className="margin-top">
          <SubmitButton
            ref={(ref) => this.submitButton = ref}
            enabled={this.isValid}
            buttonText={props.submitButton.text}
            onSubmitButtonClick={this.submit} />
        </div>
    }
    const numInput = props.numInput;
    const radioInput = props.radioInput;
    const initialRadioValue = this.getInitialRadioValue();
    return (
      <div className="form-inline wizard-answer-input-wrapper input-number-and-radio-wrapper">
        <NumberInput
          {...props /*TODO: don't pass down all props from parent to child elem! */}
          submitButton={false}
          min={numInput.min}
          step={numInput.step}
          unit={numInput.unit}
          name={props.name ? props.name+"[0]" : ""}
          initialValue={this.getInitialNumValue()}
          onChange={(value) => this.setNumValue(value)}
          onValidityChange={false} />
        {" "}
        <span className="radio radio-wrapper text-center">
          {radioInput.choices.map(choice =>
            <label key={choice.value}
              className="text-left"
              style={{paddingLeft: 15}}
            >
              <input
                type="radio"
                name={props.name ? props.name : ""}
                defaultValue={choice.value}
                ref={(ref) => {
                  if(ref && choice.value == initialRadioValue) {
                    ref.checked = true;
                    this.setRadioValue(choice.value);
                  }
                }}
                onClick={() => this.setRadioValue(choice.value)}/> {choice.text}
            </label>
          )}
        </span>
        {submitButton}
      </div>
    )
  }
}

class NumberInput2D extends Component {
  constructor(props) {
    super(props);
    this.getValues        = this.getValues.bind(this);
    this.getInputs        = this.getInputs.bind(this);
    this.submit           = this.submit.bind(this);
    this.getInitialValue  = this.getInitialValue.bind(this);
    this.getInitialValues = this.getInitialValues.bind(this);
    this.getResult        = this.getResult.bind(this);
    this.checkIsValid = this.checkIsValid.bind(this);
    this.setValidity = this.setValidity.bind(this);
    this.isValid = false;
  }
  checkIsValid() {
    const { props } = this;
    const values = this.getValues();
    for(let i=0, count=values.length; i<count; ++i) {
      let val = values[i];
      if(val === "" || val === null) {
        return false;   //invalid
      }
    }
    return true;        //valid
  }
  setValidity() {
    const { props } = this;
    const isValidAfter = this.checkIsValid()
    if(this.isValid !== isValidAfter) {
      this.isValid = isValidAfter
      if(props.onValidityChange)  props.onValidityChange(isValidAfter);
    }
  }
  getResult() {
    //alias for getValues()
    return this.getValues();
  }
  submit() {
    const { props } = this;
    props.onSubmit(this.getValues());
  }
  getInputs() {
    return [this['input0'], this['input1']];
  }
  getValues() {
    if('input0' in this && 'input1' in this) {
      return this.getInputs().map(input => input.value);
    } else {
      return this.getInitialValues()
    }
  }
  getInitialValue(index) {
    const { props } = this;
    if(props.initialValues && props.initialValues.length == 2) {
      return props.initialValues[index];
    }
    return ""
  }
  getInitialValues() {
    return [null,null].map((_item,i) => this.getInitialValue(i))
  }
  render() {
    const { props } = this;
    let submitButton;
    if(props.submitButton) {
      submitButton =
        <div className="margin-top">
          <SubmitButton
            ref={(ref) => this.submitButton = ref}
            enabled={this.isValid}
            buttonText={props.submitButton.text}
            onSubmitButtonClick={() => this.submit()} />
        </div>
    }
    return (
      <div className="form-inline form-control-line-height wizard-answer-input-wrapper input-number-2d-wrapper">
        {props.dimensions.map( (dim,i) => //for each dimension (2 for 2d)
          <span key={i}>
            <span style={{display: "inline-block"}}>
              {dim.label &&
              <div>
                <label>{dim.label}</label>
              </div>
              }
              <input className="form-control input-number-2d wizard-number-input"
                ref={(ref) => this['input'+i] = ref}
                onChange={() => this.setValidity()}
                name={props.name ? props.name+'['+i+']' : ""}
                placeholder={dim.placeholder}
                type="number"
                min={dim.min}
                max={dim.max}
                defaultValue={this.getInitialValue(i)}
                step={dim.step} />
              <span>{dim.unit}</span>
            </span>
            {i === 0 &&
            <em className="bold" style={{display: "inline-block", margin: "0 15px"}}>
              x
            </em>
            }
          </span>
        )}
        {submitButton}
      </div>
    )
  }
}

class NumberInput extends Component {
  constructor(props) {
    super(props);
    this.numInput   = null;
    this.submit     = this.submit.bind(this);
    this.getResult  = this.getResult.bind(this);
    this.checkIsValid    = this.checkIsValid.bind(this);
    this.setValidity = this.setValidity.bind(this);
    this.isValid = false;
  }
  checkIsValid() {
    let val = this.getResult();
    if(val === "" || val === null) {
      return false      //invalid
    }
    return true;        //valid
  }
  setValidity() {
    const { props } = this;
    const isValidAfter = this.checkIsValid()
    if(this.isValid !== isValidAfter) {
      this.isValid = isValidAfter
      if(props.onValidityChange)  props.onValidityChange(isValidAfter);
    }
  }
  getResult() {
    const { props } = this;
    return this.numInput ? this.numInput.value : props.initialValue
  }
  submit() {
    const { props } = this;
    props.onSubmit(this.getResult())
  }
  render() {
    const { props } = this;
    const unit = props.unit ? <span style={{paddingLeft: 15}}>{props.unit}</span> : null;

    let submitButton;
    if(props.submitButton) {
      submitButton =
        <div className="margin-top">
          <SubmitButton
            ref={ref => this.submitButton = ref}
            enabled={this.isValid}
            buttonText={props.submitButton.text}
            onSubmitButtonClick={this.submit} />
        </div>
    }

    return (
      <span className="form-inline">
        <input
          ref={(ref) => this.numInput = ref}
          className="form-control wizard-number-input"
          onChange={(e) => {
            this.setValidity()
            if(props.onChange) {
              props.onChange(e.target.value);
            }
          }}
          name={props.name ? props.name : ""}
          placeholder={props.placeholder}
          defaultValue={props.initialValue}
          type="number"
          min={props.min}
          max={props.max}
          step={props.step} />
        {unit}
        {submitButton}
      </span>
    )
  }
}

class IrrigationConfigQuestionInput extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }
  submit(answer) {
    const { props } = this;
    props.answer(props.questionIndex, props.name, answer)
  }
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    switch(props.wizardInputType) {
      case SUBMIT_BUTTON_CHOICES:
        return (
          <div className="wizard-answer-input-wrapper text-center input-button-choices-wrapper">
            {props.choices.map(choice => //each choice for a question's input:
              <ButtonChoiceInput
                key={choice.value}
                size="sm"
                value={choice.value}
                text={choice.text}
                onClick={this.submit} />
            )}
          </div>
        )
      case INPUT_NUMBER_2D:
        return (
          <NumberInput2D
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            dimensions={props.dimensions}
            onSubmit={this.submit} />
        )
      case INPUT_NUMBER:
        return (
          <NumberInput
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            onSubmit={this.submit} />
        )
      case INPUT_NUMBER_AND_RADIO:
        return (
          <NumberAndRadioInput
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            onSubmit={this.submit} />
        )
      default:
        return <span className="text-error"> Invalid question input type</span>
    }
  }
}

class IrrigationConfigFormInput extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.getResult = this.getResult.bind(this);
    this.input = null;
  }
  submit(answer) {
    const { props } = this;
    const result = this.getResult();
    props.answer(props.questionIndex, props.name, result)
  }
  getResult() {
    const result = this.input.getResult();
    return result;
  }
  render() {
    const { props } = this;
    switch(props.formInputType) {
      case INPUT_NUMBER_2D:
        return (
          <NumberInput2D
            ref={(ref) => this.input = ref}
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            dimensions={props.dimensions}
            submitButton={false}
            name={props.name}
            initialValues={props.initialValue} />
        )
      case INPUT_NUMBER:
        return (
          <NumberInput
            ref={(ref) => this.input = ref}
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            submitButton={false}
            name={props.name}
            initialValue={props.initialValue} />
        )
      case INPUT_NUMBER_AND_RADIO:
        return (
          <NumberAndRadioInput
            ref={(ref) => this.input = ref}
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            submitButton={false}
            name={props.name}
            initialValues={props.initialValue} />
        )
      case INPUT_RADIO_BUTTONS:
        return (
          <RadioInputs
            ref={(ref) => this.input = ref}
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            choices={props.choices}
            submitButton={false}
            name={props.name}
            initialValue={props.initialValue} />
        )
      default:
        return <span className="text-error"> Invalid review input type</span>
    }
  }
}

class WizardProgress extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    return (
      <span className="label label-info label-lg">
        <strong>{props.questionNumber}</strong>
        <span className="fw-normal">
          {" "}of{" "}
          {props.totalQuestionsCount}
        </span>
      </span>
    )
  }
}

class IrrigationConfigQuestion extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible || !props.question)  return noHtml;

    const isProgressVisible = !('hideProgress' in props);

    return (
      <div className="row wizard-question irrig-config-wizard-question text-center">
        <div className="col-xs-12">
          <WizardProgress
            isVisible={isProgressVisible}
            questionNumber={props.questionNumber}
            totalQuestionsCount={props.totalQuestionsCount} />
          <h3 className="wizard-question-heading">{props.question.text}</h3>
          {props.question.inputs.map((inputInfo,i) =>  //each input for a question:
            <IrrigationConfigQuestionInput
              {...inputInfo}
              isVisible={props.showQuestionInputs}
              questionIndex={props.questionIndex}
              inputIndex={i}
              answer={props.answer}
              onValidityChange={(isValid) => props.inputValidityChanged(props.questionIndex,i,isValid)}
              key={props.question.type} />
          )}
        </div>
      </div>
     )
  }
}

const mapStateToIrrigationConfigQuestionProps = (state, ownProps) => {
  const questionIndex = ownProps.questionIndex;
  let question = (state.questions && state.questions.length) ?
      state.questions[questionIndex] : null;
  return {
    question: question,
    questionNumber: questionIndex + 1,
    totalQuestionsCount: state.questions.length
  };
};

const mapDispatchToIrrigationConfigQuestionProps = (dispatch) => {
  return {
    answer: (qIndex,inputName,answer) => dispatch(
      answerIrrigationConfigQuestion(qIndex,inputName,answer)
    )
  };
};
const IrrigationConfigQuestionContainer = connect(
  mapStateToIrrigationConfigQuestionProps,
  mapDispatchToIrrigationConfigQuestionProps
)(IrrigationConfigQuestion);

// const mapDispatchToIndividualIrrigationConfigQuestionProps = (dispatch) => {
//   return {
//     answer: (qIndex,inputName,answer) => dispatch(
//       answerIndividualIrrigationConfigQuestion(qIndex,inputName,answer)
//     )
//   };
// };
// const individualIrrigationConfigQuestion = connect(
//   mapStateToIrrigationConfigQuestionProps,
//   mapDispatchToIndividualIrrigationConfigQuestionProps
// )(individualIrrigationConfigQuestion);

class IrrigationConfigWizardHeader extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    const mapButtonTooltip = (
      <Tooltip id="irrigation-config-show-on-map-tooltip">
        This will open the field on the map in a new browser window or tab.
        (You may have to disable your popup blocker first.)
      </Tooltip>
    )

    return (
      <header className="row wizard-header irrig-config-wizard-header margin-bottom">
        <div className="col-sm-6">
          <h2 className="heading-mb">
            <strong>{props.blockName}</strong>{" "}
            <OverlayTrigger placement="bottom" overlay={mapButtonTooltip}>
            </OverlayTrigger>
          </h2>
          <h4 className="heading-mb">
            <i className="fa fa-fw fa-map-signs inline-margin-right" aria-hidden="true"></i>
            {props.ranchName}
            {/*<span className="inline-margin-sides">{" "}</span>*/}
            {/*{" "}*/}
            <i className="fa fa-fw fa-leaf inline-margin-sides" aria-hidden="true" />
            {props.cropType}
          </h4>
        </div>
        <div className="col-sm-6 text-right">
          {/*<h3 className="wizard-title-heading heading-mb">Irrigation Configuration</h3>*/}
          <div className="heading-mb">
            <span className="label label-info label-lg">Irrigation Configuration</span>
          </div>

          <WizardBackButton currIndex={props.currQuestionIndex} onClick={props.goBack}/>
        </div>
      </header>
     )
  }
}

class WizardBackButton extends Component {
  render() {
    const { props } = this;
    let button;
    if(props.currIndex) {
      button = <button className="btn btn-sm btn-default"
          onClick={props.onClick}>
         <i className="fa fa-lg fa-chevron-left inline-margin-right" />
         {" "}
         Back
      </button>
    }
    return (
      <span>{button}</span>
    )
  }
}

class FailureToLoadScreen extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    const msg = props.unsupportedCropClass ? " \
      We were unable to load the wizard to configure irrigation for the requested field. \
      This wizard currently only supports orchard and row crops. \
    " : //load general failure message:
      " \
      We were unable to load the wizard to configure irrigation for the requested field. \
      You may not have access to this field or the field may not be paid for under our Irrigation Advisor product. \
    ";

    return (
      <div className="text-left alert alert-danger">
        <i className="fa fa-2x fa-exclamation-circle icon-red pull-left inline-margin-right" />
        <div>{msg}</div>
      </div>
    )
  }
}

class LoadingScreen extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    return (
      <div className="text-center margin-top-double margin-bottom-double">
        <i className="fa fa-2x fa-circle-o-notch fa-spin" />
      </div>
    )
  }
}

class AskSomeoneElseAQuestionButton extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    return (
      <button className="wizard-footer-button wizard-ask-someone-else-btn margin-top btn btn-sm btn-default" onClick={props.onClick}>
         Ask someone to answer this for me
         {" "}
         <i className="fa fa-lg fa-share-square-o inline-margin-left" aria-hidden="true" />
      </button>
    )
  }
}

class IDontKnowButton extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    const tooltip = (
      <Tooltip id="irrigation-wizard-idk-tooltip">Click to continue to the next question.</Tooltip>
    )

    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <button className="wizard-footer-button wizard-idk-btn margin-top btn btn-sm btn-default" onClick={props.onClick}>
           I don't know
        </button>
      </OverlayTrigger>
    )
  }
}

class WizardFooter extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    return (
      <div className="row margin-top">
        <div className="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 ask-someone-else-btn-wrapper text-center margin-top margin-bottom padding-top">
          {/*TODO: these prolly only need a button or Button component - likely now extraneous abstraction */}
          <IDontKnowButton
            onClick={() => props.onIDontKnowButtonClick(props.currQuestionIndex)} />
          <span className="inline-margin-sides">{" "}</span>
          <AskSomeoneElseAQuestionButton
            onClick={props.onAskSomeoneElseButtonClick} />
        </div>
      </div>
    )
  }
}

// const Icon = (props) => {
//   let className = "fa"
//   return (
//     <i className="fa fa-lg fa-share-square-o inline-margin-left" aria-hidden="true" />
//   )
// }

class AskSomeoneElseAQuestionPanel extends Component {
  render() {
    const { props } = this;

    let domToRender = noHtml;
    if(props.isAskingSomeoneElse || props.isSendingQuestionToUser) {
      let panelBody = noHtml;
      if(props.isAskingSomeoneElse) {
        panelBody = (
          <span>
            {props.otherUsers.map( (user) => {//each choice for a question's input:
              let label = user.isFarmAdvisor ? <small> ({user.companyName})</small> : noHtml
              return (
                <ButtonChoiceInput
                  {...props /*TODO: don't pass down all props from parent to child elem! */}
                  margin="bottom"
                  choice={user.id}
                  key={user.id}
                  size="lg"
                  onClick={() => props.onChooseUser(user)}
                >
                  {user.fullName}
                  {label}
                </ButtonChoiceInput>
              )
            })}
            <div key="cancel-button" className="margin-top">
              <Button onClick={props.cancelAskingSomeone}>Cancel</Button>
            </div>
          </span>
        )
      }

      domToRender = (
        <div className="ask-someone-else-wrapper text-center">
          <Panel header={ASK_SOMEONE_ELSE_HEADING_TEXT} bsStyle="info">
            <div className="ask-someone-else-user-choices">
              <LoadingScreen isVisible={!props.hasReceivedOtherUsers || props.isSendingQuestionToUser}/>
              {panelBody}
            </div>
          </Panel>
        </div>
      )
    }

    return (
      <span>{domToRender}</span>
    )
  }
}

class ConfigureAnotherFieldProposition extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    return (
      <div className="margin-bottom">
        <h3>Want to configure irrigation for another field?</h3>
        {props.blocks.map((block,i) => //each choice for a question's input:
          <ButtonChoiceInput
            choice={block.id}
            text={block.name}
            key={block.id}
            size="lg"
            onClick={() => props.onChooseBlock(block.id)}/>
        )}
        {props.children}
      </div>
    )
  }
}

class IrrigationConfigFinishedScreen extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    const successMessage = (!props.isInIndividualQuestionMode) ?
      <span>
        Thanks, you're all done with <strong>{props.blockName}</strong>'s irrigation Configuration!
      </span>
        : <span>Thanks, you're all done!</span>;

    return (
      <div className="text-center margin-top margin-bottom">
        <div className="alert alert-success">{successMessage}</div>
        <ConfigureAnotherFieldProposition
          onChooseBlock={(nextBlockId) => props.beginConfigForAnotherBlock(nextBlockId)}
          blocks={props.nonConfiguredBlocks}
          isVisible={props.showAnotherFieldProposition}
        >
          <Button
            href="/"
            bsStyle="default"
            className="margin-top wizard-input-button-choice lg"
          >
            No thanks, take me to the map overview
          </Button>
        </ConfigureAnotherFieldProposition>
        <div className={props.showTakeMeToMapOverviewButton ? " " : "hidden"}>
          <Button
            href="/"
            bsStyle="default"
            className="wizard-input-button-choice lg"
          >
            Take me to the map overview
          </Button>
        </div>
        <span>{noHtml}</span>
      </div>
    )
  }
}

class AskIfUserWantsToPickUpWhereTheyLeftOffScreen extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    let alert = noHtml;
    if(props.hadPreviouslyFinished) {
      alert =
        <div className="alert alert-success nomargin">
          Congrats! You've already configured irrigation for this field.
        </div>
    }
    else if(props.questionLeftOffAt) {
      alert =
        <div className="alert alert-info nomargin">
          You already started configuring irrigation for this field.
          {/*You previously left off at {props.questionLeftOffAt}.*/}
        </div>
    }
    let alertWrapper = noHtml;
    if(props.hadPreviouslyFinished || props.questionLeftOffAt) {
      alertWrapper =
        <div className="col-sm-8 col-sm-offset-2 margin-bottom padding-bottom">{alert}</div>
    }

    return (
      <div className="row text-center margin-top margin-bottom">
        {alertWrapper}
        <div className="col-sm-4 col-sm-offset-2 margin-bottom">
          <Button
            block
            onClick={props.onChooseToPickUpWhereTheyLeftOff}
            >
            {/*<h3 className="button-heading">Pick up where I left off</h3>
            <h6 className="button-subheading">(question {props.questionLeftOffAt})</h6>*/}
            <h3 className="button-heading">Use existing values</h3>
            <h6 className="button-subheading">already entered</h6>
          </Button>
        </div>
        <div className="col-sm-4 margin-bottom">
          <Button
            block
            onClick={props.onChooseToStartFromScratch}
          >
            <h3 className="button-heading">Begin</h3>
            <h6 className="button-subheading">from scratch</h6>
          </Button>
        </div>
      </div>
    )
  }
}

class ImportOrFromScratchScreen extends Component {
  render() {
    const { props } = this;
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    if(!isVisible)  return noHtml;

    return (
      <div className="row text-center margin-top margin-bottom">
        <div className="col-sm-4 col-sm-offset-4 margin-bottom">
          <Button
            block
            bsStyle="default"
            onClick={props.onChooseToStartFromScratch}
          >
            <h3 className="button-heading">Begin</h3>
            <h6 className="button-subheading">from scratch</h6>
          </Button>
        </div>
        <div className="col-sm-12">
          <strong><em>...or</em></strong>
          <h3 className="button-heading">Import configuration from one of these configured fields:</h3>
          {props.blocks.map((block,i) => //each choice for a question's input:
            <ButtonChoiceInput
              choice={block.id}
              text={block.name}
              key={block.id}
              size="lg"
              onClick={() => props.onChooseToImport(block)}/>
          )}
        </div>
      </div>
    )
  }
}

class RadioInput extends Component {
  render() {
    const { props } = this;
    const className = "fw-normal "
    return (
      <label className={props.block ? className+"radio-wrapper-label" : className}>
        <input type="radio"
          name={props.name}
          defaultValue={props.value}
          onClick={() => {
            if(!props.onClick) return;
            props.onClick(props.value)
          }}
          ref={(ref) => {
            if(ref && props.checked === true) {
              ref.checked = true;
            }
          }} />
        <span className="inline-margin-right">{" "}</span>
        {props.children ? props.children : props.text}
      </label>
    )
  }
}

class RadioInputs extends Component {
  constructor(props) {
    super(props);
    this.result = props.initialValue;
    // this.submit = this.submit.bind(this);
    this.getResult = this.getResult.bind(this);
    this.setResult = this.setResult.bind(this);
  }
  getResult() {
    return this.result
  }
  setResult(result) {
    this.result = result;
  }
  render() {
    const { props } = this;
    return (
      <div className="radio-inputs-wrapper">
        {props.choices.map((choice) =>
          <RadioInput
            key={choice.value}
            onClick={() => {this.setResult(choice.value)}}
            block={true}
            value={choice.value}
            name={props.name}
            checked={props.initialValue===choice.value}>
            {choice.text}
          </RadioInput>
        )}
      </div>
    )
  }
}

class FancyLabel extends Component {
  render() {
    const { props } = this;
    let className = "fancy-label margin-bottom ";
    if(props.labelStyle==='info') {
      className += "fancy-label-info"
    }
    return (
      <div className={className}>
        <label>{this.props.children}</label>
      </div>
    )
  }
}

class IrrigationConfigForm extends Component {
  /* This component can be used as the form to review imported data, or as a form elsewhere to fill in the values */
  constructor(props) {
    super(props);
    this.form = null;
    this.inputs = [];
    this.submit = this.submit.bind(this);
    this.getInitialInputValue = this.getInitialInputValue.bind(this)
  }
  getInitialInputValue(inputInfo) {
    const { props } = this;

    let answer  = props.importedValues ? props.importedValues[inputInfo.name] : null;
    answer      = (answer === null || answer === "") ? inputInfo.defaultFormValue : answer;
    return answer
  }
  submit() {
    const { props } = this;
    let results = {};
    for (var key of Object.keys(this.inputs)) {
      const input = this.inputs[key];
      results[input.props.name] = input.getResult()
    }
    props.onSubmit(results)
  }
  render() {
    const { props } = this;
    this.inputs = [];
    const isVisible = ('isVisible' in props) ? props.isVisible : true;
    const showSubmitButton = ('submitButton' in props);
    if(!isVisible)  return noHtml;

    const showQuestionNumbers = ('showQuestionNumbers' in props);
    const submitButton = showSubmitButton ?
      <div className="text-right">
        <SubmitButton
          buttonText={CONTINUE_BUTTON_TEXT}
          onSubmitButtonClick={(e) => {
            this.submit();
            e.preventDefault();   return false;
          }} />
      </div>
        : noHtml;

    return (
      <div className="row">
        <div className="col-xs-12">
          <form id="import-form"
            ref={(ref) => this.form = ref}
            onSubmit={(e) => {e.preventDefault();  return false; }}
          >
            {props.questions.map((question,i) => {
              // const importedAnswerInfo = props.answers ? props.answers[i] : {};
              return (
                <div className="form-group" key={question.type}>
                  {question.inputs.map((inputInfo,j) =>  //each input for a question:
                    <span key={question.type}>
                      <FancyLabel labelStyle="info">
                        {showQuestionNumbers ? (i+1)+". " : ""}
                        {inputInfo.formLabel}
                      </FancyLabel>
                      <div style={{padding: '0px 15px'}}>
                        <IrrigationConfigFormInput
                          {...props /*TODO: don't pass down all props from parent to child elem! */}
                          ref={(ref) => this.inputs.push(ref)}
                          questionIndex={i}
                          initialValue={this.getInitialInputValue(inputInfo)}
                          {...inputInfo} />
                      </div>
                    </span>
                  )}
                </div>
              )
            })}
            {submitButton}
          </form>
        </div>
      </div>
    )
  }
}

//our container:
class IrrigationConfigWizardApp extends Component {
  render() {
    const { props } = this;
    return (
      <div className="wizard-container">
        <IrrigationConfigWizardHeader
          {...props /*TODO: don't pass down all props from parent to child elem! */}
          isVisible={props.showHeader}/>
        <main>
          <span>
            {props.questions.map( (question, i) =>
              <IrrigationConfigQuestionContainer
                {...props /*TODO: don't pass down all props from parent to child elem! */}
                questionIndex={i}
                isVisible={props.currQuestionIndex === i}
                key={question.type} />
            )}
          </span>
          <IrrigationConfigQuestionContainer
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            hideProgress
            questionIndex={props.individualQuestionIndex}
            isVisible={props.isAnsweringIndividualQuestion} />
          <AskSomeoneElseAQuestionPanel
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            onChooseUser={(user) => props.sendUserQuestion(user)} />
          <ImportOrFromScratchScreen
            onChooseToImport={(fromBlock) => props.chooseToImport(fromBlock)}
            onChooseToStartFromScratch={props.chooseToStartFromScratch}
            isVisible={props.showImportOrFromScratchScreen}
            blocks={props.configuredBlocks} />
          <AskIfUserWantsToPickUpWhereTheyLeftOffScreen
            isVisible={props.showAskIfUserWantsToPickUpWhereTheyLeftOffScreen}
            questionLeftOffAt={props.questionLeftOffAt}
            hadPreviouslyFinished={props.hadPreviouslyFinished}
            onChooseToPickUpWhereTheyLeftOff={props.chooseToPickUpWhereTheyLeftOff}
            onChooseToStartFromScratch={props.chooseToStartFromScratch} />
          <IrrigationConfigForm
            answers={props.answers}
            importedValues={props.importedConfig}
            questions={props.questions}
            submitButton
            showQuestionNumbers
            onSubmit={(results) => props.submitFormFromImport(results)}
            onChooseToStartFromScratch={props.chooseToStartFromScratch}
            isVisible={props.showReviewImportForm} />
          <WizardFooter
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            isVisible={props.showFooter}
            isAskSomeoneElseButtonVisible={props.showAskSomeoneElseButton}
            onAskSomeoneElseButtonClick={props.askSomeoneElse}
            onIDontKnowButtonClick={props.iDontKnow} />
          <LoadingScreen isVisible={props.showLoadingScreen}/>
          <FailureToLoadScreen isVisible={props.failedToLoad} unsupportedCropClass={props.unsupportedCropClass}/>
          <IrrigationConfigFinishedScreen
            {...props /*TODO: don't pass down all props from parent to child elem! */}
            isVisible={props.showFinishedScreen}/>
        </main>
      </div>
    )
  }
}

const mapStateToIrrigationConfigWizardProps = (state) => {
  const nonConfiguredBlocks = state.nonConfiguredBlocks.filter(block => block.id != state.block.id);
  const areStillNonConfiguredBlocksLeft = !!nonConfiguredBlocks.length;
  return {
    ...state,  //TODO: find a better way than spreading state onto props... DONT THINK THIS ISN'T GOOD PRACTICE.
    blockId: state.block ? state.block.id : null,
    blockName: state.block ? state.block.name : null,
    cropType:  state.block ? state.block.crop_type  : null,
    cropClass: state.block ? state.block.crop_class : null,
    currQuestionText: state.currQuestionIndex !== null && state.questions.length > 0 ? state.questions[state.currQuestionIndex].text : "",
    nameOfUserReceivingQuestion: state.userReceivingQuestion ? state.userReceivingQuestion.fullName : "",
    ranchName: state.block && state.block.ranch ? state.block.ranch.name : null,
    showFooter: state.currQuestionIndex !== null && !state.isAskingSomeoneElse && !state.isSendingQuestionToUser,
    showHeader: !state.isLoadingWizard && !state.failedToLoad,
    showImportOrFromScratchScreen: state.isAskingImportOrFromScratch,
    showAskIfUserWantsToPickUpWhereTheyLeftOffScreen: state.isAskingIfUserWantsToPickUpWhereTheyLeftOff,
    showReviewImportForm: state.isEnteringFormFromImport,
    showLoadingScreen: state.hasJustFinished || state.isLoadingWizard, //hasJustFinished is true between wizard finish and "done" screen
    showFinishedScreen: state.isFinished,
    showQuestionInputs: !state.isAskingSomeoneElse && !state.isSendingQuestionToUser,
    nonConfiguredBlocks: nonConfiguredBlocks,
    showAnotherFieldProposition: state.hasReceivedNonConfiguredBlocks && areStillNonConfiguredBlocksLeft && !state.isInIndividualQuestionMode,
    showTakeMeToMapOverviewButton: state.hasReceivedNonConfiguredBlocks && !areStillNonConfiguredBlocksLeft && !state.isInIndividualQuestionMode,
    showIndividualQuestion: state.isAnsweringIndividualQuestion
  }
};
const mapDispatchToIrrigationConfigWizardProps = (dispatch) => {
  //TODO: used binded action to dispatch: http://redux.js.org/docs/api/bindActionCreators.html
  return {
    goBack: () => dispatch(goBacktoPreviousIrrigationConfigQuestion()),
    askSomeoneElse: (questionIndex) => dispatch(
      beginToAskSomeoneElseIrrigationConfigQuestion(questionIndex)
    ),
    iDontKnow: (questionIndex) => dispatch(
      markIrrigationConfigQuestionAsNotKnownByUser(questionIndex)
    ),
    sendUserQuestion: (user) => dispatch(
      chooseUserToSendIrrigationConfigQuestion(user)
    ),
    cancelAskingSomeone: () => dispatch(
      cancelAskingSomeoneIrrigationConfigQuestion()
    ),
    beginConfigForAnotherBlock: (nextBlockId) => dispatch(
      fetchAnotherBlockAndIrrigationConfigData(nextBlockId)
    ),
    chooseToImport: (fromBlock, importedConfig) => dispatch(
      fetchImportedIrrigationConfig(fromBlock)
    ),
    chooseToPickUpWhereTheyLeftOff: () => dispatch(
      chooseToPickUpWhereTheyLeftOff()
    ),
    chooseToStartFromScratch: () => dispatch(beginIrrigationConfigFromScratch()),
    submitFormFromImport: (results) => dispatch(
      submitFormFromImportedIrrigationConfig(results)
    ),
    inputValidityChanged: (questionIndex,inputIndex,isValid) => dispatch(
      irrigationConfigWizardAnswerValidityChanged(
        questionIndex,inputIndex,isValid
      )
    )
  }
};
const IrrigationConfigWizardAppContainer = connect(
  mapStateToIrrigationConfigWizardProps,
  mapDispatchToIrrigationConfigWizardProps
)(IrrigationConfigWizardApp);


 /*
  *
  * react/irrigation-configuration-wizard.js
  *
  */
///

/**
 * Logs all actions and states after they are dispatched.
 * taken from http://redux.js.org/docs/advanced/Middleware.html#seven-examples
 */
const loggerMiddleware = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd(action.type);
  return result
};

const store = createStore(
  irrigationConfigWizard,
  applyMiddleware(ReduxThunk)
  //applyMiddleware(ReduxThunk, loggerMiddleware)
);

/*
$(function() {
  ReactDOM.render(
    <Provider store={store}><IrrigationConfigWizardAppContainer /></Provider>,
    document.getElementById('irrigation-config-wizard-app')
  );

  const forBlockId = window.initialBlockIdForIrrigationConfigWizard;
  const questionIndex = window.questionIndexForIrrigationConfigWizard;
  const {dispatch} = store;

  if(typeof questionIndex === 'undefined') {
    dispatch(fetchInitialFarmBlockAndIrrigationConfigData(forBlockId))
  } else {
    dispatch(fetchInitialFarmBlockAndIrrigationConfigDataForIndividualQuestion(
      forBlockId,
      questionIndex
    ))
  }
});
*/

export {IrrigationConfigWizardApp};
