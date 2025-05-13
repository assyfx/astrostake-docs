# 0G Galileo Validator Testnet Node Setup

This guide will help you install a 0G Galileo Validator node using a combination of the best practices from the [official tutorial](https://docs.0g.ai/run-a-node/validator-node) and community enhancements.

---

## Auto Install
```bash
bash <(wget -qO- https://vault.astrostake.xyz/0g-labs/validator_install.sh)
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

## Snapshot

block: `1090929`

size:
- `0gchaind_snapshot_20250501-193735.tar.gz` – for Cosmos state `4.54 GB`
- `geth_snapshot_20250501-193735.tar.gz` – for EVM state `5.12 GB`

1. **Download**
```bash
mkdir -p ~/snapshot
cd ~/snapshot

wget https://vault.astrostake.xyz/0g-labs/validator-snapshot/0gchaind_snapshot_20250501-193735.tar.gz
wget https://vault.astrostake.xyz/0g-labs/validator-snapshot/geth_snapshot_20250501-193735.tar.gz
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
pv 0gchaind_snapshot_20250501-193735.tar.gz | tar xz -C ~/.0gchaind/0g-home/
pv geth_snapshot_20250501-193735.tar.gz | tar xz -C ~/.0gchaind/0g-home/
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
