import React from 'react';
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap/lib';


const BlockName = ({blockInfo, planting, onInputChange }) => {
    console.log("xxxxxxxx render BlockName: ", planting.block_name);
    if (planting.block_name === undefined) {
        return("Planting is not defined.");
    }
    return(
                <Row style={{marginTop: '8px', marginBottom : '8px'}}>
                    <Col xs={4}>
                        <label htmlFor="blockName">Name</label>
                        <input className="form-control" type="text" onChange={onInputChange} value={planting.block_name}  name="block_name"></input>
                    </Col>
                    <Col xs={4}>
                        <label htmlFor="blockRanch">Ranch</label>
                        <br/>
                        <select onChange={onInputChange} value={planting.ranch_id} className="form-control" name="ranch_id">
                            {blockInfo.ranches.map(function (ranch, index) {
                                return (
                                    <option key={index} value={ranch[0]}>{ranch[1]}</option>
                                );
                            })}
                        </select>
                    </Col>
                    <Col xs={4}>
                        <label>ETa Sensor</label>
                        <br/>
                        <select onChange={onInputChange} value={planting.et_source_id} className="form-control" name="et_source_id">
                            {blockInfo.et_source_options.map(function (et, index) {
                                return (
                                    <option key={index} value={et.id}>{et.name}</option>
                                );
                            })}
                        </select>
                    </Col>
                </Row>
    )
}

BlockName.propTypes = {
  blockInfo: PropTypes.object.isRequired,
  planting: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
}

export {BlockName};

