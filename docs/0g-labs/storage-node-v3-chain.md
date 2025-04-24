# Storage Node Setup Guide (V3 Galileo)

This guide will help you set up a Storage Node for OG Labs.
For official documentation, check [here](https://docs.0g.ai/run-a-node/storage-node).

## Requirements
- Memory: 32 GB RAM
- CPU: 8 Cores
- Disk: 500GB / 1TB NVME SSD
- Bandwidth: 100 Mbps (Download / Upload)

## If you have installed previously. Check [here](https://docs.astrostake.xyz/0g-labs/storage-node-v3-update) to update.

## One-Click Command Update

This command only updates your node version. If you're moving from v2 to v3, make sure to follow the [migration guide](https://docs.astrostake.xyz/0g-labs/storage-node-v3-update) instead.

version: `v1.0.0`
```
bash <(wget -qO- https://astrostake.xyz/storage_node_update_v3.sh)
```

## One Click Command Install

```
bash <(wget -qO- https://astrostake.xyz/0g_storage_node_v3_chain.sh)
```

## Manual Install

1. **Install necessary packages**
```
sudo apt-get update
sudo apt-get install clang cmake build-essential openssl pkg-config libssl-dev jq
```
2. **Install go**
```
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
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
```sh
. "$HOME/.cargo/env"
```
4. **Download and Install 0G Storage Node**
```
git clone -b v1.0.0 https://github.com/0glabs/0g-storage-node.git
```
```
cd $HOME/0g-storage-node
git stash
git fetch --all --tags
git checkout v1.0.0
git submodule update --init
cargo build --release
```
5. **Set config**

```
rm -rf $HOME/0g-storage-node/run/config.toml
curl -o $HOME/0g-storage-node/run/config.toml https://vault.astrostake.xyz/0g-labs/config-v3.toml
```

check `miner_key` and input your private key
```
nano $HOME/0g-storage-node/run/config.toml
```
6. **Create service**
```
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
```
sudo systemctl daemon-reload && sudo systemctl enable zgs && sudo systemctl start zgs
```

## Optional: [Install Snapshot](https://docs.astrostake.xyz/0g-labs/snapshot)

## Useful Commands
**Check Full Logs**
```
tail -f ~/0g-storage-node/run/log/zgs.log.$(TZ=UTC date +%Y-%m-%d)
```

**Check Blocks and Peers**
```
source <(curl -s https://astrostake.xyz/check_block.sh)
```

**Change RPC**
```
bash <(wget -qO- https://astrostake.xyz/change_storage_rpc.sh)
```

## Stop and delete node

Stop
```
sudo systemctl stop zgs
```

Delete
```
sudo systemctl disable zgs
sudo rm /etc/systemd/system/zgs.service
rm -rf $HOME/0g-storage-node
```
