// noinspection DuplicatedCode

import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers} from "hardhat";
import {expect} from "chai";

describe("License Registration", function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");

    const instance = await LicenseRegistration.deploy(owner.address, 'test');
    return {instance, owner, otherAccount};
  }

  describe("Deployment and Access Control", async function () {
    it('name', async function () {
      const {instance} = await loadFixture(deploy);
      expect(await instance.name()).equal('test')
    })
    it("initial roles", async function () {
      const {instance, owner, otherAccount} = await loadFixture(deploy);
      expect(await instance.hasRole(await instance.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
      expect(await instance.hasRole(await instance.PAUSER_ROLE(), owner.address)).to.equal(true);
      expect(await instance.hasRole(await instance.ISSUER_ROLE(), owner.address)).to.equal(true);
      expect(await instance.hasRole(await instance.DEFAULT_ADMIN_ROLE(), otherAccount.address)).to.equal(false);
      expect(await instance.hasRole(await instance.PAUSER_ROLE(), otherAccount.address)).to.equal(false);
      expect(await instance.hasRole(await instance.ISSUER_ROLE(), otherAccount.address)).to.equal(false);
    })
    it("grant role, has role", async function () {
      const {instance, otherAccount} = await loadFixture(deploy);
      await instance.grantRole(await instance.ISSUER_ROLE(), otherAccount.address);
      expect(await instance.hasRole(await instance.ISSUER_ROLE(), otherAccount.address)).to.equal(true);
      await instance.revokeRole(await instance.ISSUER_ROLE(), otherAccount.address);
      expect(await instance.hasRole(await instance.ISSUER_ROLE(), otherAccount.address)).to.equal(false);
    })
  });
  describe("register", function () {
    it("register without error", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
    })
    it("registered data should be match", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      const license = await instance.getLicense(ethers.toUtf8Bytes("licenseID"));
      expect(license.length).to.equal(8);
      expect(license[0]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseID")));
      expect(license[1]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseName")));
      expect(license[2]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerID")));
      expect(license[3]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerName")));
      expect(license[4]).to.equal(0);
      expect(license[5]).to.equal(1);
      expect(license[6]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("REGISTERED")));
      expect(license[7]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("additionalDataID")));
    })
    it("re register should be overwritten", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      const license = await instance.getLicense(ethers.toUtf8Bytes("licenseID"));
      expect(license.length).to.equal(8);
      expect(license[0]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseID")));
      expect(license[1]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseName")));
      expect(license[2]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerID")));
      expect(license[3]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerName")));
      expect(license[4]).to.equal(0);
      expect(license[5]).to.equal(1);
      expect(license[6]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("REGISTERED")));
      expect(license[7]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("additionalDataID")));


      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName2"),
          ethers.toUtf8Bytes("ownerID2"),
          ethers.toUtf8Bytes("ownerName2"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID2"),
      )).not.to.be.reverted;
      const license2 = await instance.getLicense(ethers.toUtf8Bytes("licenseID"));
      expect(license2.length).to.equal(8);
      expect(license2[0]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseID")));
      expect(license2[1]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseName2")));
      expect(license2[2]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerID2")));
      expect(license2[3]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerName2")));
      expect(license2[4]).to.equal(0);
      expect(license2[5]).to.equal(1);
      expect(license2[6]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("REGISTERED")));
      expect(license2[7]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("additionalDataID2")));
    })
  });
  describe("revoke", function () {
    it("revoke without error", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("description"))).not.to.be.reverted;
    })
    it("revoked data should be match", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("description"))).not.to.be.reverted;
      const license = await instance.getLicense(ethers.toUtf8Bytes("licenseID"));
      expect(license.length).to.equal(8);
      expect(license[0]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseID")));
      expect(license[1]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseName")));
      expect(license[2]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerID")));
      expect(license[3]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerName")));
      expect(license[4]).to.equal(0);
      expect(license[5]).to.equal(1);
      expect(license[6]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("REVOKED")));
      expect(license[7]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("additionalDataID")));
    })
    it("register after revoke", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("description"))).not.to.be.reverted;
      let license = await instance.getLicense(ethers.toUtf8Bytes("licenseID"));
      expect(license.length).to.equal(8);
      expect(license[0]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseID")));
      expect(license[1]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseName")));
      expect(license[2]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerID")));
      expect(license[3]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerName")));
      expect(license[4]).to.equal(0);
      expect(license[5]).to.equal(1);
      expect(license[6]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("REVOKED")));
      expect(license[7]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("additionalDataID")));
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      license = await instance.getLicense(ethers.toUtf8Bytes("licenseID"));
      expect(license.length).to.equal(8);
      expect(license[0]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseID")));
      expect(license[1]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("licenseName")));
      expect(license[2]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerID")));
      expect(license[3]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("ownerName")));
      expect(license[4]).to.equal(0);
      expect(license[5]).to.equal(1);
      expect(license[6]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("REGISTERED")));
      expect(license[7]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("additionalDataID")));
    })
  });
  describe("register requirements", function () {
    it("register without error", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"))).not.to.be.reverted;
    })
    it("registered data should be match", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"))).not.to.be.reverted;
      const x = await instance.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes("requirementID"))]);
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID2"))).not.to.be.reverted;
      const x2 = await instance.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x2]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes("requirementID")), ethers.hexlify(ethers.toUtf8Bytes("requirementID2"))]);
    })
    it("registered data should be match", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      const items = [];
      for (let i = 0; i < 10; i++) {
        items.push(ethers.hexlify(ethers.toUtf8Bytes(`requirementID${i}`)));
        await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes(`requirementID${i}`))).not.to.be.reverted;
      }
      const x = await instance.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x]).to.have.all.members(items);
    })
  });
  describe("revoke requirements", function () {
    it("revoke without error", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"))).not.to.be.reverted;
      await expect(instance.revokeRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("description"))).not.to.be.reverted;
    })
    it("revoked data should be match", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"))).not.to.be.reverted;
      await expect(instance.revokeRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("description"))).not.to.be.reverted;

      const x = await instance.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes(""))]);
    })
    it("register after revoke", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"))).not.to.be.reverted;
      await expect(instance.revokeRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("description"))).not.to.be.reverted;

      const x = await instance.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes(""))]);
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"))).not.to.be.reverted;
      const x2 = await instance.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x2]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes("")), ethers.hexlify(ethers.toUtf8Bytes("requirementID"))]);
    })
    it("get data after license revoke", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted;
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"))).not.to.be.reverted;
      const x = await instance.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes("requirementID"))]);
      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("description"))).not.to.be.reverted;

      const x2 = await instance.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x2]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes("requirementID"))]);
    })
  });
  describe("Pause", function () {
    it("pause without error", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"))).not.to.be.reverted;
      await expect(instance.pause()).not.to.be.reverted;
      await expect(instance.register(ethers.toUtf8Bytes("licenseID2"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).to.be.reverted
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID2"))).to.be.reverted;
      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("description"))).to.be.reverted;
      await expect(instance.revokeRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("description"))).to.be.reverted;
    })
    it("unpause", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted
      await expect(instance.pause()).not.to.be.reverted;
      await expect(instance.unpause()).not.to.be.reverted;
      await expect(instance.register(ethers.toUtf8Bytes("licenseID2"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).not.to.be.reverted
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID2"))).not.to.be.reverted;
      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("description"))).not.to.be.reverted;
      await expect(instance.revokeRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("description"))).not.to.be.reverted;
    })
  });
  describe("Event", function () {
    it("register", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).to.emit(instance, "LicenseRegistered")
          .withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("licenseName"),
              ethers.toUtf8Bytes("ownerID"),
              ethers.toUtf8Bytes("ownerName"),
              0,
              1);
    })
    it("revoke", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).to.emit(instance, "LicenseRegistered")
          .withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("licenseName"),
              ethers.toUtf8Bytes("ownerID"),
              ethers.toUtf8Bytes("ownerName"),
              0,
              1);
      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("description")))
          .to.emit(instance, "LicenseRevoked").withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("description")
          )
    })
    it("register requirement", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).to.emit(instance, "LicenseRegistered")
          .withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("licenseName"),
              ethers.toUtf8Bytes("ownerID"),
              ethers.toUtf8Bytes("ownerName"),
              0,
              1);
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID")))
          .to.emit(instance, "LicenseRequirementRegistered").withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("requirementID")
          )
    })
    it("revoke requirement", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("licenseName"),
          ethers.toUtf8Bytes("ownerID"),
          ethers.toUtf8Bytes("ownerName"),
          0,
          1,
          ethers.toUtf8Bytes("additionalDataID"),
      )).to.emit(instance, "LicenseRegistered")
          .withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("licenseName"),
              ethers.toUtf8Bytes("ownerID"),
              ethers.toUtf8Bytes("ownerName"),
              0,
              1);
      await expect(instance.registerRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID")))
          .to.emit(instance, "LicenseRequirementRegistered").withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("requirementID")
          )

      await expect(instance.revokeRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("description")))
          .to.emit(instance, "LicenseRequirementRegistered").withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("requirementID"),
              ethers.toUtf8Bytes("description")
          )
    })
  });
});
