# 0G DA Node Setup Guide

This guide will help you set up a DA Node for OG Labs.
For official documentation, check [here](https://docs.0g.ai/run-a-node/da-node).

## Requirements

- **[Stake](https://0g.exploreme.pro/validators/0gvaloper1aax7fz4d904m0ul3e9v3lfq7cdzzw3ka8qk3mr?action=Delegate) 30 A0GI**
- Memory: 16 GB RAM
- CPU: 8 Cores
- Disk: 1TB NVME SSD
- Bandwidth: 100 Mbps (Download / Upload)

**You need to stake 30 A0GI to the validator to run 0G DA Node.**
<div class="highlight">

### Stake with AstroStake

Not in the Top 200 yet — but we’re building, we’re running, and we’re not stopping.

You can still run a DA Node by staking to my validator.

Every stake moves us closer 🚀

<a class="custom-button" href="https://0g.exploreme.pro/validators/0gvaloper1aax7fz4d904m0ul3e9v3lfq7cdzzw3ka8qk3mr?action=Delegate" target="_blank">
  🚀 Stake to AstroStake
</a>
</div>

<div class="custom-collapse">
<details>
  <summary>Staking via CLI</summary>

<div class="collapse-content">

**1. Download 0g binary**
```bash
cd $HOME
git clone https://github.com/0glabs/0g-chain.git
cd 0g-chain
git checkout v0.5.3
git submodule update --init
make install
0gchaind version
```

**2. Set-up Wallet**

Change `WalletName` to your real wallet name
:::tabs
== Create Wallet
To create a new wallet, use the following command. Don’t forget to save the mnemonic
```bash
0gchaind keys add WalletName
```
== Restore Wallet
To restore existing wallet, use the following command
```bash
0gchaind keys add WalletName --recover
```
== Restore Wallet (EVM)
If you use metamask or EVM, use this command to restore your wallet

```bash
0gchaind keys add WalletName --eth --recover
```
:::

**3. Stake**

change `WalletName` to your real wallet name

and you can change `--node https://evmrpc-testnet.0g.ai` to your favorite RPC
```bash
0gchaind tx staking delegate "0gvaloper1aax7fz4d904m0ul3e9v3lfq7cdzzw3ka8qk3mr" 30000000ua0gi --from "WalletName" --chain-id zgtendermint_16600-2 --gas-adjustment 1.5 --gas auto --gas-prices 0.00252ua0gi  --node https://evmrpc-testnet.0g.ai -y
```
</div>
</details>
</div>

## One-Click Command Install
```bash
bash <(wget -qO- https://astrostake.xyz/0GDA_Node_One_Click.sh)
```

## Manual Install

1. **Install necessary packages**
```bash
sudo apt-get update && sudo apt-get install clang cmake build-essential pkg-config libssl-dev protobuf-compiler llvm llvm-dev
```
2. **Install go**
```bash
cd $HOME && \
ver="1.22.0" && \
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz" && \
sudo rm -rf /usr/local/go && \
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz" && \
rm "go$ver.linux-amd64.tar.gz" && \
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> ~/.bash_profile && \
source ~/.bash_profile && \
go version
```
3. **Install rust**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
```bash
. "$HOME/.cargo/env"
```
4. **Clone 0G DA Node**
```bash
git clone -b v1.1.3 https://github.com/0glabs/0g-da-node.git
```
5. **Build project**
```bash
cd $HOME/0g-da-node
git stash
git fetch --all --tags
git checkout v1.1.3
git submodule update --init
cargo build --release
```
6. **Add Params**
```bash
./dev_support/download_params.sh
```
7. **Generate BLS private key**

:::warning Important!
After generating your BLS Private Key, make sure to **save it securely**.

- The key is only displayed **once** when generated.
- If you lose it, **it cannot be recovered**.
- If you ever need to **run your DA Node again** or **migrate to a new VPS**, you **must use the same BLS Private Key** to maintain your node identity.
- If the key is lost, you’ll need to **generate a new BLS Private Key** and **register a new wallet**, which means starting over with a new node identity.
:::
```bash
cargo run --bin key-gen
```
8. **Edit Config**
```bash
nano $HOME/0g-da-node/config.toml
```
:::info Edit Config File

Fill: `socket_address` `signer_bls_private_key` `signet_eth_private_key` `miner_eth_private_key`

```toml
log_level = "info"

data_path = "./db/"

# path to downloaded params folder
encoder_params_dir = "params/"

# grpc server listen address
grpc_listen_address = "0.0.0.0:34000"
# chain eth rpc endpoint
eth_rpc_endpoint = "https://evmrpc-testnet.0g.ai"
# public grpc service socket address to register in DA contract
# ip:34000 (keep same port as the grpc listen address)
# or if you have dns, fill your dns
socket_address = "VPS_Public_IP:34000"

# data availability contract to interact with
da_entrance_address = "0x857C0A28A8634614BB2C96039Cf4a20AFF709Aa9"
# deployed block number of da entrance contract
start_block_number = 940000

# signer BLS private key
signer_bls_private_key = ""
# signer eth account private key
signer_eth_private_key = ""
# miner eth account private key, (could be the same as `signer_eth_private_key`, but not recommended)
miner_eth_private_key = ""
# whether to enable data availability sampling
enable_das = "true"
```
:::

9. **Create service**
```bash
sudo tee /etc/systemd/system/0gda.service > /dev/null <<EOF
[Unit]
Description=0G-DA Node
After=network.target

[Service]
User=$USER
WorkingDirectory=$HOME/0g-da-node
ExecStart=$HOME/0g-da-node/target/release/server --config $HOME/0g-da-node/config.toml
Restart=always
RestartSec=10
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```
10. **Start service**
```bash
sudo systemctl daemon-reload && \
sudo systemctl enable 0gda && \
sudo systemctl start 0gda && \
sudo systemctl status 0gda
```
## Useful Commands

**Check Logs**
```bash
sudo journalctl -u 0gda -f -o cat
```
**Change RPC**
```bash
bash <(wget -qO- https://astrostake.xyz/change_da_rpc.sh)
```

## Stop and delete node

:::danger Critical: Backup Your BLS Key!

Do not lose this key — it is required to run your DA Node.

Location `$HOME/0g-da-node/config.toml`
:::

Stop
```bash
sudo systemctl stop 0gda
```

Delete
```bash
sudo systemctl disable 0gda
sudo rm /etc/systemd/system/0gda.service
rm -rf $HOME/0g-da-node
```


