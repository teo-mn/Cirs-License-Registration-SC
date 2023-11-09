// noinspection DuplicatedCode

import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers} from "hardhat";
import {expect} from "chai";

describe("Requirement Registration", function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
    const instanceLicense = await LicenseRegistration.deploy(owner.address, 'test');
    await instanceLicense.register(ethers.toUtf8Bytes("licenseID"),
        ethers.toUtf8Bytes("licenseName"),
        ethers.toUtf8Bytes("ownerID"),
        ethers.toUtf8Bytes("ownerName"),
        0,
        1,
        ethers.toUtf8Bytes("additionalData"),
    );


    const LicenseRequirementRegistration = await ethers.getContractFactory("LicenseRequirementRegistration");
    const instance = await LicenseRequirementRegistration.deploy(owner.address, 'test', instanceLicense.target);

    await instanceLicense.grantRole(await instance.ISSUER_ROLE(), instance.target);
    return {instance, owner, otherAccount, instanceLicense};
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
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;
    })
    it("registered data should be match", async function () {
      const {instance, instanceLicense} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;
      const requirement = await instance.getRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"));
      expect(requirement.length).to.equal(4);
      expect(requirement[0]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("requirementID")));
      expect(requirement[1]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("requirementName")));
      expect(requirement[2]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("REGISTERED")));
      expect(requirement[3]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("additionalData")));

      const x = await instanceLicense.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes("requirementID"))]);
    })
  });
  describe("revoke", function () {
    it("revoke without error", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;
      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("additionalData")
      )).not.to.be.reverted;
    })
    it("revoked data should be match", async function () {
      const {instance, instanceLicense} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;
      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("additionalData")
      )).not.to.be.reverted;
      const requirement = await instance.getRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"));
      expect(requirement.length).to.equal(4);
      expect(requirement[0]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("requirementID")));
      expect(requirement[1]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("requirementName")));
      expect(requirement[2]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("REVOKED")));
      expect(requirement[3]).to.equal(ethers.hexlify(ethers.toUtf8Bytes("additionalData")));

      const x = await instanceLicense.getLicenseRequirements(ethers.toUtf8Bytes("licenseID"));
      expect([...x]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes(""))]);
    })
  });
  describe("register evidence", function () {
    it("register evidence without error", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
    })
    it("registered evidence should be match", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;

      const x2 = await instance.getEvidences(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"));
      expect([...x2]).to.have.all.members([]);
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;

      const x = await instance.getEvidences(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"));
      expect([...x]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes("evidenceID"))]);
    })
  });
  describe("revoke evidence", function () {

    it("revoke evidence without error", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
      await expect(instance.revokeEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
    })
    it("revoked evidence should be match", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;

      const x = await instance.getEvidences(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"));
      expect([...x]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes("evidenceID"))]);
      await expect(instance.revokeEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;

      const x2 = await instance.getEvidences(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"));
      expect([...x2]).to.have.all.members([ethers.hexlify(ethers.toUtf8Bytes(""))]);
    })
  });
  describe("Pause", function () {
    it("pause", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
      await instance.pause();
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID2"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).to.be.reverted;

      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("additionalData")
      )).to.be.reverted;
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID2"), ethers.toUtf8Bytes("additionalData"))).to.be.reverted;
      await expect(instance.revokeEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID2"), ethers.toUtf8Bytes("additionalData"))).to.be.reverted;
    })
    it("unpause", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
      await instance.pause();
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID2"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).to.be.reverted;

      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("additionalData")
      )).to.be.reverted;
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID2"), ethers.toUtf8Bytes("additionalData"))).to.be.reverted;
      await expect(instance.revokeEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).to.be.reverted;

      await instance.unpause();
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID2"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).not.to.be.reverted;

      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID2"),
          ethers.toUtf8Bytes("additionalData")
      )).not.to.be.reverted;
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID2"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
      await expect(instance.revokeEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID2"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;

    })
  });
  describe("Event", function () {
    it("register", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).to.emit(instance, "LicenseRequirementRegistered")
          .withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("requirementID"),
              ethers.toUtf8Bytes("requirementName"));
    })
    it("revoke", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).to.emit(instance, "LicenseRequirementRegistered")
          .withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("requirementID"),
              ethers.toUtf8Bytes("requirementName"));

      await expect(instance.revoke(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("additionalData"),
      )).to.emit(instance, "LicenseRequirementRevoked")
          .withArgs(
              ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("requirementID"),
              ethers.toUtf8Bytes("additionalData"));
    })
    it("register evidence", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).to.emit(instance, "LicenseRequirementRegistered");
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID2"), ethers.toUtf8Bytes("additionalData")))
          .to.emit(instance, "EvidenceRegistered").withArgs(ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("requirementID"),
              ethers.toUtf8Bytes("evidenceID2"),
              ethers.toUtf8Bytes("additionalData"))
    })
    it("revoke evidence", async function () {
      const {instance} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"),
      )).to.emit(instance, "LicenseRequirementRegistered");
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID2"), ethers.toUtf8Bytes("additionalData")))
          .to.emit(instance, "EvidenceRegistered")
          .withArgs(ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("requirementID"),
              ethers.toUtf8Bytes("evidenceID2"),
              ethers.toUtf8Bytes("additionalData"))
      await expect(instance.revokeEvidence(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"), ethers.toUtf8Bytes("evidenceID2"), ethers.toUtf8Bytes("additionalData")))
          .to.emit(instance, "EvidenceRegistered")
          .withArgs(ethers.toUtf8Bytes("licenseID"),
              ethers.toUtf8Bytes("requirementID"),
              ethers.toUtf8Bytes("evidenceID2"),
              ethers.toUtf8Bytes("additionalData"))
    })
  });
  describe("Roles", function () {
    it("register with not permitted user", async function () {
      const {instance, otherAccount} = await loadFixture(deploy);
      await expect(instance.connect(otherAccount).register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"))).to.be.reverted;
    });
    it("revoke with not permitted user", async function () {
      const {instance, otherAccount} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
      await expect(instance.connect(otherAccount).revoke(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("additionalData"))).to.be.reverted;
    });

    it("register evidence with not permitted user", async function () {
      const {instance, otherAccount} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
      await expect(instance.connect(otherAccount).registerEvidence(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).to.be.reverted;
    });
    it("revoke with not permitted user", async function () {
      const {instance, otherAccount} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("requirementName"),
          ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
      await expect(instance.registerEvidence(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("evidenceID"), ethers.toUtf8Bytes("additionalData"))).not.to.be.reverted;
      await expect(instance.connect(otherAccount).revokeEvidence(ethers.toUtf8Bytes("licenseID"),
          ethers.toUtf8Bytes("requirementID"),
          ethers.toUtf8Bytes("evidenceID"),
          ethers.toUtf8Bytes("additionalData"))).to.be.reverted;
    });

  })
});
