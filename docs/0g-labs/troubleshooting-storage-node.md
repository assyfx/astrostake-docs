---
title: Troubleshooting Guide for Storage and Validator Nodes
description: Common errors and solutions when running storage nodes and validator nodes with AstroStake.
---

# 🛠️  Troubleshooting Guide

This guide covers common issues and how to solve them for Storage Nodes.

---

<div class="custom-collapse">
<details>
  <summary>Known Issue: Node Stuck Catching Up or Sync Very Slow</summary>

<div class="collapse-content">

**Symptoms:**
- Storage Node synchronization becomes noticeably slower as it approaches the latest block height.
- After reaching near the latest block, synchronization speed may slow down dramatically or the node may fall behind again.

**Cause:**
- This is a known situation related to the early stage of the Galileo (v3) chain deployment.
- Block finalization by validators is operating normally and at expected speed.
- However, storage node synchronization depends heavily on RPC infrastructure.
- Currently, the official RPC server limits the number of allowed requests to maintain stability, causing synchronization slowdowns.
- Third-party validator and RPC infrastructure expansion is not yet open to the public.

**Status:**
- The development team is aware of this limitation and is working on improving RPC serving capacity and scaling network infrastructure.
- Performance is expected to naturally improve as more validators and third-party RPC providers join the network.

**What You Can Do:**
- Keep your storage node running and allow it to sync gradually.
- In some cases, restarting your node may temporarily improve syncing, but it is not a guaranteed solution.
- No immediate action is required from node operators.
- Synchronization performance will improve automatically with future network upgrades.

</div>
</details>
</div>


<div class="custom-collapse">
<details>
  <summary>Failed to Start ZGS Node (403 Forbidden RPC)</summary>

<div class="collapse-content">

**Symptoms:**
- `zgs` service fails to start.
- Log error:
  ```log
  Failed to start zgs node
  Unable to get chain id: JsonRpcClientError (expected value, 403 Forbidden)
  ```

**Cause:**
- The RPC endpoint in the `config.toml` file is invalid, down, or blocked (403 Forbidden).

**Solution:**
1. Edit your configuration file:
   ```bash
   nano $HOME/0g-storage-node/run/config.toml
   ```
2. Ensure `blockchain_rpc_endpoint` is pointing to a valid JSON-RPC endpoint.

   Example:
   ```toml
   blockchain_rpc_endpoint = "https://evmrpc-testnet.0g.ai"
   ```

3. Use the quick RPC changer script if needed:
   ```bash
   bash <(wget -qO- https://astrostake.xyz/change_storage_rpc.sh)
   ```
4. Restart the node:
   ```bash
   sudo systemctl restart zgs
   ```

</div>
</details>
</div>

<div class="custom-collapse">
<details>
  <summary>Additional Step: Manually Check RPC Endpoint</summary>

<div class="collapse-content">

If you encounter a 403 Forbidden error, you can manually verify if your RPC endpoint is responding correctly using the following `curl` command:

```bash
curl -X POST https://evmrpc-testnet.0g.ai \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

expected output:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x875dc"  // current block number in hex
}
```
or
```json
{"jsonrpc":"2.0","id":1,"result":"0x875dc"}
```
This confirms that the RPC is active and reachable.

</div>
</details>
</div>

---

# 📚 Resources

- [Storage Node Setup Guide](/0g-labs/storage-node-v3-chain)

If you encounter an issue not listed here, contact AstroStake on [Discord](https://discord.com/users/248382810631438337).

Or ask to the community on [Discord](https://discord.gg/AkMD56bHK7).
