import React, { Component } from 'react';
import dataConfirmation from '../data/Transactions/Confirmation.json';
import dataExtensionOfValidity from '../data/Transactions/ExtensionOfValidity.json';
import dataSpecialPermit from '../data/Transactions/SpecialPermit.json';
import dataStatus from '../data/Transactions/Status.json'
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Panel from 'react-bootstrap/lib/Panel';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button'
import ApplicationForm from './ApplicationForm.js'

export default class Transactions extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            confirmationItems:[],
            extensionOfValidityItems:[],
            specialPermitItems:[]
        };

        this.goBackToHomePage = this.goBackToHomePage.bind(this);
        
    }

    goBackToHomePage(){
        this.props.backToHomePage([]);
    }

    componentWillMount(){
        let vehicleId = this.props.selectedVehicle.vehicleId;

        let confirmationRows = dataConfirmation.filter(
            row =>  row.vehicleId.indexOf(vehicleId) > -1 && 
                    row.transactionType.indexOf(CONFIRMATION_TRAN) > -1
        );

        let extensionOfValidityRows = dataExtensionOfValidity.filter(
            row =>  row.vehicleId.indexOf(vehicleId) > -1 && 
                    row.transactionType.indexOf(EXTENSIONVALIDITY_TRAN) > -1
        );

        let specialPermitRows = dataSpecialPermit.filter(
            row => row.vehicleId.indexOf(vehicleId) > -1 &&
                    row.transactionType.indexOf(SPECIALPERMIT_TRAN) > -1
        );

        this.setState({
            confirmationItems:confirmationRows,
            extensionOfValidityItems:extensionOfValidityRows,
            specialPermitItems: specialPermitRows
        });
    }

    render(){
        return(
            <div>
                <VehicleDetailsHeader 
                    selectedVehicle={this.props.selectedVehicle} />
                <br/>
                <div className="div-align-left">
                    <button type="button" className="btn btn-link" onClick={this.goBackToHomePage}>Click to select another vehicle</button>
                </div> 
                <br/>
                <TransactionList 
                    transactions = {this.state}
                />
            </div>
        );
    }
}

const CONFIRMATION_TRAN = "Confirmation";
const SPECIALPERMIT_TRAN = "Application of Special Permit";
const EXTENSIONVALIDITY_TRAN = "Extension of Validity";
const dateFormat=require('dateformat');

class VehicleDetailsHeader extends React.Component{
    render(){
        const vehicle = this.props.selectedVehicle;

        return(
            <div className="col-grp-section">
            <h4>{vehicle.plateNumber}</h4>
              <div className="row">
                <div className="col">
                  <form>
                    {/* <div className="row">
                      <label htmlFor="plateNumber" className="col-sm-5 col-form-label field-label">Plate Number:</label>
                      <input type="text" readOnly className="col form-control-plaintext" id="plateNumber" value={vehicle.plateNumber} />
                    </div> */}
                    <div className="row">
                      <label htmlFor="model" className="col-sm-5 col-form-label field-label">Model:</label>
                      <input type="text" readOnly className="col form-control-plaintext" id="model" value={vehicle.model} />
                    </div>
                    <div className="row">
                      <label htmlFor="makeYear" className="col-sm-5 col-form-label field-label">Make Year:</label>
                      <input type="text" readOnly className="col form-control-plaintext" id="makeYear" value={vehicle.makeYear} />
                    </div>
                    <div className="row">
                        <label htmlFor="registrationNumber" className="col-sm-5 col-form-label field-label">Registration Number:</label>
                        <input type="text" readOnly className="col form-control-plaintext" id="registrationNumber" value={vehicle.registrationNumber} />
                      </div>
                  </form>
                </div>
                <div className="col">
                  <form>
                      <div className="row">
                        <label htmlFor="serialNumber" className="col-sm-4 col-form-label field-label">Serial Number:</label>
                        <input type="text" readOnly className="col form-control-plaintext" id="serialNumber" value={vehicle.serialNumber} />
                      </div>
                      <div className="row">
                        <label htmlFor="engineNumber" className="col-sm-4 col-form-label field-label">Engine Number:</label>
                        <input type="text" readOnly className="col form-control-plaintext" id="engineNumber" value={vehicle.engineNumber} />
                      </div>
                      <div className="row">
                        <label htmlFor="chassisNumber" className="col-sm-4 col-form-label field-label">Chassis Number:</label>
                        <input type="text" readOnly className="col form-control-plaintext" id="chassisNumber" value={vehicle.chassisNumber} />
                      </div>
                    </form>
                </div>
              </div>
            </div>
          );
    }
}

