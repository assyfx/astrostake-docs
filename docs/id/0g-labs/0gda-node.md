
# Panduan Setup 0G DA Node

Panduan ini akan membantu kamu untuk men-setup DA Node di jaringan 0G Labs.  
Untuk dokumentasi resmi, silakan cek [di sini](https://docs.0g.ai/run-a-node/da-node).

## Kebutuhan

- **[Stake](https://0g.exploreme.pro/validators/0gvaloper1aax7fz4d904m0ul3e9v3lfq7cdzzw3ka8qk3mr?action=Delegate) 30 A0GI**
- Memori: 16 GB RAM  
- CPU: 8 Core  
- Disk: 1TB NVME SSD  
- Bandwidth: 100 Mbps (Download / Upload)  

**Kamu perlu melakukan stake 30 A0GI ke validator untuk bisa menjalankan 0G DA Node.**

<div class="highlight">

### Stake lewat AstroStake

Belum masuk Top 200 — tapi kita terus bangun, terus jalan, dan nggak akan berhenti.

Kamu tetap bisa jalanin DA Node dengan stake ke validator-ku.

Setiap stake bantu kita makin dekat 🚀

<a class="custom-button" href="https://0g.exploreme.pro/validators/0gvaloper1aax7fz4d904m0ul3e9v3lfq7cdzzw3ka8qk3mr?action=Delegate" target="_blank">
  🚀 Stake ke AstroStake
</a>
</div>

<div class="custom-collapse">
<details>
  <summary>Staking via CLI</summary>

<div class="collapse-content">

**1. Download binary 0g**
```
cd $HOME
git clone https://github.com/0glabs/0g-chain.git
cd 0g-chain
git checkout v0.5.3
git submodule update --init
make install
0gchaind version
```

**2. Setup Wallet**

Ganti `WalletName` dengan nama dompet kamu yang sebenarnya.
:::tabs
== Buat Wallet
Untuk membuat dompet baru, gunakan perintah berikut. Jangan lupa simpan mnemonic-nya ya.
```
0gchaind keys add WalletName
```
== Restore Wallet
Kalau kamu sudah punya dompet dan ingin memulihkan, gunakan perintah ini:
```
0gchaind keys add WalletName --recover
```
== Restore Wallet (EVM)
Kalau kamu pakai Metamask atau dompet EVM lain, gunakan perintah ini:
```
0gchaind keys add WalletName --eth --recover
```
:::

**3. Stake**

Ganti `WalletName` dengan nama dompet kamu.

Kamu juga bisa ganti `--node https://evmrpc-testnet.0g.ai` ke RPC favorit kamu.
```
0gchaind tx staking delegate "0gvaloper1aax7fz4d904m0ul3e9v3lfq7cdzzw3ka8qk3mr" 30000000ua0gi --from "WalletName" --chain-id zgtendermint_16600-2 --gas-adjustment 1.5 --gas auto --gas-prices 0.00252ua0gi  --node https://evmrpc-testnet.0g.ai -y
```
</div>
</details>
</div>

## Instalasi Satu Klik
```
bash <(wget -qO- https://astrostake.xyz/0GDA_Node_One_Click.sh)
```

## Instalasi Manual

1. **Install paket yang diperlukan**
```
sudo apt-get update && sudo apt-get install clang cmake build-essential pkg-config libssl-dev protobuf-compiler llvm llvm-dev
```

2. **Install Go**
```
cd $HOME && ver="1.22.0" && wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz" && sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz" && rm "go$ver.linux-amd64.tar.gz" && echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> ~/.bash_profile && source ~/.bash_profile && go version
```

3. **Install Rust**
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
```
. "$HOME/.cargo/env"
```

4. **Clone 0G DA Node**
```
git clone -b v1.1.3 https://github.com/0glabs/0g-da-node.git
```

5. **Build proyek**
```
cd $HOME/0g-da-node
git stash
git fetch --all --tags
git checkout v1.1.3
git submodule update --init
cargo build --release
```

6. **Tambahkan Params**
```
./dev_support/download_params.sh
```

7. **Generate BLS Private Key**

:::warning Penting!
Setelah kamu generate BLS Private Key, pastikan kamu **menyimpannya dengan aman**.

- Kunci ini hanya ditampilkan **sekali** saat dibuat.
- Kalau hilang, **tidak bisa dipulihkan**.
- Kalau kamu ingin **jalankan ulang DA Node** atau **migrasi ke VPS baru**, kamu **wajib pakai BLS Private Key yang sama** supaya node tetap dikenali.
- Kalau hilang, kamu harus **buat kunci baru** dan **registrasi dompet baru**, artinya mulai ulang dari awal.
:::
```
cargo run --bin key-gen
```

8. **Edit Config**
```
nano $HOME/0g-da-node/config.toml
```

:::info Edit File Config

Isi bagian berikut: `socket_address`, `signer_bls_private_key`, `signer_eth_private_key`, `miner_eth_private_key`

```
log_level = "info"
data_path = "./db/"
encoder_params_dir = "params/"
grpc_listen_address = "0.0.0.0:34000"
eth_rpc_endpoint = "https://evmrpc-testnet.0g.ai"
socket_address = "VPS_Public_IP:34000"
da_entrance_address = "0x857C0A28A8634614BB2C96039Cf4a20AFF709Aa9"
start_block_number = 940000
signer_bls_private_key = ""
signer_eth_private_key = ""
miner_eth_private_key = ""
enable_das = "true"
```
:::

9. **Buat service**
```
sudo tee /etc/systemd/system/0gda.service > /dev/null <<EOF
[Unit]
Description=0G-DA Node
After=network.target

[Service]
User=$USER
WorkingDirectory=$HOME/0g-da-node
ExecStart=$HOME/0g-da-node/target/release/server --config $HOME/0g-da-node/config.toml
Restart=always
RestartSec=10
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF
```

10. **Jalankan service**
```
sudo systemctl daemon-reload && \
sudo systemctl enable 0gda && \
sudo systemctl start 0gda && \
sudo systemctl status 0gda
```

## Perintah Berguna

**Cek log**
```
sudo journalctl -u 0gda -f -o cat
```

**Ganti RPC**
```
bash <(wget -qO- https://astrostake.xyz/change_da_rpc.sh)
```

## Hentikan dan Hapus Node

:::danger Penting: Backup BLS Key kamu!

Jangan sampai hilang — kunci ini dibutuhkan untuk menjalankan DA Node kamu.

Lokasi file: `$HOME/0g-da-node/config.toml`
:::

**Stop**
```
sudo systemctl stop 0gda
```

**Hapus**
```
sudo systemctl disable 0gda
sudo rm /etc/systemd/system/0gda.service
rm -rf $HOME/0g-da-node
```

.
