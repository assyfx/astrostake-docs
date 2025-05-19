# Snapshot

While we provide snapshots for those who need them, they are not the primary method and are **used at your own risk.** For better security and reliability, syncing from scratch is always the best choice. Use snapshots only if you fully understand the risks.

<div class="highlight">

### Snapshot Status

**Status:** 🔴 Not available

The snapshot is now available for download. Using the snapshot will significantly reduce sync time compared to syncing from genesis.

**Snapshots are updated daily at 00:00 UTC.**
</div>

## One-click Snapshot Installer

```bash
bash <(wget -qO- https://github.com/astrostake/0G-Labs-script/raw/refs/heads/main/storage-node/galileo/0g_storage_node_snapshot_v3.sh)
```

## Manual Install Snapshot
1. **Install tools**
```bash
cd && sudo apt-get install wget lz4 aria2 pv -y
```
2. **Download snapshot**

:::tabs key:ab
== Full Snapshot

Snapshot full `db`

Blocks: `1090927`
Size: `71G`
```bash
wget https://vault.astrostake.xyz/0g-labs/snapshot_storage_node_astrostake.tar.lz4
```
== Light Snapshot

Snapshot `flow_db` only

size: `72M`
```bash
wget https://vault.astrostake.xyz/0g-labs/snapshot_storage_node_flow_db_astrostake.tar.lz4
```
:::

3. **Stop service**
```bash
sudo systemctl stop zgs.service
```

4. **Extract**

:::tabs key:ab
== Full Snapshot

Snapshot full `db` extract
```bash
rm -rf $HOME/0g-storage-node/run/db
lz4 -c -d snapshot_storage_node_astrostake.tar.lz4 | pv | tar -x -C $HOME/0g-storage-node/run
```
== Light Snapshot
Snapshot `flow_db` extract
```bash
rm -rf $HOME/0g-storage-node/run/db/data_db
rm -rf $HOME/0g-storage-node/run/db/flow_db
lz4 -c -d snapshot_storage_node_flow_db_astrostake.tar.lz4 | pv | tar -x -C $HOME/0g-storage-node/run/db
```
:::

5. **Restart node**
```bash
sudo systemctl restart zgs && sudo systemctl status zgs
```

6. **Remove downloaded file (Optional)**

After successfully installing, you can delete the downloaded file to free up storage space.

:::tabs key:ab
== Full Snapshot

```bash
rm -rf snapshot_storage_node_astrostake.tar.lz4
```
== Light Snapshot
```bash
rm -rf snapshot_storage_node_flow_db_astrostake.tar.lz4
```
:::

## Useful Commands

**Check Full Logs**
```bash
tail -f ~/0g-storage-node/run/log/zgs.log.$(TZ=UTC date +%Y-%m-%d)
```

**Check Blocks and Peers**
```bash
source <(curl -s https://github.com/astrostake/0G-Labs-script/raw/refs/heads/main/storage-node/check_block.sh)
```

**Change RPC**
```bash
bash <(wget -qO- https://github.com/astrostake/0G-Labs-script/raw/refs/heads/main/storage-node/change_storage_rpc.sh)
```

## Remove data_db

:::danger Reset Database State

If you haven't received the miner reward, try deleting the `data_db` folder and restart storage node.
:::

```bash
systemctl stop zgs
```

```bash
rm -rf $HOME/0g-storage-node/run/db/data_db
```

```bash
systemctl start zgs
```

