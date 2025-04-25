# Validator Node

This guide will help you set up a Validator Node for OG Labs. For official documentation, check [here.](https://docs.0g.ai/run-a-node/validator-node)

## Requirements

- CPU: 8 Cores
- Memory: 64GB RAM
- Disk: 1 TB of storage (NVME)
- Bandwidth: 100 Mbps (Download / Upload)

## Install

**1. Install dependencies**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl git wget htop tmux build-essential jq make lz4 gcc unzip -y
```

<div class="highlight">

### 2. Auto-install script powered by ITRocket 🚀

Smooth, reliable, and straight to the point — just how we like it at **AstroStake**.

_Why write it from scratch when it’s already clean and battle-tested?_

**Huge thanks to [ITRocket](https://itrocket.net) for keeping things clean and effortless.**

```bash
source <(curl -s https://itrocket.net/api/testnet/og/autoinstall/)
```
</div>

**3. Setup wallet**

:::tabs
== Create Wallet
To create a new wallet, use the following command. Don’t forget to save the mnemonic
```bash
0gchaind keys add $WALLET
```
== Restore Wallet
To restore existing wallet, use the following command
```bash
0gchaind keys add $WALLET --recover
```
== Restore Wallet (EVM)
If you use metamask or EVM, use this command to restore your wallet

```bash
0gchaind keys add $WALLET --eth --recover
```
:::

**Save wallet and validator address**

```bash
WALLET_ADDRESS=$(0gchaind keys show $WALLET -a)
VALOPER_ADDRESS=$(0gchaind keys show $WALLET --bech val -a)
echo "export WALLET_ADDRESS="$WALLET_ADDRESS >> $HOME/.bash_profile
echo "export VALOPER_ADDRESS="$VALOPER_ADDRESS >> $HOME/.bash_profile
source $HOME/.bash_profile
```

**4. Check block sync**

Script by ITRocket
```bash
#!/bin/bash
rpc_port=$(grep -m 1 -oP '^laddr = "\K[^"]+' "$HOME/.0gchain/config/config.toml" | cut -d ':' -f 3)
while true; do
  local_height=$(curl -s localhost:$rpc_port/status | jq -r '.result.sync_info.latest_block_height')
  network_height=$(curl -s https://og-testnet-rpc.itrocket.net/status | jq -r '.result.sync_info.latest_block_height')

  if ! [[ "$local_height" =~ ^[0-9]+$ ]] || ! [[ "$network_height" =~ ^[0-9]+$ ]]; then
    echo -e "\033[1;31mError: Invalid block height data. Retrying...\033[0m"
    sleep 5
    continue
  fi

  blocks_left=$((network_height - local_height))
  echo -e "\033[1;33mNode Height:\033[1;34m $local_height\033[0m \033[1;33m| Network Height:\033[1;36m $network_height\033[0m \033[1;33m| Blocks Left:\033[1;31m $blocks_left\033[0m"
  sleep 5
done
```

**5. Check node status**

Make sure `"catching_up": false`
```bash
0gchaind status 2>&1 | jq
```

**6. Create Validator**

Check your balances first. change `wallet_name`
```bash
0gchaind q bank balances $(0gchaind keys show "wallet_name" -a)
```
:::info Edit Validator Info
Edit `moniker` `identity` `website` `details`

`amount` 1000000ua0gi = 1 A0GI
```bash
0gchaind tx staking create-validator \
--amount 1000000ua0gi \
--from $WALLET \
--commission-rate 0.1 \
--commission-max-rate 0.2 \
--commission-max-change-rate 0.01 \
--min-self-delegation 1 \
--pubkey $(0gchaind tendermint show-validator) \
--moniker "test" \
--identity "" \
--website "" \
--details "I love blockchain ❤️" \
--chain-id zgtendermint_16600-2 \
--gas-adjustment 1.5 --gas auto --gas-prices 0.00252ua0gi \
-y
```
:::

**Check Validator info**

change `wallet_name`
```bash
0gchaind q staking validator $(0gchaind keys show "wallet_name" --bech val -a)
```

## Delete node

::: danger ⚠️ Critical: Backup Your Validator Key!
Do **not** lose this key — it is required to run your validator.

File location: `/root/.0gchain/config/priv_validator_key.json`
:::

```bash
sudo systemctl stop 0gchaind
sudo systemctl disable 0gchaind
sudo rm -rf /etc/systemd/system/0gchaind.service
sudo rm $(which 0gchaind)
sudo rm -rf $HOME/.0gchain
sed -i "/OG_/d" $HOME/.bash_profile
```
