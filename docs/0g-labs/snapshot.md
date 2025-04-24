# Snapshot

While we provide snapshots for those who need them, they are not the primary method and are **used at your own risk.** For better security and reliability, syncing from scratch is always the best choice. Use snapshots only if you fully understand the risks.

<div class="highlight">

### Snapshot Status

**Status:** 🟢 Available

The snapshot is now available for download. Using the snapshot will significantly reduce sync time — depending on your system specifications, it may take around 1 to 2 hours to fully catch up to the latest block.

Without the snapshot, syncing from genesis can take 1 to 2 days or more.
</div>

## One-click command
:::tabs key:ab
== Standard config

Snapshot full `db`
```bash
bash <(wget -qO- https://astrostake.xyz/install_snapshot_and_config.sh)
```
Snapshot `flow_db` only.
```bash
bash <(wget -qO- https://astrostake.xyz/install_snapshot_flowdb_and_config.sh)
```
== Turbo config
```bash
snapshot turbo under maintenance
```
:::

## Manual Install Snapshot
1. **Install tools**
```
cd && sudo apt-get install wget lz4 aria2 pv -y
```
2. **Download snapshot**

:::tabs key:ab
== Standard config
**Snapshot full `db`**

Blocks: `3632902`
Size: `141 GB`
```
wget https://vault.astrostake.xyz/0g-labs/snapshot_standard_astrostake_2025-03-15.tar.lz4
```

**Snapshot `flow_db` only. Without `data_db`**

Blocks: `4064648`
Size: `373 MB`
```
wget https://vault.astrostake.xyz/0g-labs/snapshot_flowdb_standard_astrostake_2025-04-20.tar.lz4
```
== Turbo config
**Contract:** `turbo`
Blocks: `-`
Size: `-`
```
snapshot turbo under maintenance
```
:::

3. **Stop service**
```
sudo systemctl stop zgs.service
```

4. **Extract**

:::tabs key:ab
== Standard config
Snapshot full `db` extract
```
rm -rf $HOME/0g-storage-node/run/db
lz4 -c -d snapshot_standard_astrostake_2025-03-15.tar.lz4 | pv | tar -x -C $HOME/0g-storage-node/run
```
Snapshot `flow_db` only extract
```
rm -rf $HOME/0g-storage-node/run/db/data_db
rm -rf $HOME/0g-storage-node/run/db/flow_db
lz4 -c -d snapshot_flowdb_standard_astrostake_2025-04-20.tar.lz4 | pv | tar -x -C $HOME/0g-storage-node/run/db
```
== Turbo config
```
snapshot turbo under maintenance
```
:::

5. **Restart node**
```
sudo systemctl restart zgs && sudo systemctl status zgs
```

6. **Remove downloaded file (Optional)**

After successfully installing, you can delete the downloaded file to free up storage space.

```
rm -rf snapshot_standard_astrostake_2025-03-15.tar.lz4
```

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

## Remove data_db

:::danger Reset Database State

If you haven't received the miner reward, try deleting the `data_db` folder and restart storage node.
:::

```
systemctl stop zgs
```

```
rm -rf $HOME/0g-storage-node/run/db/data_db
```

```
systemctl start zgs
```

