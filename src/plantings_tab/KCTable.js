/* Description:
 * Dislays the details associated with the active planting.
 */
import React from 'react';
import PropTypes from 'prop-types';
var DatePicker = require("react-bootstrap-date-picker");

    

//visible: is_active() && is_kc_table_visible() && !loading_kc_data()"
const KCTable = ({cropInfo, isReadonly, planting, onChange, onPlantingChange}) => {
    let showCanopyMeasure = cropInfo.show_canopy;
    let supportsPartial = cropInfo.show_partial;
    let showPartial = supportsPartial && planting.using_partial_irrigation;
    let stageList = planting.crop_stage_list;

    //Should not have to do this but better save than sorry.
    for (let i=0; i < stageList.length; i++) {
        let stage = stageList[i];
        let dts = stage.date_this_season;
        if (dts && dts.indexOf('/') > 0) {
            try {
                let date = new Date(Date.parse(dts));
                dts = date.toISOString().split('T')[0];
            } catch (error) {
                console.log("Error parsing KC date: ", dts, ", ", error);
                dts = '';
            }
            stage.date_this_season = dts;
        }
    }

    return(
        <div>
          {<div>
            {supportsPartial &&
             <label>
                 <input type="checkbox" checked={planting.using_partial_irrigation} name="using_partial_irrigation" onChange={onPlantingChange} /> Use Partial Irrigation
             </label>}
           </div>
          }
         
        <table className="kc-table table table-with-inner-inputs table-bordered margin-bottom header-fixed">
            <thead>
                <tr>
                    <th>Stage</th>
                    { showCanopyMeasure && <th>Canopy %</th> }
                    <th style={{width:"140px"}} >Kc&nbsp;/&nbsp;KC Baseline</th>
                    { showPartial && <th>Partial %</th> }
                    <th>Date</th>
                    <th>Date Type</th>
                </tr>
            </thead>
            {stageList && 
                <tbody>{stageList.map((stage, index) => { 
                    return(
                        <tr key={index}>
                            <td>
                                <input disabled={isReadonly} className={'form-control table-inner-input'} data-row={index} name='name' value={stage.name} onChange={onChange}/>
                            </td>
                            {showCanopyMeasure && <td> 
                                <input disabled={isReadonly} style={{width:"70px"}} className={'form-control table-inner-input'} data-row={index} name='reference_canopy_measure' value={stage.reference_canopy_measure} type="number" onChange={onChange}/>
                            </td>}
                            <td>
                                <input disabled={isReadonly} style={{width:"70px"}} className={'form-control-inline table-inner-input'} data-row={index} name='kc_value' value={stage.kc_value} type="number" onChange={onChange}/>
                                &nbsp;/&nbsp;
                                <span>{stage.reference_kc_value.toFixed(2)}</span>
                            </td>
                            {showPartial  && <td>
                                <input disabled={isReadonly} className={'form-control table-inner-input'} data-row={index} name='partial_et_percent' value={stage.partial_et_percent} onChange={onChange}/>
                            </td>}
                            <td>
                                <DatePicker disabled={isReadonly} className={"form-control table-inner-input"} type="value"  showClearButton={false} dateFormat="MM/DD/YYYY" onChange={(newDate) => {onChange({target:{name:'date_this_season', value:newDate, row:index}})}} value={stage.date_this_season}  name="date_this_season"></DatePicker>
                            </td>
                            <td>
                                <select disabled={isReadonly} className={"form-control table-inner-input"}  data-row={index} name='is_actual_date' value={stage.is_actual_date} onChange={onChange}>
                                   <option value='false'>Forecast</option>
                                   <option value='true'>Actual</option>
                                </select>
                            </td>
                        </tr>)})
                }</tbody>
             }
          </table>
       </div>
    )
}

KCTable.propTypes = {
    isReadonly: PropTypes.bool.isRequired,
    cropInfo: PropTypes.object.isRequired,
    planting: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,    //update KC stuff
    onPlantingChange: PropTypes.func.isRequired, //update planting stuff
}

export {KCTable};
