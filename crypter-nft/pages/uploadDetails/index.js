import React, { useState } from "react";
import cn from "classnames";
import styles from "./UploadDetails.module.sass";
import Dropdown from "../../components/Dropdown";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Switch from "../../components/Switch";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Preview from "./Preview";
import Cards from "./Cards";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { artboardAddress, nftmarketaddress } from "../../../config";
import ArtBoard from "../../../artifacts/contracts/Artboard.sol/Artboard.json";
import MarketPlace from "../../../artifacts/contracts/MarketPlace.sol/MarketPlace.json";
import { ethers } from "ethers";

import FolowSteps from "./FolowSteps";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const royaltiesOptions = ["10%", "20%", "30%"];

const items = [
  {
    title: "Create collection",
    color: "#4BC9F0",
  },
  {
    title: "Crypto Legend - Professor",
    color: "#45B26B",
  },
  {
    title: "Crypto Legend - Professor",
    color: "#EF466F",
  },
  {
    title: "Legend Photography",
    color: "#9757D7",
  },
];

const Upload = () => {
  const [royalties, setRoyalties] = useState(royaltiesOptions[0]);

  const [sale, setSale] = useState(true);
  const [price, setPrice] = useState(false);
  const [locking, setLocking] = useState(false);

  const [visibleModal, setVisibleModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState(0);
  const [property, setProperties] = useState(0);
  const [fileUrl, setFileUrl] = useState(null);
  const [visiblePreview, setVisiblePreview] = useState(false);

  async function setImage(event) {
    try {
      const file = event.target.files[0];
      const upload = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });

      setSize(upload.size);
      const url = `https://ipfs.infura.io/ipfs/${upload.path}`;
      setFileUrl(url);
    } catch (error) {
      throw new Error(error);
    }
  }
  async function createItem() {
    if (!name || !description || !fileUrl) {
      throw new Error("Please fill all fields");
    }
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    const added = await client.add(data);
    console.log(added);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    await mintToken(url);
  }
  async function mintToken(url) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(artboardAddress, ArtBoard.abi, signer);
      let transaction = await contract.createToken(url);
      let tx = await transaction.wait();
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      const price = ethers.utils.parseUnits("1000", "ether");
      contract = new ethers.Contract(nftmarketaddress, MarketPlace.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      transaction = await contract.createMarketItem(
        artboardAddress,
        tokenId,
        price,
        { value: listingPrice }
      );
      await transaction.wait();

      console.log(transaction);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.wrapper}>
            <div className={styles.head}>
              <div className={cn("h2", styles.title)}>
                Create single collectible
              </div>
              <button
                className={cn("button-stroke button-small", styles.button)}
              >
                Switch to Multiple
              </button>
            </div>
            <form className={styles.form} action="">
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Upload file</div>
                  <div className={styles.note}>
                    Drag or choose your file to upload
                  </div>
                  <div className={styles.file}>
                    <input
                      className={styles.load}
                      type="file"
                      onChange={setImage}
                    />
                    <div className={styles.icon}>
                      <Icon name="upload-file" size="24" />
                    </div>
                    <div className={styles.format}>
                      PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
                    </div>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>Item Details</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="Item name"
                      type="text"
                      setValue={setName}
                      name={name}
                      placeholder='e. g. Redeemable Bitcoin Card with logo"'
                      required
                    />
                    <TextInput
                      className={styles.field}
                      label="Description"
                      setValue={setDescription}
                      name={description}
                      type="text"
                      placeholder="e. g. “After purchasing you will able to recived the logo...”"
                      required
                    />
                    <div className={styles.row}>
                      <div className={styles.col}>
                        <div className={styles.field}>
                          <div className={styles.label}>Royalties</div>
                          <Dropdown
                            className={styles.dropdown}
                            value={royalties}
                            setValue={setRoyalties}
                            options={royaltiesOptions}
                          />
                        </div>
                      </div>
                      <div className={styles.col}>
                        <TextInput
                          className={styles.fxield}
                          label="Size"
                          name={size}
                          setValue={setSize}
                          type="text"
                          placeholder="e. g. Size"
                          required
                        />
                      </div>
                      <div className={styles.col}>
                        <TextInput
                          className={styles.field}
                          label="Propertie"
                          name={property}
                          setValue={setProperties}
                          type="text"
                          placeholder="e. g. Propertie"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.options}>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Put on sale</div>
                    <div className={styles.text}>
                      You’ll receive bids on this item
                    </div>
                  </div>
                  <Switch value={sale} setValue={setSale} />
                </div>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Instant sale price</div>
                    <div className={styles.text}>
                      Enter the price for which the item will be instantly sold
                    </div>
                  </div>
                  <Switch value={price} setValue={setPrice} />
                </div>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Unlock once purchased</div>
                    <div className={styles.text}>
                      Content will be unlocked after successful transaction
                    </div>
                  </div>
                  <Switch value={locking} setValue={setLocking} />
                </div>
                <div className={styles.category}>Choose collection</div>
                <div className={styles.text}>
                  Choose an exiting collection or create a new one
                </div>
                <Cards className={styles.cards} items={items} />
              </div>
              <div className={styles.foot}>
                <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  Preview
                </button>
                <button
                  className={cn("button", styles.button)}
                  onClick={createItem}
                  type="button"
                >
                  <span>Create item</span>
                  <Icon name="arrow-next" size="10" />
                </button>
                <div className={styles.saving}>
                  <span>Auto saving</span>
                  <Loader className={styles.loader} />
                </div>
              </div>
            </form>
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            onClose={() => setVisiblePreview(false)}
          />
        </div>
      </div>
      <Modal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <FolowSteps className={styles.steps} />
      </Modal>
    </>
  );
};

export default Upload;
