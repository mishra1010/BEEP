pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
contract EvidenceProtection
{
    address police;
    address detective;
    address forensic;
    address Judge;
    string description;
    uint caseNumber;
    struct Evidence{
        uint caseNumber;
        string name;
        string ipfshash;
    }
    mapping(address => Evidence)public evidenceOwner;
    mapping(address=>bool)public evidenceOwnerApproval;
    Evidence[] evd;
    address evidenceowner;
    Evidence pf;
    address [] players;
    string [] codes;
    constructor() public
    {
        police=msg.sender;
    }
    
    function RegisterDetective() returns (address) {
        players.push(msg.sender);
        return detective;
    }
    
    function RegisterForensic() returns (address) {
        players.push(msg.sender);
        return forensic;
    }
    
    function CreateEvidence(uint _caseNumber,string _name,string _ipfshash) public
    {
        evidenceowner = msg.sender;
        Evidence memory proof=Evidence({caseNumber:_caseNumber,name:_name,ipfshash:_ipfshash});
        evd.push(proof);
         evidenceOwner[msg.sender]= proof;
         codes.push(_ipfshash);
    }
    
    function getEvidence(uint _caseNumber) view public returns (string []) {
        return codes;
            
}

   function TransferResponsibility(address _evidenceOwner) public
    {
        //To be implemented
    }
   
    
}