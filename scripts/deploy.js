

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

async function main() {
  signers = await ethers.getSigners();
  deployer = signers[0]
  owner = signers[1]

  console.log("Deploying contracts with the account:", deployer.address);

  const FACTORY = await ethers.getContractFactory("factory");
  // const factory = await FACTORY.deploy();
  const factory = await FACTORY.attach("0x241d26dc1DC90300A03f228aE8dF5C890aDb0461")

    await factory.requesting(owner.address, "name");
    console.log(
        "123s"
    )

    // await sleep(10000)


    let temp = await factory.crowdFunding(0)
    console.log(temp, "temps")


  // console.log("Factory deployed to:", factory.target);

  const CrowdFunding = await ethers.getContractFactory("CrowdFunding");

  
  HardhatCrowdFunding =  CrowdFunding.attach(temp);
  // const CRowdFunding = await CrowdFunding.deploy(deployer.address, "Sample CrowdFunding");




  console.log("CrowdFunding deployed to:", HardhatCrowdFunding.target);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