class TransactionList extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            key:1
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(key){
        this.setState({
            key
        });
    }

    render(){
        return(
            <div>
                <Tabs 
                    activeKey={this.state.key}
                    onSelect={this.handleSelect}
                    id="controlled-tab-transactions"
                    animation={false} >
                    <Tab eventKey={1} title={CONFIRMATION_TRAN}>
                        <TransactionTab
                            transactions={this.props.transactions.confirmationItems}
                            transactionType={CONFIRMATION_TRAN}
                        />
                    </Tab>
                    <Tab eventKey={2} title={EXTENSIONVALIDITY_TRAN}>
                        <TransactionTab
                            transactions={this.props.transactions.extensionOfValidityItems}
                            transactionType={EXTENSIONVALIDITY_TRAN} />  
                    </Tab>
                    <Tab eventKey={3} title={SPECIALPERMIT_TRAN}>
                        <TransactionTab
                            transactions={this.props.transactions.specialPermitItems} 
                            transactionType={SPECIALPERMIT_TRAN}/>  
                    </Tab>
                </Tabs>
            </div>
        );
    }
   
}

class TransactionTab extends React.Component{
    constructor(props){
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show:false,
            selectedItem:[]
        }
    }

    handleShow(e,item){
        e.preventDefault();
        this.setState({
            show:true,
            selectedItem:item
        });
    }

    handleClose(){
        this.setState({
            show:false
        });
    }
   
    render(){
        let transactions = this.props.transactions.sort((a, b)=> a.applicationDate < b.applicationDate);
        let transactionType = this.props.transactionType;
        let component;
        let modal;
        let statusList = dataStatus;
        
        if(transactions.length > 0)
        {
            component=
            <table className="table table-hover table-condensed table-bordered">
                <thead >
                    <tr>
                        <th className="table-thead">Transaction ID</th>
                        <th className="table-thead">Submission Date</th>
                        <th className="table-thead">Transaction Type</th>
                        <th className="table-thead">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((item) =>
                    <tr key={item.transactionId}>
                        <td><a href="#" onClick={(e) => this.handleShow(e,item)}>{item.transactionId}</a></td>
                        <td>{dateFormat(item.applicationDate, "mmm d, yyyy")}</td>
                        <td>{item.transactionType}</td>
                        <td>{item.applicationStatus}</td>
                    </tr>
                    )}
                </tbody>
            </table>
            
        } else {
            component= <NoDataPanel/>           
        }

        if(transactionType === CONFIRMATION_TRAN){
            modal = <ConfirmationModal 
                        transaction={this.state.selectedItem}
                        statusList = {
                            statusList.filter((row)=> 
                            row.transactionType.indexOf(CONFIRMATION_TRAN) > -1)
                        }
                    />
            
        }else if(transactionType === EXTENSIONVALIDITY_TRAN){ 
            modal = < ExtensionOfValidityModal
                        transaction={this.state.selectedItem}
                        statusList = {
                            statusList.filter((row)=> 
                            row.transactionType.indexOf(EXTENSIONVALIDITY_TRAN) > -1)
                        }      
                    />
        }else if(transactionType === SPECIALPERMIT_TRAN){
            modal = < SpecialPermitModal
                        transaction={this.state.selectedItem}
                        statusList = {
                            statusList.filter((row)=> 
                            row.transactionType.indexOf(SPECIALPERMIT_TRAN) > -1)
                        }
                    />
        }
        
        return(
            <div>
                {component}
                <Modal 
                    bsSize="large"
                    aria-labelledby="contained-modal-title-lg" 
                    show={this.state.show} 
                    onHide={this.handleClose}
                >
                    <Modal.Header closeButton></Modal.Header>   
                    <Modal.Body>
                        {modal}
                    </Modal.Body>          
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>   
        );
    }
}

class NoDataPanel extends React.Component{
    render(){
        return(
            <Panel>
                <Panel.Body>No transactions found.</Panel.Body>
            </Panel>
        );
        
    }
}

class ConfirmationModal extends React.Component{
    render(){
        let transaction = this.props.transaction;
        
        return(
            <div>
                <div className="row div-col-transactions">
                    <div className="col">
                        <div className="row">
                            <label htmlFor="transactionId" className="col-sm-2 col-form-label field-label">Transaction ID:</label>
                            <input type="text" readOnly className="col-sm form-control-plaintext" id="transactionId" value={transaction.transactionId} />
                        </div>
                        <div className="row">
                            <label htmlFor="applicationDate" className="col-sm-2 col-form-label field-label">Submitted Date:</label>
                            <input type="text" readOnly className="col-sm form-control-plaintext" id="applicationDate" value={dateFormat(transaction.applicationDate,"mmmm, d yyyy")} />
                        </div>
                        <div className="row">
                            <label htmlFor="applicationStatus" className="col-sm-2 col-form-label field-label">Status:</label>
                            <input type="text" readOnly className="col-sm form-control-plaintext" id="applicationStatus" value={transaction.applicationStatus} />
                        </div>
                    </div>
                </div>
                {/* <div>
                    <br/>
                    <StatusIndicator 
                        statusList = {this.props.statusList[0].status}
                    />
                </div> */}
            </div>
            
        );
    }

    
}

