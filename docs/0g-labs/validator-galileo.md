# 0G Galileo Validator Testnet Node Setup

This guide will help you install a 0G Galileo Validator node using a combination of the best practices from the [official tutorial](https://docs.0g.ai/run-a-node/validator-node) and community enhancements.

---

:::info
At the moment, you can run the node as an **RPC (Remote Procedure Call)** to support the network and stay synced with the blockchain.

However, the command to create a validator is **not yet available**. This guide will be updated as soon as the official instructions for validator setup are released by the core team.

In the meantime, you can:

- Keep your node running and fully synced
- Monitor announcements from the official 0G channels
:::

> Stay tuned — we’ll update this documentation as soon as validator functionality is live.

## Auto Install

Version: `v1.1.1`
```bash
bash <(wget -qO- https://vault.astrostake.xyz/0g-labs/validator_install.sh)
```

Update from `v1.1.0` to `v1.1.1`
```bash
bash <(wget -qO- https://vault.astrostake.xyz/0g-labs/validator_update.sh)
```

## Manual Install

1. **Install Dependencies**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl git wget htop tmux build-essential jq make lz4 gcc unzip -y
```

2. **Install Go**
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

3. **Download and Extract Galileo**
```bash
cd $HOME
wget https://github.com/0glabs/0gchain-NG/releases/download/v1.1.1/galileo-v1.1.1.tar.gz
tar -xzf galileo-v1.1.1.tar.gz
rm galileo-v1.1.1.tar.gz
cd galileo
chmod +x ./bin/geth ./bin/0gchaind
```
Move binaries to `/usr/local/bin` for global access
```bash
sudo mv ./bin/geth /usr/local/bin/geth
sudo mv ./bin/0gchaind /usr/local/bin/0gchaind
sudo chmod +x /usr/local/bin/geth /usr/local/bin/0gchaind
```

4. **Initialize Geth and 0GChainD**

Change `<YOUR_MONIKER>`
```bash
/usr/local/bin/geth init --datadir $HOME/galileo/0g-home/geth-home ./genesis.json
/usr/local/bin/0gchaind init "<YOUR_MONIKER>" --home $HOME/galileo/tmp
```

5. **Configure Node**
```bash
cp $HOME/galileo/tmp/data/priv_validator_state.json $HOME/galileo/0g-home/0gchaind-home/data/
cp $HOME/galileo/tmp/config/node_key.json $HOME/galileo/0g-home/0gchaind-home/config/
cp $HOME/galileo/tmp/config/priv_validator_key.json $HOME/galileo/0g-home/0gchaind-home/config/

mkdir -p $HOME/.0gchaind
mv $HOME/galileo/0g-home $HOME/.0gchaind/
```

6. **Setup Trusted Setup Files**

```bash
[ ! -f "$HOME/galileo/jwt-secret.hex" ] && openssl rand -hex 32 > $HOME/galileo/jwt-secret.hex
[ ! -f "$HOME/galileo/kzg-trusted-setup.json" ] && curl -L -o $HOME/galileo/kzg-trusted-setup.json https://danksharding.io/trusted-setup/kzg-trusted-setup.json
```

7. **Configure Systemd Services**

Setup `0gchaind.service`
```bash
sudo tee /etc/systemd/system/0gchaind.service > /dev/null <<EOF
[Unit]
Description=0GChainD Service
After=network.target

[Service]
User=$USER
WorkingDirectory=$HOME/galileo
ExecStart=/usr/local/bin/0gchaind start --rpc.laddr tcp://0.0.0.0:26657 --chain-spec devnet --kzg.trusted-setup-path=$HOME/galileo/kzg-trusted-setup.json --engine.jwt-secret-path=$HOME/galileo/jwt-secret.hex --kzg.implementation=crate-crypto/go-kzg-4844 --block-store-service.enabled --node-api.enabled --node-api.logging --node-api.address 0.0.0.0:3500 --pruning=nothing --home=$HOME/.0gchaind/0g-home/0gchaind-home
Restart=always
RestartSec=5
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

Setup `geth.service`
```bash
sudo tee /etc/systemd/system/geth.service > /dev/null <<EOF
[Unit]
Description=Geth Service for 0GChainD
After=network.target

[Service]
User=$USER
WorkingDirectory=$HOME/galileo
ExecStart=/usr/local/bin/geth --config $HOME/galileo/geth-config.toml --nat extip=$(hostname -I | awk '{print $1}') --datadir $HOME/.0gchaind/0g-home/geth-home --networkid 16601
Restart=always
RestartSec=5
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
```

8. **Start the Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable geth
sudo systemctl enable 0gchaind
sudo systemctl start geth
sudo systemctl start 0gchaind
```

9. **Verify Installation**
```bash
journalctl -u 0gchaind -u geth -f
```

## Useful Commands

Check logs
```bash
journalctl -u 0gchaind -u geth -f
```

Check Blocks
```bash
source <(curl -s https://vault.astrostake.xyz/0g-labs/check_block_validator.sh)
```

check node status
```bash
curl -s localhost:26657/status | jq .result.sync_info
```

## Snapshot

https://vault.astrostake.xyz/0g-labs/validator-snapshot/ stores the last 2 snapshots

block: `302,600`

size:
- `0gchaind_snapshot_20250515-232711.tar.gz` – for Cosmos state `1.49 GB`
- `geth_snapshot_20250515-232711.tar.gz` – for EVM state `1.31 GB`

1. **Download**
```bash
mkdir -p ~/snapshot
cd ~/snapshot

wget https://vault.astrostake.xyz/0g-labs/validator-snapshot/0gchaind_snapshot_20250515-232711.tar.gz
wget https://vault.astrostake.xyz/0g-labs/validator-snapshot/geth_snapshot_20250515-232711.tar.gz
```

2. **stop node**
```bash
sudo systemctl stop geth # Or: sudo systemctl stop 0ggeth
sudo systemctl stop 0gchaind
```

Optional: Backup
```bash
mv ~/.0gchaind/0g-home/0gchaind-home/data ~/.0gchaind/0g-home/0gchaind-home/data.bak.$(date +%s)
mv ~/.0gchaind/0g-home/geth-home/geth ~/.0gchaind/0g-home/geth-home/geth.bak.$(date +%s)
```
> 🧭 Note: If you're using `~/galileo/0g-home/` instead of `~/.0gchaind/0g-home/`, adjust the paths accordingly.

3. **Delete Old Data**
```bash
rm -rf ~/.0gchaind/0g-home/0gchaind-home/data
rm -rf ~/.0gchaind/0g-home/geth-home/geth
```
> 🧭 Note: If you're using `~/galileo/0g-home/` instead of `~/.0gchaind/0g-home/`, adjust the paths accordingly.

4. **Extract Snapshot**
```bash
pv 0gchaind_snapshot_20250515-232711.tar.gz | tar xz -C ~/.0gchaind/0g-home/
pv geth_snapshot_20250515-232711.tar.gz | tar xz -C ~/.0gchaind/0g-home/
```
> 🧭 Note: If you're using `~/galileo/0g-home/` instead of `~/.0gchaind/0g-home/`, adjust the paths accordingly.

5. **Start Node**
```bash
sudo systemctl start geth # Or: sudo systemctl start 0ggeth
sudo systemctl start 0gchaind
```

check node status
```bash
curl -s localhost:26657/status | jq .result.sync_info
```

## Security Notes

:::info 🔐 Security Notes
**This snapshot includes only:**

- data/ directory for 0gchaind

- geth/ directory for EVM

- genesis.json (required)

**It does NOT contain:**

- priv_validator_key.json (validator signing key)

- node_key.json (p2p ID
:::

## Delete Validator

::: danger ⚠️ Critical: Backup Your Validator Key!
Make sure to backup `priv_validator.key.json`.
Do **not** lose this key — it is required to run your validator.
:::

```bash
cd $HOME
sudo systemctl stop 0gchaind geth
sudo systemctl disable 0gchaind geth
sudo rm /etc/systemd/system/0gchaind.service
sudo rm /etc/systemd/system/geth.service
sudo systemctl daemon-reload
sudo rm -f $(which 0gchaind)
sudo rm -rf $HOME/.0gchaind
```
