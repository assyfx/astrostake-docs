# Aztec Sequencer Node

This guide will help you set up a Aztec Sequencer Node. For official documentation, check [here](https://docs.aztec.network/the_aztec_network/guides/run_nodes).

## System Requirements

- CPU : 8 Cores
- RAM : 16GB
- Disk : 1 TB

## Preparation

Before setting up the Aztec Sequencer Node, make sure you have the following:

| Requirement               | Details |
|-----------------------------|------------|
| **1. EVM Wallet Private Key** | A private key from your Ethereum wallet. Needed to interact with the network. Make sure to keep it safe and never expose it publicly. |
| **2. ETH Sepolia Faucet**    | You'll need Sepolia ETH to operate the node.<br><br>• [Google Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) – Free 0.05 ETH<br>• [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) – Free 0.1 ETH (requires 0.001 ETH on Ethereum Mainnet) |
| **3. Sepolia RPC & Beacon RPC** | Access to Sepolia RPC and Beacon RPC is required.<br><br>• [Alchemy](https://dashboard.alchemy.com/) – Paid Sepolia RPC (Free 100M trial requests)<br>• [drpc.org](https://drpc.org) – Free Beacon RPC<br>• [Publicnode](https://ethereum.publicnode.com/?sepolia) – Free Sepolia & Beacon RPC |


## Auto Installer

Paste this script inside screen or tmux.

This script is not updated, please use manual installation.

```bash
bash <(wget -qO- https://vault.astrostake.xyz/aztec/aztec_sequencer_install.sh)
```

## Manual Installation

1. **Install Dependencies**
```bash
apt install curl iptables build-essential git wget lz4 jq make gcc nano automake autoconf tmux htop nvme-cli libgbm1 pkg-config libssl-dev libleveldb-dev tar clang bsdmainutils ncdu unzip libleveldb-dev -y
```
2. **Install Docker**

You can skip it if you already have it installed.
```bash
apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt-cache policy docker-ce
apt install docker-ce -y
systemctl restart docker
systemctl enable docker
```
Verify
```bash
docker --version
```
3. **Install Aztec**
```bash
bash -i <(curl -s https://install.aztec.network)
```
```bash
echo 'export PATH="$PATH:/root/.aztec/bin"' >> ~/.bashrc && source ~/.bashrc
```
Verify Installation
```bash
aztec
```
4. **Setup Alpha Testnet**
```bash
aztec-up alpha-testnet
```
5. **Run Aztec**

Open tmux or screen. In this case i will use tmux
```bash
tmux new -s aztec
```
:::info Configure

`--l1-rpc-urls` `--l1-consensus-host-urls` `--sequencer.validatorPrivateKey` `--sequencer.coinbase` `--p2p.p2pIp` 
```bash
aztec start --node --archiver --sequencer \
  --network alpha-testnet \
  --l1-rpc-urls https://your-sepolia-rpc  \
  --l1-consensus-host-urls https://your-beacon-rpc \
  --sequencer.validatorPrivateKey 0xYourPrivateKey \
  --sequencer.coinbase 0xYourAddress \
  --p2p.p2pIp YOUR_PUBLIC_IP
  --p2p.maxTxPoolSize 1000000000
```
:::

## Usefull Command

Get latest block number
```bash
curl -s -X POST -H 'Content-Type: application/json' \
-d '{"jsonrpc":"2.0","method":"node_getL2Tips","params":[],"id":67}' \
http://localhost:8080 | jq -r ".result.proven.number"
```
Get Proof
```bash
BLOCK_NUMBER=$(curl -s -X POST -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"node_getL2Tips","params":[],"id":67}' \
  http://localhost:8080 | jq -r ".result.proven.number")

curl -s -X POST -H 'Content-Type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"node_getArchiveSiblingPath\",\"params\":[\"$BLOCK_NUMBER\",\"$BLOCK_NUMBER\"],\"id\":67}" \
  http://localhost:8080 | jq -r ".result"
```
Check PeerId and search on https://aztec.nethermind.io/
```bash
sudo docker logs $(docker ps -q --filter ancestor=aztecprotocol/aztec:alpha-testnet | head -n 1) 2>&1 | grep -i "peerId" | grep -o '"peerId":"[^"]*"' | cut -d'"' -f4 | head -n 1
```

Register as Validator
```bash
aztec add-l1-validator \
  --l1-rpc-urls RPC_URL \
  --private-key your-private-key \
  --attester your-validator-address \
  --proposer-eoa your-validator-address \
  --staking-asset-handler 0xF739D03e98e23A7B65940848aBA8921fF3bAc4b2 \
  --l1-chain-id 11155111
```
:::info Cek validator via cast call
```bash
curl -L https://foundry.paradigm.xyz | bash
```
```bash
source ~/.bashrc
```
change `YOUR_WALLET_ADDRESS`
```bash
cast call 0x8d1cc702453fa889f137dbd5734cdb7ee96b6ba0 "getInfo(address)" YOUR_WALLET_ADDRESS --rpc-url https://sepolia.drpc.org
```
:::
