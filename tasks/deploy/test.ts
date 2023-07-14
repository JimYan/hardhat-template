import { arrayify } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/solidity";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import Info from "./gold.json";

function getMessageBytes(
  id: string,
  producer: string,
  location: string,
  weight: number,
  time: number,
  parentIds: number[],
  type: number,
): Uint8Array {
  const message = keccak256(
    ["bytes", "bytes2", "bytes", "uint32", "uint256", "uint32[]", "uint8"],
    [id, producer, location, weight, time, parentIds, type],
  );
  return arrayify(message);
}

const strToHex = (str: string): string => {
  return "0x" + Buffer.from(str, "utf8").toString("hex");
};

const producer = strToHex("AB");
const location = strToHex("shenzhen");
const weight = 100;
const time = new Date().getTime();
const id = strToHex("ABCDEFGH");
const parentId = [0];
const type = 0;

const signHash = getMessageBytes(id, producer, location, weight, time, parentId, type); // 对签名数据进行转换

task("test:gold").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin = signers[0];
  const hash = await admin.signMessage(signHash);
  console.log(hash);
  console.log(await admin.getBalance());

  // const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  // const wallet = new ethers.Wallet(admin.privateKey, provider);

  const contracts = new ethers.Contract("0x26eCBdf0FaE5e9B20Ae7854A327AF4556E3b8a6f", Info.abi, admin);
  // await contracts.createGoldBlock(id, producer, location, weight, time, parentId, type, hash);
  const log = await contracts.goldBlocks(1);
  console.log(log);
});

task("test:gold2").setAction(async function () {
  // const signers: SignerWithAddress[] = await ethers.getSigners();
  console.log(Info.abi);
});