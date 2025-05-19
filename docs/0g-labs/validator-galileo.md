<script setup>
import { useRouter } from 'vitepress'

const router = useRouter()
router.go('/maintenance')
</script>

Redirecting...

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
bash <(wget -qO- https://raw.githubusercontent.com/astrostake/0G-Labs-script/refs/heads/main/validator/galileo/validator_install.sh)
```

Update from `v1.1.0` to `v1.1.1`
```bash
bash <(wget -qO- https://raw.githubusercontent.com/astrostake/0G-Labs-script/refs/heads/main/validator/galileo/validator_update.sh)
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
3. **Set Environment Variables**

Change `YourMoniker` and `55` to the port you want to use.
```bash
echo "export MONIKER=\"YourMoniker\"" >> $HOME/.bash_profile
echo "export OG_PORT=\"55\"" >> $HOME/.bash_profile
echo 'export PATH=$PATH:$HOME/galileo/bin' >> $HOME/.bash_profile
source $HOME/.bash_profile
```

4. **Download and Extract Galileo**
```bash
cd $HOME
rm -rf galileo
wget https://github.com/0glabs/0gchain-NG/releases/download/v1.1.1/galileo-v1.1.1.tar.gz
tar -xzvf galileo-v1.1.1.tar.gz -C $HOME
rm galileo-v1.1.1.tar.gz
chmod +x $HOME/galileo/bin/geth
chmod +x $HOME/galileo/bin/0gchaind
```
Move binaries to `/usr/local/bin` for global access
```bash
sudo cp $HOME/galileo/bin/geth /usr/local/bin/geth
sudo cp $HOME/galileo/bin/0gchaind /usr/local/bin/0gchaind
```

5. **Initialize the Chain**

```bash
mkdir -p $HOME/.0gchaind
mv $HOME/galileo $HOME/.0gchaind/

geth init --datadir $HOME/.0gchaind/galileo/0g-home/geth-home $HOME/.0gchaind/galileo/genesis.json

rm -rf $HOME/.0gchaind/galileo/0g-home/0gchaind-home
0gchaind init $MONIKER --home $HOME/.0gchaind/galileo/0g-home/0gchaind-home
```

6. **Configure Node**
Update `config.toml`
```bash
sed -i -e "s/^moniker *=.*/moniker = \"$MONIKER\"/" $HOME/.0gchaind/galileo/0g-home/0gchaind-home/config/config.toml
```
Update `geth-config.toml` Ports
```bash
sed -i "s/HTTPPort = .*/HTTPPort = ${OG_PORT}545/" $HOME/.0gchaind/galileo/geth-config.toml
sed -i "s/WSPort = .*/WSPort = ${OG_PORT}546/" $HOME/.0gchaind/galileo/geth-config.toml
sed -i "s/AuthPort = .*/AuthPort = ${OG_PORT}551/" $HOME/.0gchaind/galileo/geth-config.toml
sed -i "s/ListenAddr = .*/ListenAddr = \":${OG_PORT}303\"/" $HOME/.0gchaind/galileo/geth-config.toml
sed -i "s/^# *Port = .*/# Port = ${OG_PORT}901/" $HOME/.0gchaind/galileo/geth-config.toml
sed -i "s/^# *InfluxDBEndpoint = .*/# InfluxDBEndpoint = \"http:\/\/localhost:${OG_PORT}086\"/" $HOME/.0gchaind/galileo/geth-config.toml
```
Update `config.toml` and `app.toml` for 0gchaind
```bash
# config.toml
CONFIG="$HOME/.0gchaind/galileo/0g-home/0gchaind-home/config"

sed -i "s/laddr = \"tcp:\/\/0\.0\.0\.0:26656\"/laddr = \"tcp:\/\/0\.0\.0\.0:${OG_PORT}656\"/" $CONFIG/config.toml
sed -i "s/laddr = \"tcp:\/\/127\.0\.0\.1:26657\"/laddr = \"tcp:\/\/127\.0\.0\.1:${OG_PORT}657\"/" $CONFIG/config.toml
sed -i "s/^proxy_app = .*/proxy_app = \"tcp:\/\/127\.0\.0\.1:${OG_PORT}658\"/" $CONFIG/config.toml
sed -i "s/^pprof_laddr = .*/pprof_laddr = \"0.0.0.0:${OG_PORT}060\"/" $CONFIG/config.toml
sed -i "s/prometheus_listen_addr = \".*\"/prometheus_listen_addr = \"0.0.0.0:${OG_PORT}660\"/" $CONFIG/config.toml

# app.toml
sed -i "s/address = \".*:3500\"/address = \"127.0.0.1:${OG_PORT}500\"/" $CONFIG/app.toml
sed -i "s/^rpc-dial-url *=.*/rpc-dial-url = \"http:\/\/localhost:${OG_PORT}551\"/" $CONFIG/app.toml
```
Disable Indexer
```bash
sed -i -e "s/^indexer *=.*/indexer = \"null\"/" $CONFIG/config.toml
```

8. **Configure Systemd Services**

Setup `0gchaind.service`
```bash
sudo tee /etc/systemd/system/0gchaind.service > /dev/null <<EOF
[Unit]
Description=0gchaind Node Service
After=network-online.target

[Service]
User=$USER
Environment=CHAIN_SPEC=devnet
WorkingDirectory=$HOME/.0gchaind/galileo
ExecStart=/usr/local/bin/0gchaind start \
  --home $HOME/.0gchaind/galileo/0g-home/0gchaind-home \
  --kzg.trusted-setup-path=$HOME/.0gchaind/galileo/kzg-trusted-setup.json \
  --engine.jwt-secret-path=$HOME/.0gchaind/galileo/jwt-secret.hex \
  --kzg.implementation=crate-crypto/go-kzg-4844 \
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

Setup `geth.service`
```bash
sudo tee /etc/systemd/system/geth.service > /dev/null <<EOF
[Unit]
Description=0g Geth Node Service
After=network-online.target

[Service]
User=$USER
WorkingDirectory=$HOME/.0gchaind/galileo
ExecStart=/usr/local/bin/geth \
  --config $HOME/.0gchaind/galileo/geth-config.toml \
  --datadir $HOME/.0gchaind/galileo/0g-home/geth-home \
  --networkid 16601 \
  --http.port ${OG_PORT}545 \
  --ws.port ${OG_PORT}546 \
  --authrpc.port ${OG_PORT}551 \
  --bootnodes enode://de7b86d8ac452b1413983049c20eafa2ea0851a3219c2cc12649b971c1677bd83fe24c5331e078471e52a94d95e8cde84cb9d866574fec957124e57ac6056699@8.218.88.60:30303 \
  --port ${OG_PORT}303
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```
8. **Start the Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable 0gchaind
sudo systemctl enable geth
sudo systemctl start 0gchaind
sudo systemctl start geth
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
source <(curl -s https://raw.githubusercontent.com/astrostake/0G-Labs-script/refs/heads/main/validator/check_block_validator.sh)
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