class SpecialPermitModal extends React.Component{
    render(){
        let transaction = this.props.transaction;
        return(
            <div className="row div-col-transactions">
                <div className="col">
                    <div className="row">
                        <label htmlFor="transactionId" className="col-sm-4 col-form-label field-label">Transaction ID:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="transactionId" value={transaction.transactionId} />
                    </div>
                    <div className="row">
                        <label htmlFor="applicationDate" className="col-sm-4 col-form-label field-label">Submitted Date:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="applicationDate" value={dateFormat(transaction.applicationDate,"mmmm, d yyyy")} />
                    </div>
                    <div className="row">
                        <label htmlFor="applicationStatus" className="col-sm-4 col-form-label field-label">Status:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="applicationStatus" value={transaction.applicationStatus} />
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <label htmlFor="routeFrom" className="col-sm-4 col-form-label field-label">Route From:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="routeFrom" value={transaction.routeFrom} />
                    </div>
                    <div className="row">
                        <label htmlFor="routeTo" className="col-sm-4 col-form-label field-label">Route To:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="routeTo" value={transaction.routeTo} />
                    </div>
                    <div className="row">
                        <label htmlFor="travelDateFrom" className="col-sm-4 col-form-label field-label">Travel Date From:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="travelDateFrom" value={dateFormat(transaction.travelDateFrom,"mmmm, d yyyy")} />
                    </div>
                    <div className="row">
                        <label htmlFor="travelDateTo" className="col-sm-4 col-form-label field-label">Travel Date To:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="travelDateTo" value={dateFormat(transaction.travelDateTo,"mmmm, d yyyy")} />
                    </div>
                </div>
            </div>
        );
    }
}

class ExtensionOfValidityModal extends React.Component{
    render(){
        let transaction = this.props.transaction;
        let hearingDateTime = transaction.hearingDateTime === null? '':dateFormat(transaction.hearingDateTime,"mmmm, d yyyy h:MM TT");
        return(
            <div className="row div-col-transactions">
                <div className="col">
                    <div className="row">
                        <label htmlFor="transactionId" className="col-sm-5 col-form-label field-label">Transaction ID:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="transactionId" value={transaction.transactionId} />
                    </div>
                    <div className="row">
                        <label htmlFor="applicationDate" className="col-sm-5 col-form-label field-label">Submitted Date:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="applicationDate" value={dateFormat(transaction.applicationDate,"mmmm, d yyyy")} />
                    </div>
                    <div className="row">
                        <label htmlFor="applicationStatus" className="col-sm-5 col-form-label field-label">Status:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="applicationStatus" value={transaction.applicationStatus} />
                    </div>
                    <div className="row">
                        <label htmlFor="oldValidityEndDate" className="col-sm-5 col-form-label field-label">Old Valid End Date:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="oldValidityEndDate" value={dateFormat(transaction.oldValidityEndDate,"mmmm, d yyyy")} />
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <label htmlFor="newValidityEndDate" className="col-sm-5 col-form-label field-label">New Valid End Date:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="newValidityEndDate" value={dateFormat(transaction.newValidityEndDate,"mmmm, d yyyy")}  />
                    </div>
                    <div className="row">
                        <label htmlFor="hearingDateTime" className="col-sm-5 col-form-label field-label">Hearing Date/Time:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="hearingDateTime" value={hearingDateTime} />
                    </div>
                    <div className="row">
                        <label htmlFor="hearingLocation" className="col-sm-5 col-form-label field-label">Hearing Location:</label>
                        <input type="text" readOnly className="col-sm form-control-plaintext" id="hearingLocation" value={transaction.hearingLocation} />
                    </div>
                </div>
            </div>
        );
    }
}

class StatusIndicator extends React.Component{
    render(){
        let statusList = this.props.statusList
        return(
            <Panel className="panel-multi-steps">
                <Panel.Body>
                    <ol className="ol-multi-steps">
                        {statusList.map( status =>
                            <li key={status} className="li-multi-step">
                                <div className="div-multi-step">
                                    {status}
                                </div>
                            </li>
                        )}
                    </ol>
                </Panel.Body>
            </Panel>
            
        );
    }
}