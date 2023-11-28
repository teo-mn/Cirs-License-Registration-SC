// noinspection DuplicatedCode

import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers} from "hardhat";
import {expect} from "chai";

describe("License Product Registration", function () {
  async function deploy() {
    const [owner, otherAccount, account1, account2, account3] = await ethers.getSigners();

    const LicenseProductRegistration = await ethers.getContractFactory("LicenseProductRegistration");

    const instance = await LicenseProductRegistration.deploy(owner.address);
    return {instance, owner, otherAccount, account1, account2, account3};
  }

  describe("Deployment and Access Control", async function () {
    it("initial roles", async function () {
      const { instance, owner, otherAccount } = await loadFixture(deploy);
      expect(await instance.hasRole(await instance.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
      expect(await instance.hasRole(await instance.ISSUER_ROLE(), owner.address)).to.equal(true);
      expect(await instance.hasRole(await instance.DEFAULT_ADMIN_ROLE(), otherAccount.address)).to.equal(false);
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
  describe("Event", function () {
    it("register", async function () {
      const {instance, account1, account2, account3} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("name"), account1.address, account2.address, account3.address))
          .to.emit(instance, "Register").withArgs(ethers.toUtf8Bytes("name"), account1.address, account2.address, account3.address);
    })
    it("revoke", async function () {
      const {instance, account1, account2, account3} = await loadFixture(deploy);
      await expect(instance.register(ethers.toUtf8Bytes("name"), account1.address, account2.address, account3.address))
          .to.emit(instance, "Register").withArgs(ethers.toUtf8Bytes("name"), account1.address, account2.address, account3.address);
      await expect(instance.revoke(ethers.toUtf8Bytes("name"), account1.address, account2.address, account3.address))
          .to.emit(instance, "Revoke").withArgs(ethers.toUtf8Bytes("name"), account1.address, account2.address, account3.address);
    })
  });
});
