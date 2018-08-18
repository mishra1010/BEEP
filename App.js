import {Table, Grid, Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import './App.css';

import EvidenceP from '../build/contracts/EvidenceP.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
	  buffer:null,
	  caseNumber: 42,
	  account:'',
      codes:[]
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    
    const contract = require('truffle-contract')
    const evd = contract(EvidenceP)
    evd.setProvider(this.state.web3.currentProvider)
	console.log(window.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      evd.deployed().then((instance) => {
        this.evdInstance = instance
        this.setState({ account: accounts[0] })
        return 
      }).then((codes) => {
        return 
      })
    })


  }

   captureFile(event){
	console.log("capture")
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
          reader.readAsArrayBuffer(file)
          reader.onloadend = () =>{
            this.setState({buffer:Buffer(reader.result)})
           console.log('buffer', this.state.buffer)
      }
   }
   onSubmit(event){
       event.preventDefault();
		ipfs.files.add(this.state.buffer,(error,result) =>{
        if(error){
          console.error(error)
           return
		}
		
		var docName =  'TestDoc'
		this.evdInstance.CreateEvidence(this.state.caseNumber,docName, result[0].hash, { from: this.state.account })
		.then((r) => {
			return this.setState({ ipfsHash: result[0].hash })
			console.log(this.state.ipfsHash)
		})
      })
   }


   onClick(event) {
       console.log("hello")
        //event.preventDefault();
	this.evdInstance.getEvidence(1, {from: this.state.account}).then((r)=>{
        console.log(r)
        this.setState({codes:r })
        
       })
    	
  }  
render() {
	return (
        <div className="App">
          <header className="App-header">
            <h1>BEEP - Block Chain Enabled Evidence Protection</h1>
          </header>

          <hr />

        <Grid>
          <h3> Upload Evidences </h3>
          <Form onSubmit={this.onSubmit}>
            <input
              type="file"
              onChange={this.captureFile}
            />
             <Button
             bsStyle="primary"
             type="submit">
             Submit
             </Button>
          </Form>

          <hr/>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Case Number</th>
					<th>Document Name</th>
					<th>Document Hash</th>
                  </tr>
                </thead>

                <tbody>
					<tr>
					<td>{this.state.caseNumber}</td>
					<td>TestDoc</td>
					<td>{this.state.ipfsHash}</td>
				   </tr>
                </tbody>
			</Table>

			<Button onClick={this.onClick}> Get Evidence Trail </Button>
			<Table bordered responsive>
                	<thead>
                  	<tr>
				<th>Evidence Name</th>
                    		<th>Evidence Hash</th>
                     </tr>
                    </thead>

                <tbody >
                <tr>
					<td>{this.state.codes[0]}</td>
					<td>{this.state.codes[1]}</td>
				   </tr>
                
                	</tbody>
				</Table>
		
        </Grid>
     </div>
      );
  }
}

export default App