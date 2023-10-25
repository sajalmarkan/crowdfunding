const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding Factory and Contract", function () {
  let Factory;
  let CrowdFunding;
  // let factory;
  // let crowdFunding;
  // let Crowdfunding

  let owner;
  let donor1;
  let donor2;
  let HardhatCrowdFunding;
  beforeEach(async function(){
    [owner, donor1, donor2] = await ethers.getSigners();

    // console.log(owner.address)
    Factory = await ethers.getContractFactory("factory");
    CrowdFunding = await ethers.getContractFactory("CrowdFunding");

    HardhatFactory = await Factory.deploy();
    await HardhatFactory.requesting(owner.address, "name");
    let temp = await HardhatFactory.crowdFunding(0);

    HardhatCrowdFunding =  CrowdFunding.attach(temp);
    
  })
  // it("test",async()=>{
  //   console.log("inside it");

    // console.log(await HardhatCrowdFunding.donors())
    // Crowdfunding = await HardhatCrowdFunding.attach();

    // await Crowdfunding.registringDonators()
    // console.log("dasdgfhj")

  // });
  it("should register donors", async function(){
    await HardhatCrowdFunding.connect(donor1).registringDonators({ value : ethers.parseEther("1")});
    await HardhatCrowdFunding.connect(donor2).registringDonators({ value : ethers.parseEther("2")});
    const donorCount =await HardhatCrowdFunding.donors();
    expect(donorCount).to.equal(2);
  });
  it("donot register the owner",async function(){
    await expect(HardhatCrowdFunding.registringDonators({value : ethers.parseEther("1")})).to.revertedWith("you cannot donate");
  });
  it("give money",async function(){
    await expect(HardhatCrowdFunding.connect(donor1).registringDonators({value : ethers.parseEther("0")})).to.rejectedWith("donate some money");
  });
  it("request by donator",async function(){
    await expect( HardhatCrowdFunding.connect(donor1).withdrawrequest("Reason",ethers.parseEther("2"))).to.revertedWith("you cant request for withdraw");
  })
  it("request by donator",async function(){
    await expect( HardhatCrowdFunding.withdrawrequest("Reason",ethers.parseEther("0"))).to.revertedWith("ask for money");
  })
  it("should allow to create withdraw request",async function(){
    await HardhatCrowdFunding.withdrawrequest("Reason",ethers.parseEther("2"));
    const request =await HardhatCrowdFunding.requestsAvailable(0);
    expect(request._reason).to.equal("Reason");
  });
  it("should allow registered donatore to vote",async function(){
    await HardhatCrowdFunding.connect(donor1).registringDonators({value : ethers.parseEther("1")});
    await HardhatCrowdFunding.withdrawrequest("Reason",ethers.parseEther("2"));

    await HardhatCrowdFunding.connect(donor1).voting(0);
    const request = await HardhatCrowdFunding.requestsAvailable(0);
    expect(request.noOfVotes).to.equal(1);
  });
  it("not registered donator cannot vote", async function(){
      await HardhatCrowdFunding.withdrawrequest("Reason",ethers.parseEther("2"));
      await expect(HardhatCrowdFunding.voting(0)).to.revertedWith("only registered donors can vote");
  });
  it("should allow the owner to withdraw money",async function(){
    await HardhatCrowdFunding.connect(donor1).registringDonators({value : ethers.parseEther("4")});
    await HardhatCrowdFunding.connect(donor2).registringDonators({value : ethers.parseEther("4")});
    await HardhatCrowdFunding.withdrawrequest("Reason",ethers.parseEther("1"));
    await HardhatCrowdFunding.connect(donor1).voting(0);
    let request = await HardhatCrowdFunding.requestsAvailable(0);
    expect(request.noOfVotes).to.equal(1);
    await HardhatCrowdFunding.connect(donor2).voting(0);
     request = await HardhatCrowdFunding.requestsAvailable(0);
    expect(request.noOfVotes).to.equal(2);

    await HardhatCrowdFunding.connect(owner).withdrawMoney(0);

    const request1 = await HardhatCrowdFunding.requestsAvailable(0);
    expect(request1.isCompleted).to.equal(true);
  })
  it("should not allow donator to withdraw", async function(){
    await HardhatCrowdFunding.connect(donor1).registringDonators({value : ethers.parseEther("4")});
    await HardhatCrowdFunding.connect(donor2).registringDonators({value : ethers.parseEther("4")});
    await HardhatCrowdFunding.withdrawrequest("Reason",ethers.parseEther("1"));
    await HardhatCrowdFunding.connect(donor1).voting(0);
    let request = await HardhatCrowdFunding.requestsAvailable(0);
    expect(request.noOfVotes).to.equal(1);
    await HardhatCrowdFunding.connect(donor2).voting(0);
     request = await HardhatCrowdFunding.requestsAvailable(0);
    expect(request.noOfVotes).to.equal(2);

    await expect (HardhatCrowdFunding.connect(donor1).withdrawMoney(0)).to.revertedWith("you cant request for withdraw money");
  })
  it("should not allow donator to withdraw", async function(){
    await HardhatCrowdFunding.connect(donor1).registringDonators({value : ethers.parseEther("4")});
    await HardhatCrowdFunding.connect(donor2).registringDonators({value : ethers.parseEther("4")});
    await HardhatCrowdFunding.withdrawrequest("Reason",ethers.parseEther("10"));
    await HardhatCrowdFunding.connect(donor1).voting(0);
    let request = await HardhatCrowdFunding.requestsAvailable(0);
    expect(request.noOfVotes).to.equal(1);
    await HardhatCrowdFunding.connect(donor2).voting(0);
     request = await HardhatCrowdFunding.requestsAvailable(0);
    expect(request.noOfVotes).to.equal(2);
    await expect (HardhatCrowdFunding.connect(owner).withdrawMoney(0)).to.revertedWith("you donot have any balance");
  })

});