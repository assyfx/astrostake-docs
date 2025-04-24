# Validator Node

Panduan ini akan bantu kamu untuk setup Validator Node di jaringan 0G Labs.  
Untuk dokumentasi resmi, cek [di sini.](https://docs.0g.ai/run-a-node/validator-node)

## Kebutuhan

- CPU: 8 Core  
- Memori: 64 GB RAM  
- Penyimpanan: 1 TB NVME  
- Bandwidth: 100 Mbps (Download / Upload)

## Instalasi

**1. Install dependency**
```
sudo apt update && sudo apt upgrade -y
sudo apt install curl git wget htop tmux build-essential jq make lz4 gcc unzip -y
```

<div class="highlight">

### 2. Auto-install script dari ITRocket 🚀

Cepat, stabil, dan langsung to the point — seperti yang biasa kita suka di **AstroStake**.

_Kenapa harus buat dari nol kalau udah ada yang rapi dan terbukti?_  
**Terima kasih banyak buat [ITRocket](https://itrocket.net) yang bikin semuanya simpel dan praktis!**

```bash
source <(curl -s https://itrocket.net/api/testnet/og/autoinstall/)
```
</div>

**3. Setup Wallet**

:::tabs
== Buat Wallet
Untuk membuat wallet baru, gunakan perintah ini. Jangan lupa simpan mnemonic-nya!
```
0gchaind keys add $WALLET
```

== Pulihkan Wallet
Kalau sudah punya wallet sebelumnya:
```
0gchaind keys add $WALLET --recover
```

== Pulihkan Wallet (EVM)
Untuk pengguna metamask atau wallet EVM:
```
0gchaind keys add $WALLET --eth --recover
```
:::

**Simpan alamat wallet dan validator**
```
WALLET_ADDRESS=$(0gchaind keys show $WALLET -a)
VALOPER_ADDRESS=$(0gchaind keys show $WALLET --bech val -a)
echo "export WALLET_ADDRESS="$WALLET_ADDRESS >> $HOME/.bash_profile
echo "export VALOPER_ADDRESS="$VALOPER_ADDRESS >> $HOME/.bash_profile
source $HOME/.bash_profile
```

**4. Cek status blok sync**

Script dari ITRocket
```
#!/bin/bash
rpc_port=$(grep -m 1 -oP '^laddr = "\K[^"]+' "$HOME/.0gchain/config/config.toml" | cut -d ':' -f 3)
while true; do
  local_height=$(curl -s localhost:$rpc_port/status | jq -r '.result.sync_info.latest_block_height')
  network_height=$(curl -s https://og-testnet-rpc.itrocket.net/status | jq -r '.result.sync_info.latest_block_height')

  if ! [[ "$local_height" =~ ^[0-9]+$ ]] || ! [[ "$network_height" =~ ^[0-9]+$ ]]; then
    echo -e "mError: Data blok tidak valid. Coba lagi..."
    sleep 5
    continue
  fi

  blocks_left=$((network_height - local_height))
  echo -e "mNode Height:m $local_height m| Network Height:m $network_height m| Sisa Blok:m $blocks_left"
  sleep 5
done
```

**5. Cek status node**

Pastikan hasilnya `"catching_up": false`
```
0gchaind status 2>&1 | jq
```

**6. Buat Validator**

Pastikan saldo kamu cukup. Ganti `wallet_name` dengan nama wallet kamu.
```
0gchaind q bank balances $(0gchaind keys show "wallet_name" -a)
```

:::info Edit Info Validator

Edit `moniker`, `identity`, `website`, dan `details` sesuai keinginan.

`amount` 1000000ua0gi = 1 A0GI
```
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

**Cek info validator**

Ganti `wallet_name` dengan wallet kamu:
```
0gchaind q staking validator $(0gchaind keys show "wallet_name" --bech val -a)
```

## Hapus Node

::: danger ⚠️ Penting: Backup Kunci Validator Kamu!
Jangan sampai hilang — kunci ini wajib untuk jalankan validator kamu.

Lokasi file: `/root/.0gchain/config/priv_validator_key.json`
:::

```
sudo systemctl stop 0gchaind
sudo systemctl disable 0gchaind
sudo rm -rf /etc/systemd/system/0gchaind.service
sudo rm $(which 0gchaind)
sudo rm -rf $HOME/.0gchain
sed -i "/OG_/d" $HOME/.bash_profile
```
