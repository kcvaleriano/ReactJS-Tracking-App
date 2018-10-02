import React, { Component } from 'react';
// import Form from 'react-bootstrap/lib/Form';
// import FormGroup from 'react-bootstrap/lib/FormGroup';

export default class ApplicationForm extends React.Component{
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <div className="container-fluid">
                    <ConfirmationForm />
                </div>
            </form>
        );
    }
}

class ConfirmationForm extends React.Component{
    render(){
        return(
            <div className="row">
                {/* <div className="col">
                    <div className="input-group">
                        <span className="input-group-addon">Transaction ID:</span>
                        <NumberFormat format="####" 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. 20000"
                            id="transactionId"
                            name="transactionId"
                            value=''
                            onChange={(e)=>this.handleChange(e)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">Vehicle ID:</span>
                        <NumberFormat format="#######" 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. 2100100"
                            id="vehicleId"
                            name="vehicleId"
                            value=''
                            onChange={(e)=>this.handleChange(e)}
                            required
                        />
                    </div> 
                </div>
                <div className="col">
                    <div className="input-group">
                        <span className="input-group-addon">Submitted Date:</span>
                        <DateTime  
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. 20000"
                            id="transactionId"
                            name="transactionId"
                            value={new Date(now)}
                            // onChange={(e)=>this.handleChange(e)}
                            disabled
                        />
                    </div>
                </div> */}
            </div>
        );
    }
}