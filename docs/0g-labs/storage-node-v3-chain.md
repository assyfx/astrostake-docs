---
title: Storage Node Setup Guide (V3 Galileo)
description: Step-by-step guide for setting up 0G Labs storage node using AstroStake tools.
---

# Storage Node Setup Guide (V3 Galileo)

This guide will help you set up a Storage Node for OG Labs.
For official documentation, check [here](https://docs.0g.ai/run-a-node/storage-node).

## Requirements
- Memory: 32 GB RAM
- CPU: 8 Cores
- Disk: 500GB / 1TB NVME SSD
- Bandwidth: 100 Mbps (Download / Upload)

----
## Migration from V2

<div class="custom-collapse">
<details>
  <summary>Already installed a previous version? Click here for the migration guide from v2 to v3.</summary>

<div class="collapse-content">

Version: `v1.0.0`

## One-Click Command
```bash
bash <(wget -qO- https://raw.githubusercontent.com/astrostake/0G-Labs-script/refs/heads/main/storage-node/galileo/migration_storage_node_v3.sh)
```

## Manual Install

1. **Stop Service**

```bash
systemctl stop zgs
```

2. **Remove db folder**
```bash
rm -rf $HOME/0g-storage-node/run/db
```

3. **Backup Config**

```bash
cp $HOME/0g-storage-node/run/config.toml $HOME/zgs-config.toml.backup
```
4. **Update to v1.0.0**
```bash
cd $HOME/0g-storage-node
git stash
git fetch --all --tags
git checkout v1.0.0
git submodule update --init
cargo build --release
```

5. **Download V3 Config**

```bash
rm -rf $HOME/0g-storage-node/run/config.toml
curl -o $HOME/0g-storage-node/run/config.toml https://vault.astrostake.xyz/0g-labs/config-v3.toml
```

:::info
check `miner_key` and input your private key

```bash
nano $HOME/0g-storage-node/run/config.toml
```
:::

6. **Delete and Create New Service**
```bash
sudo rm -f /etc/systemd/system/zgs.service
```
```bash
sudo tee /etc/systemd/system/zgs.service > /dev/null <<EOF
[Unit]
Description=ZGS Node
After=network.target

[Service]
User=$USER
WorkingDirectory=$HOME/0g-storage-node/run
ExecStart=$HOME/0g-storage-node/target/release/zgs_node --config $HOME/0g-storage-node/run/config.toml
Restart=on-failure
RestartSec=10
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

7. **Restart Service**

```bash
sudo systemctl daemon-reload && sudo systemctl enable zgs && sudo systemctl start zgs
```
</div>
</details>
</div>

## Update to New Contract

<div class="custom-collapse">
<details>
  <summary>Click here to see how to update to the new contract.</summary>

<div class="collapse-content">

Stop zgs service
```bash
systemctl stop zgs
```

Delete old `db`
```bash
rm -rf $HOME/0g-storage-node/run/db
```
:::tabs
== Download new config
Download new config
```bash
rm -rf $HOME/0g-storage-node/run/config.toml
curl -o $HOME/0g-storage-node/run/config.toml https://vault.astrostake.xyz/0g-labs/config-v3.toml
```

> Check `miner_key` and input your private key
```bash
nano $HOME/0g-storage-node/run/config.toml
```

== Edit existing config
Edit `config.toml`
```bash
#!/bin/bash

# Detect config file
if [ -f "$HOME/0g-storage-node/run/config.toml" ]; then
  CONFIG_FILE="$HOME/0g-storage-node/run/config.toml"
elif [ -f "$HOME/0g-storage-node/run/config-testnet-turbo.toml" ]; then
  CONFIG_FILE="$HOME/0g-storage-node/run/config-testnet-turbo.toml"
else
  echo "No config file found (config.toml or config-testnet-turbo.toml)."
  exit 1
fi

echo "Editing config file: $CONFIG_FILE"

# Define new contract addresses and block number
LOG_CONTRACT="0xbD75117F80b4E22698D0Cd7612d92BDb8eaff628"
LOG_BLOCK=326165
MINE_CONTRACT="0x3A0d1d67497Ad770d6f72e7f4B8F0BAbaa2A649C"
REWARD_CONTRACT="0xd3D4D91125D76112AE256327410Dd0414Ee08Cb4"

# Backup original config
cp "$CONFIG_FILE" "$CONFIG_FILE.bak"

# Update values using sed
sed -i "s/^log_contract_address = \".*\"/log_contract_address = \"$LOG_CONTRACT\"/" "$CONFIG_FILE"
sed -i "s/^log_sync_start_block_number = .*/log_sync_start_block_number = $LOG_BLOCK/" "$CONFIG_FILE"
sed -i "s/^mine_contract_address = \".*\"/mine_contract_address = \"$MINE_CONTRACT\"/" "$CONFIG_FILE"
sed -i "s/^reward_contract_address = \".*\"/reward_contract_address = \"$REWARD_CONTRACT\"/" "$CONFIG_FILE"

echo "Contract addresses and start block updated successfully."
```
:::

Restart zgs service
```bash
systemctl restart zgs
```

</div>
</details>
</div>

## One-Click Command Update

This command only updates your node version. If you're moving from v2 to v3, make sure to follow the migration guide instead.

version: `v1.0.0`
```bash
bash <(wget -qO- https://raw.githubusercontent.com/astrostake/0G-Labs-script/refs/heads/main/storage-node/galileo/storage_node_update_v3.sh)
```

## One Click Command Install

```bash
bash <(wget -qO- https://raw.githubusercontent.com/astrostake/0G-Labs-script/refs/heads/main/storage-node/galileo/0g_storage_node_v3_chain.sh)
```

## Manual Install

1. **Install necessary packages**
```bash
sudo apt-get update
sudo apt-get install clang cmake build-essential openssl pkg-config libssl-dev jq git bc
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
3. **Install rustup**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
```bash
. "$HOME/.cargo/env"
```
4. **Download and Install 0G Storage Node**
```bash
git clone -b v1.0.0 https://github.com/0glabs/0g-storage-node.git
```
```bash
cd $HOME/0g-storage-node
git stash
git fetch --all --tags
git checkout v1.0.0
git submodule update --init
cargo build --release
```
5. **Set config**

```bash
rm -rf $HOME/0g-storage-node/run/config.toml
curl -o $HOME/0g-storage-node/run/config.toml https://vault.astrostake.xyz/0g-labs/config-v3.toml
```

:::info
check `miner_key` and input your private key
```bash
nano $HOME/0g-storage-node/run/config.toml
```
:::

6. **Create service**
```bash
sudo tee /etc/systemd/system/zgs.service > /dev/null <<EOF
[Unit]
Description=ZGS Node
After=network.target

[Service]
User=$USER
WorkingDirectory=$HOME/0g-storage-node/run
ExecStart=$HOME/0g-storage-node/target/release/zgs_node --config $HOME/0g-storage-node/run/config.toml
Restart=on-failure
RestartSec=10
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```
7. **Star service**
```bash
sudo systemctl daemon-reload && sudo systemctl enable zgs && sudo systemctl start zgs
```
## Optional: [Install Snapshot](/0g-labs/snapshot-v3)

## Troubleshooting

:::info
If you face any errors during node installation, please refer to the [Troubleshooting Guide](/0g-labs/troubleshooting-storage-node).
:::

## Useful Commands
**Check Full Logs**
```bash
tail -f ~/0g-storage-node/run/log/zgs.log.$(TZ=UTC date +%Y-%m-%d)
```

**Check Blocks and Peers**
```bash
source <(curl -s https://raw.githubusercontent.com/astrostake/0G-Labs-script/refs/heads/main/storage-node/check_block.sh)
```

**Change RPC**
```bash
bash <(wget -qO- https://raw.githubusercontent.com/astrostake/0G-Labs-script/refs/heads/main/storage-node/change_storage_rpc.sh)
```

## Stop and delete node

Stop
```bash
sudo systemctl stop zgs
```

Delete
```bash
sudo systemctl disable zgs
sudo rm /etc/systemd/system/zgs.service
rm -rf $HOME/0g-storage-node
```
