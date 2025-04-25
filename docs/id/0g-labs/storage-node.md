# Panduan Setup Storage Node

Panduan ini akan bantu kamu untuk setup Storage Node di jaringan 0G Labs.  
Untuk dokumentasi resmi, kamu bisa cek [di sini](https://docs.0g.ai/run-a-node/storage-node).

## Kebutuhan Sistem
- Memori: 16 GB RAM  
- CPU: 4 Core  
- Disk: 500GB / 1TB NVME SSD  
- Bandwidth: 100 Mbps (Download / Upload)

## Instalasi Satu Klik

:::tabs key:ab
== Konfigurasi Standar
```
bash <(wget -qO- https://astrostake.xyz/0g_storage_node_one_click_standard.sh)
```
== Konfigurasi Turbo
```
bash <(wget -qO- https://astrostake.xyz/0g_storage_node_one_click_turbo.sh)
```
:::

## Update Satu Klik

Versi: `v0.8.7`

```
bash <(wget -qO- https://astrostake.xyz/storage_node_update.sh)
```

## Instalasi Manual

1. **Install paket yang dibutuhkan**
```
sudo apt-get update
sudo apt-get install clang cmake build-essential openssl pkg-config libssl-dev
```

2. **Install Go**
```
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

3. **Install rustup**
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
```sh
. "$HOME/.cargo/env"
```

4. **Download dan install 0G Storage Node**
```
git clone -b v0.8.6 https://github.com/0glabs/0g-storage-node.git
```
```
cd $HOME/0g-storage-node
git stash
git fetch --all --tags
git checkout v0.8.7
git submodule update --init
cargo build --release
```

5. **Set config (pilih salah satu)**

:::tabs key:ab
== Konfigurasi Standar
```
rm -rf $HOME/0g-storage-node/run/config.toml
curl -o $HOME/0g-storage-node/run/config.toml https://astrostake.xyz/0g_storage_standard_config.toml
```
== Konfigurasi Turbo
```
rm -rf $HOME/0g-storage-node/run/config.toml
curl -o $HOME/0g-storage-node/run/config.toml https://astrostake.xyz/0g_storage_turbo_config.toml
```
:::

Cek bagian `miner_key` dan masukkan private key kamu
```
nano $HOME/0g-storage-node/run/config.toml
```

6. **Buat service**
```
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

7. **Mulai service**
```
sudo systemctl daemon-reload && sudo systemctl enable zgs && sudo systemctl start zgs
```

## Opsional: [Install Snapshot](https://docs.astrostake.xyz/id/0g-labs/snapshot)

## Perintah Berguna

**Lihat log lengkap**
```
tail -f ~/0g-storage-node/run/log/zgs.log.$(TZ=UTC date +%Y-%m-%d)
```

**Cek blok dan peers**
```
source <(curl -s https://astrostake.xyz/check_block.sh)
```

**Ganti RPC**
```
bash <(wget -qO- https://astrostake.xyz/change_storage_rpc.sh)
```

## Stop dan hapus node

**Stop**
```
sudo systemctl stop zgs
```

**Hapus**
```
sudo systemctl disable zgs
sudo rm /etc/systemd/system/zgs.service
rm -rf $HOME/0g-storage-node
```
