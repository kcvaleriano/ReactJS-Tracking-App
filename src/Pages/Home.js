import React, { Component } from 'react';
import dataBusinessOwners from '../data/BusinessOwners.json';
import dataVehiclesPerBusiness from '../data/Vehicles.json';
import NumberFormat from 'react-number-format';
import Transactions from './Transactions.js'

export default class Home extends React.Component{
    render(){
        return(
            <div className="container-fluid">
                <SearchBar businessOwners={BUSINESSOWNERS} />
            </div>
        );
    }
}

const BUSINESSOWNERS = dataBusinessOwners;
const VEHICLES = dataVehiclesPerBusiness;

// Inline Styling
const cardStyle = {
    maxWidth: 250,
    minWidth: 200
};

class SearchBar extends React.Component{
  constructor(props){
    super(props);    
    this.state = {
      searchCaseId:"",
      searchFirstName:"",
      searchLastName:"",
      isSubmitted:false,
      operator:[],
      operatorVehicles:[]
    }
   
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(e){
      this.setState({
        [e.target.name] : e.target.value,
        isSubmitted:false
      });
    }

    handleSubmit(e){
        e.preventDefault();

        let caseId = this.state.searchCaseId;
        let firstName = this.state.searchFirstName;
        let lastName = this.state.searchLastName;
        let operatorsDB = BUSINESSOWNERS;
        let vehiclesDB = VEHICLES;
        let vehicles = [];

        let operator = 
            (caseId !== '' && firstName !== '' && lastName !== '')?
            operatorsDB.filter(row => 
                row.caseId.indexOf(caseId) > - 1 && 
                row.firstName.indexOf(firstName) > -1 && 
                row.lastName.indexOf(lastName) > -1) : [];

            if(operator.length > 0){
                operator.forEach(
                    function(item){
                        let itemCaseId = item.caseId;

                        vehiclesDB.forEach(
                            function(car){
                                if (itemCaseId === car.businessCaseId){
                                    vehicles.push(car);
                                }
                            }

                        );
                    }
                );
            }
        this.setState({
            isSubmitted:true,
            operator: operator,
            operatorVehicles:vehicles
        });
    }
       
    render(){
      const searchFields = this.state;
      let component;

      if(searchFields.operator.length > 0){
        component = <DisplayMainPage 
                        businessOwner={searchFields.operator}
                        vehicles = {searchFields.operatorVehicles}
                    />;
      }else{
        component = <div>
                        <br/>
                        <h4>Enter the Case ID and the Operator's fullname to start checking for the transactions.</h4>
                    </div>
      }

      return(
        <div className="row">
            <nav className="col-md-3 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <form  onSubmit={this.handleSubmit}>
                    <br/>
                    <h3 >Check Transaction Status</h3>
                    <hr className="hr-style"/>
                    <div className="search-font-xs">Enter the Operator Name and Case ID here:</div>
                    <br/>
                    <div className="input-group">
                        <span className="input-group-addon">Case ID:</span>
                        <NumberFormat format="####-####" 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. 2000-0000"
                            id="searchCaseId"
                            name="searchCaseId"
                            value={searchFields.searchCaseId}
                            onChange={(e)=>this.handleChange(e)}
                            required
                        />
                    </div> 
                    <br/>
                    <div className="input-group">
                        <span className="input-group-addon">First Name:</span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Juan"
                            id="searchFirstName"
                            name="searchFirstName"
                            value={searchFields.searchFirstName}
                            onChange={(e)=>this.handleChange(e)}
                            required
                        />
                    </div> 
                    <br/>
                    <div className="input-group">
                        <span className="input-group-addon">Last Name:</span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Dela Cruz"
                            name="searchLastName"
                            value={searchFields.searchLastName}
                            onChange={(e)=>this.handleChange(e)}
                            required
                        />
                    </div>                                
                        <br/>
                        <div className="div-align-right">
                            <input type="submit" 
                                    className="btn btn-primary btn-md" 
                                    value="Search" 
                            />
                        </div>
                        <br/><br/>
                    </form>
                
                </div>
            </nav>
            {/* <div className="col-3 col-search-bar">
            </div> */}
            <div className="col">
                {component}
                <div > 
                <br/>
                {/* <Transactions 
                    transactions = {TRANSACTIONS}
                    className="container" /> */}
                </div>
            </div> 
      </div>
      );
    }
  
}

class DisplayMainPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedVehicle: []
        };

        this.handleSelectedVehicle = this.handleSelectedVehicle.bind(this);
    }

    handleSelectedVehicle(vehicle){
        this.setState({
            selectedVehicle: vehicle
        });
    }

  render(){
    const businessOwner = this.props.businessOwner;
    const vehicles = this.props.vehicles;
    const selectedVehicle = this.state.selectedVehicle;
    const row = [];
    
    if(businessOwner.length > 0){

        if(selectedVehicle.length === 0){
            businessOwner.forEach(
                owner => {
                    row.push(
                        <div key={owner.operatorId} >
                            <BusinessOwnerRow 
                                owner = {owner}
                                key={owner.operatorId}
                                units={vehicles.length}
                            />
                            <br/>
                            <HeaderVehicleList 
                                    operatorVehicles={vehicles}
                                    />
                            <div className="card-deck">
                                <VehiclesList 
                                    operatorVehicles={vehicles}
                                    selectedVehicle={this.handleSelectedVehicle}
                                />
                            </div>                    
                        </div>
                    );
                }
            );
        }
        else{
            row.push(
                <div key={selectedVehicle.vehicleId}>
                    <Transactions 
                        selectedVehicle={selectedVehicle}
                        backToHomePage={this.handleSelectedVehicle}
                    />
                </div>
            ) 
        }
    }
   
    return (
      <div>{row}</div>
    );
    
  }
}


