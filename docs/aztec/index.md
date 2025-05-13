# Aztec Sequencer Node

This guide will help you set up a Aztec Sequencer Node. For official documentation, check [here](https://docs.aztec.network/the_aztec_network/guides/run_nodes).

## System Requirements

- CPU : 8 Cores
- RAM : 16GB
- Disk : 1 TB

## Preparataion

1. EVM Wallet Private Key
2. ETH Sepolia Faucet
3. Sepolia RPC & Sepolia Beacon RPC
- [Alchemy](https://dashboard.alchemy.com/) Paid Sepolia RPC, but you can get trial 100M request.
- [drpc.org](https://drpc.org) Free Beacon RPC
- [chainstack](https://chainstack.com) Free Beacon RPC
- [ankr](https://www.ankr.com) Paid Beacon RPC

## Installation

Prefer to set it up manually? Follow the instructions in our community-maintained guide: [Maouam's Node Lab](https://maouam.nodelab.my.id/aztec/sequencer-node/).

### Auto Installer

Paste this script inside screen or tmux.

```bash
bash <(wget -qO- https://vault.astrostake.xyz/aztec/aztec_sequencer_install.sh)
```

## Usefull Command

Get latest block number
```bash
curl -s -X POST -H 'Content-Type: application/json' \
-d '{"jsonrpc":"2.0","method":"node_getL2Tips","params":[],"id":67}' \
http://localhost:8080 | jq -r ".result.proven.number"
```

Check PeerId. https://aztec.nethermind.io/
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
