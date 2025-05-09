---
title: Panduan Instalasi Storage Node (V3 Galileo)
description: Panduan lengkap instalasi dan migrasi storage node 0G Labs menggunakan AstroStake.
---

# Panduan Setup Storage Node (V3 Galileo)

Panduan ini akan membantu Anda menyiapkan Storage Node untuk OG Labs.
Untuk dokumentasi resmi, silakan cek [di sini](https://docs.0g.ai/run-a-node/storage-node).

## Persyaratan
- Memori: 32 GB RAM
- CPU: 8 Core
- Disk: 500GB / 1TB NVME SSD
- Bandwidth: 100 Mbps (Unduh / Unggah)

----

## Migrasi dari V2

<div class="custom-collapse">
<details>
  <summary>Sudah pernah menginstal versi sebelumnya? Klik di sini untuk melihat panduan migrasi dari v2 ke v3.</summary>

<div class="collapse-content">

Versi: `v1.0.0`

## One-Click Command
```bash
bash <(wget -qO- https://astrostake.xyz/upgrade_storage_node_v3.sh)
```

## Instalasi Manual

1. **Hentikan Service**
```bash
systemctl stop zgs
```

2. **Hapus folder db**
```bash
rm -rf $HOME/0g-storage-node/run/db
```

3. **Backup Konfigurasi**
```bash
cp $HOME/0g-storage-node/run/config.toml $HOME/zgs-config.toml.backup
```

4. **Perbarui ke v1.0.0**
```bash
cd $HOME/0g-storage-node
git stash
git fetch --all --tags
git checkout v1.0.0
git submodule update --init
cargo build --release
```

5. **Unduh Konfigurasi V3**
```bash
rm -rf $HOME/0g-storage-node/run/config.toml
curl -o $HOME/0g-storage-node/run/config.toml https://vault.astrostake.xyz/0g-labs/config-v3.toml
```
:::info
Periksa `miner_key` dan masukkan private key Anda:
```bash
nano $HOME/0g-storage-node/run/config.toml
```
:::

6. **Hapus dan Buat Ulang Service**
```bash
sudo rm -f /etc/systemd/system/zgs.service
```
```bash
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

7. **Restart Service**
```bash
sudo systemctl daemon-reload && sudo systemctl enable zgs && sudo systemctl start zgs
```

</div>
</details>
</div>

---

## One-Click Command Update

Perintah ini hanya memperbarui versi node Anda. Jika Anda berpindah dari v2 ke v3, pastikan mengikuti panduan migrasi terlebih dahulu.

Versi: `v1.0.0`
```bash
bash <(wget -qO- https://astrostake.xyz/storage_node_update_v3.sh)
```

---

## One-Click Command Install

```bash
bash <(wget -qO- https://astrostake.xyz/0g_storage_node_v3_chain.sh)
```

---

## Instalasi Manual

1. **Instalasi Paket yang Diperlukan**
```bash
sudo apt-get update
sudo apt-get install clang cmake build-essential openssl pkg-config libssl-dev jq git bc
```

2. **Instal Go**
```bash
cd $HOME
ver="1.22.0"
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> ~/.bash_profile
source ~/.bash_profile
go version
```

3. **Instal Rustup**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Muat ulang environment:
```bash
. "$HOME/.cargo/env"
```

4. **Unduh dan Instal 0G Storage Node**
```bash
git clone -b v1.0.0 https://github.com/0glabs/0g-storage-node.git
cd $HOME/0g-storage-node
git stash
git fetch --all --tags
git checkout v1.0.0
git submodule update --init
cargo build --release
```

5. **Atur Konfigurasi**
```bash
rm -rf $HOME/0g-storage-node/run/config.toml
curl -o $HOME/0g-storage-node/run/config.toml https://vault.astrostake.xyz/0g-labs/config-v3.toml
```
:::info
Periksa `miner_key` dan input private key Anda:
```bash
nano $HOME/0g-storage-node/run/config.toml
```
:::

6. **Buat Service**
```bash
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

7. **Mulai Service**
```bash
sudo systemctl daemon-reload && sudo systemctl enable zgs && sudo systemctl start zgs
```

---

## Perintah Berguna

**Cek Log Penuh**
```bash
tail -f ~/0g-storage-node/run/log/zgs.log.$(TZ=UTC date +%Y-%m-%d)
```

**Cek Blok dan Peers**
```bash
source <(curl -s https://astrostake.xyz/check_block.sh)
```

**Ganti RPC**
```bash
bash <(wget -qO- https://astrostake.xyz/change_storage_rpc.sh)
```

---

## Hentikan dan Hapus Node

**Hentikan Service**
```bash
sudo systemctl stop zgs
```

**Hapus Node**
```bash
sudo systemctl disable zgs
sudo rm /etc/systemd/system/zgs.service
rm -rf $HOME/0g-storage-node
```