class HeaderVehicleList extends React.Component{       
    render(){
        let header;

        if(this.props.operatorVehicles.length > 0){
            header= <div className="col col-header">
                            <h4>Registered Vehicles</h4>
                        </div>;
        }else{
            header = <div className="col col-header">
                            <h4>There are no vehicles registered on the Case ID provided.</h4>
                        </div>;
        }
        
        return header;
    }
}

class BusinessOwnerRow extends React.Component{

    render(){
      const owner = this.props.owner;
      let fullName = owner.firstName + " " + owner.lastName;
  
      return(
        <div className="col-grp-section">
        <h4>Operator Details</h4>
          <div className="row">
            <div className="col">
              <form>
                <div className="row">
                  <label htmlFor="ownerName" className="col-sm-4 col-form-label field-label">Business Owner:</label>
                  <input type="text" readOnly className="col-sm form-control-plaintext" id="ownerName" value={fullName} />
                </div>
                <div className="row">
                  <label htmlFor="address" className="col-sm-4 col-form-label field-label">Business Address:</label>
                  <input type="text" readOnly className="col-sm form-control-plaintext" id="address" value={owner.address} />
                </div>
                <div className="row">
                  <label htmlFor="contactNumber" className="col-sm-4 col-form-label field-label">Contact Number:</label>
                  <input type="text" readOnly className="col-sm form-control-plaintext" id="contactNumber" value={owner.contactNumber} />
                </div>
              </form>
            </div>
            <div className="col">
              <form>
                  <div className="row">
                    <label htmlFor="caseId" className="col-sm-4 col-form-label field-label">Case Number:</label>
                    <input type="text" readOnly className="col-sm form-control-plaintext" id="caseId" value={owner.caseId} />
                  </div>
                  <div className="row">
                    <label htmlFor="businessName" className="col-sm-4 col-form-label field-label">Business Name:</label>
                    <input type="text" readOnly className="col-sm form-control-plaintext" id="businessName" value={owner.businessName} />
                  </div>
                  <div className="row">
                    <label htmlFor="noOfUnits" className="col-sm-4 col-form-label field-label">No. of Unit(s):</label>
                    <input type="text" readOnly className="col-sm form-control-plaintext" id="noOfUnits" value={this.props.units} />
                  </div>
                </form>
            </div>
          </div>
        </div>
      );
    }
  }

class VehiclesList extends React.Component{
    render(){
        const vehicles = this.props.operatorVehicles;        
        const row = [];

        if(vehicles.length > 0){
            vehicles.forEach((vehicle)=>{
                row.push(
                    <SelectVehicleRow 
                            vehicle={vehicle}
                            key={vehicle.vehicleId}
                            selectedVehicle = {this.props.selectedVehicle}
                        />
                )
            });        
        }

        return(
            <div className="col row">
                {row}   
            </div>
        );
    }
    
}


class SelectVehicleRow extends React.Component{

    constructor(props, context){
        super(props, context);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(e,vehicle){
        e.preventDefault();
        this.props.selectedVehicle(vehicle);
    }

   
    render(){
        const vehicle = this.props.vehicle;
        const vehicleDescription = vehicle.model + " " + vehicle.makeYear;
        
        return(
            <div>
                 <div className="card bg-light mb-3" style={cardStyle} >
                    <img className="card-img-top" style={cardStyle} src={require('../images/puv-image-lg.png')} alt={vehicle.plateNumber} />
                    <div className="card-body">
                        <b><h5 className="card-title">{vehicle.plateNumber}</h5></b>
                        <p className="card-text">{vehicleDescription}</p>
                        <button type="button" className="btn btn-primary" onClick={(e)=> {this.handleSelect(e, vehicle)}}>Vehicle Transactions</button>                                        
                    </div>                
                </div>                 
            </div>
        );
    }
}


