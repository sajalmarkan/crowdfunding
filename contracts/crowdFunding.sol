// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "hardhat/console.sol";

contract factory {
    CrowdFunding[] public crowdFunding;
    
    function requesting(address _crowdOwner, string memory _name) public {
        CrowdFunding crowd = new CrowdFunding(_crowdOwner, _name);
        crowdFunding.push(crowd);
    }

    // function getCrowdfunding(uint256 index) public view returns (address) {
       
    //     return crowdFunding[index];
    // }
}

contract CrowdFunding {
    address public crowdOwner;
    string public name;
    // uint256 public amount;
    // string public reason;
    uint256 public noOfRequest = 0;
    struct Requests {
        uint256 _amount;
        string _reason;
        mapping(address => bool) isvoter;
        uint noOfVotes;
        bool isCompleted;
    }

    constructor(address _crowdOwner, string memory _name) {
        crowdOwner = _crowdOwner;
        name = _name;
    }

    mapping(uint256 => Requests) public requestsAvailable;
    mapping(address => uint) public donator;
    // mapping(address => uint256) public balances;
    
    uint256 public donors = 0;
    uint256 availableVotes;

    function registringDonators() public payable{
        require(crowdOwner!=msg.sender,"you cannot donate");
        require(msg.value>=1 ether,"donate some money");
        if(donator[msg.sender]==0){
        donors++;}
        donator[msg.sender]+=msg.value;
    }

    function withdrawrequest(string memory _reason, uint _amount) public{
        require(msg.sender == crowdOwner, "you cant request for withdraw");
        require(_amount> 0 ,"ask for money");
        Requests storage request1 =requestsAvailable[noOfRequest];
        request1._amount=_amount;
        request1._reason=_reason;
        request1.noOfVotes=0;
        noOfRequest++;
    }

    function voting(uint _requestId) public{        
        require(donator[msg.sender] >= 1 ether,"only registered donors can vote");
        Requests storage requestDetails= requestsAvailable[_requestId];
        require(requestDetails._amount!=0,"request not available");
        require(!requestDetails.isCompleted,"Cannot Vote as Amount Already Withdrawed !");
        require(!requestDetails.isvoter[msg.sender],"you already voted");
        requestDetails.isvoter[msg.sender]= true;
        requestDetails.noOfVotes++;
    }

    function withdrawMoney(uint _requestId) public{
        Requests storage requestDetails= requestsAvailable[_requestId];
        require(!requestDetails.isCompleted,"Amount Already Withdrawed !");
        require(msg.sender == crowdOwner, "you cant request for withdraw money");
        require(address(this).balance >= requestDetails._amount, "you donot have any balance");
        require(requestDetails.noOfVotes >=donors/2);
        uint amount= requestDetails._amount;
        requestDetails.isCompleted=true;
        (bool sent, ) = crowdOwner.call{value: amount }("");
            require(sent, "Failed to send Ether");
       
    }
    

}
