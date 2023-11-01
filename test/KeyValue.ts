import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {ethers} from "hardhat";
import {expect} from "chai";

describe("Key Value", function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const KeyValue = await ethers.getContractFactory("KeyValue");

    const instance = await KeyValue.deploy(owner.address, 'test');
    return {instance, owner, otherAccount};
  }
  describe("Deployment and Access Control", async function () {
    it('name', async function () {
      const { instance } = await loadFixture(deploy);
      expect(await instance.name()).equal('test')
    })
    it("initial roles", async function () {
      const { instance, owner, otherAccount } = await loadFixture(deploy);
      expect(await instance.hasRole(await instance.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
      expect(await instance.hasRole(await instance.PAUSER_ROLE(), owner.address)).to.equal(true);
      expect(await instance.hasRole(await instance.ISSUER_ROLE(), owner.address)).to.equal(true);
      expect(await instance.hasRole(await instance.DEFAULT_ADMIN_ROLE(), otherAccount.address)).to.equal(false);
      expect(await instance.hasRole(await instance.PAUSER_ROLE(), otherAccount.address)).to.equal(false);
      expect(await instance.hasRole(await instance.ISSUER_ROLE(), otherAccount.address)).to.equal(false);
    })
    it("grant role, has role", async function () {
      const { instance, otherAccount } = await loadFixture(deploy);
      await instance.grantRole(await instance.ISSUER_ROLE(), otherAccount.address);
      expect(await instance.hasRole(await instance.ISSUER_ROLE(), otherAccount.address)).to.equal(true);
      await instance.revokeRole(await instance.ISSUER_ROLE(), otherAccount.address);
      expect(await instance.hasRole(await instance.ISSUER_ROLE(), otherAccount.address)).to.equal(false);
    })
  });
  describe("Set/get data", function () {
    it("set without error", async function () {
      const { instance } = await loadFixture(deploy);
      await expect(instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"))).not.to.be.reverted
    });
    it("get data should be matched", async function () {
      const { instance } = await loadFixture(deploy);
      await expect(instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"))).not.to.be.reverted
      const value = await instance.getData(ethers.toUtf8Bytes("key"));
      expect(ethers.hexlify(ethers.toUtf8Bytes("value"))).equal(value)
      await expect(instance.setData(ethers.toUtf8Bytes("key2"), ethers.toUtf8Bytes("value2"))).not.to.be.reverted
      const value2 = await instance.getData(ethers.toUtf8Bytes("key2"));
      expect(ethers.hexlify(ethers.toUtf8Bytes("value2"))).equal(value2)
      await expect(instance.setData(ethers.toUtf8Bytes("түлхүүр"), ethers.toUtf8Bytes("утга"))).not.to.be.reverted
      const value3 = await instance.getData(ethers.toUtf8Bytes("түлхүүр"));
      expect(ethers.hexlify(ethers.toUtf8Bytes("утга"))).equal(value3)
    });
    it("re set data", async function () {
      const { instance} = await loadFixture(deploy);
      await expect(instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"))).not.to.be.reverted
      const value = await instance.getData(ethers.toUtf8Bytes("key"));
      expect(ethers.hexlify(ethers.toUtf8Bytes("value"))).equal(value)
      await expect(instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("valueNew"))).not.to.be.reverted
      const valueNew = await instance.getData(ethers.toUtf8Bytes("key"));
      expect(ethers.hexlify(ethers.toUtf8Bytes("valueNew"))).equal(valueNew)
    });
    it("set with not permitted user", async function () {
      const { instance, otherAccount } = await loadFixture(deploy);
      await expect(instance.connect(otherAccount).setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"))).to.be.reverted
    });
    it("get with not permitted user", async function () {
      const { instance, otherAccount } = await loadFixture(deploy);
      await expect(instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"))).not.to.be.reverted

      const value = await instance.connect(otherAccount).getData(ethers.toUtf8Bytes("key"));
      expect(ethers.hexlify(ethers.toUtf8Bytes("value"))).equal(value)
    });
  });
  describe("Pause", function () {
    it("set function should be disabled after pause function", async function () {
      const { instance } = await loadFixture(deploy);
      await instance.pause();
      await expect(instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"))).to.be.reverted
    });
    it("get function should be work after pause function", async function () {
      const { instance } = await loadFixture(deploy);
      await expect(instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"))).not.to.be.reverted
      await instance.pause();
      const value = await instance.getData(ethers.toUtf8Bytes("key"));
      expect(ethers.hexlify(ethers.toUtf8Bytes("value"))).equal(value)
    });
    it("set and get both available after unpause function call", async function () {
      const { instance } = await loadFixture(deploy);
      await expect(instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"))).not.to.be.reverted
      await instance.pause();
      const value = await instance.getData(ethers.toUtf8Bytes("key"));
      expect(ethers.hexlify(ethers.toUtf8Bytes("value"))).equal(value)
      await instance.unpause();

      await expect(instance.setData(ethers.toUtf8Bytes("key2"), ethers.toUtf8Bytes("value2"))).not.to.be.reverted
      const value2 = await instance.getData(ethers.toUtf8Bytes("key2"));
      expect(ethers.hexlify(ethers.toUtf8Bytes("value2"))).equal(value2)
    });
  });
  describe("Event", function () {
    it("set data event", async function () {
      const { instance} = await loadFixture(deploy);
      await expect(instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value")))
          .to.emit(instance, "SetData").withArgs(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"));
    })
  });
});
