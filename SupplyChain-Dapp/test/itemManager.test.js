const ItemManager = artifacts.require("./ItemManager.sol");

contract("ItemManager", accounts => {
    it("Should be able to create new item", async ()=> {
        const itemManagerInstance = await ItemManager.deployed();
        const itemName = "TestItem1";
        const itemPrice = 500;

        const result = await itemManagerInstance.createItem(itemName, 500, {from: accounts[0]});
        assert.equal(result.logs[0].args._itemIndex, 0, "It is not the first item");

        const item = await itemManagerInstance.items(0);
        assert.equal(item._identifier, itemName, "The identifier of item was different")
    });
});