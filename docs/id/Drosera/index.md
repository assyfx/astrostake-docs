
# Instalasi Drosera

## Spesifikasi Sistem

- CPU: 2 Core
- RAM: 4GB
- Penyimpanan: 20 GB
- Kamu juga butuh [faucet](https://cloud.google.com/application/web3/faucet/ethereum/holesky) ya.

## Instalasi

**1. Install Paket Dasar**
```bash
sudo apt-get update && sudo apt-get upgrade -y
```
```bash
sudo apt install curl ufw iptables build-essential git wget lz4 jq make gcc nano automake autoconf tmux htop nvme-cli libgbm1 pkg-config libssl-dev libleveldb-dev tar clang bsdmainutils ncdu unzip libleveldb-dev -y
```

<div class="custom-collapse">
<details>
  <summary>2. Install Docker (lewati kalau sudah terpasang)</summary>

<div class="collapse-content">

**1. Install Dependensi Docker**
```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
```

**2. Tambahkan GPG Key Docker**
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg
```

**3. Tambahkan Repository Docker**
```bash
echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

**4. Install Docker CE**
```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

**5. Cek Status Docker**
```bash
sudo systemctl status docker
```
</div>
</details>
</div>

## Setup Trap

**1. Install Drosera**
```bash
curl -L https://app.drosera.io/install | bash
```
```bash
source /root/.bashrc
```
```bash
droseraup
```

**2. Install Foundry**
```bash
curl -L https://foundry.paradigm.xyz | bash
```
```bash
source /root/.bashrc
```
```bash
foundryup
```

**3. Install Bun**
```bash
curl -fsSL https://bun.sh/install | bash
```

## Deploy Kontrak & Trap

**1. Buat Folder Baru**
```bash
mkdir my-drosera-trap && cd my-drosera-trap
```

**2. Konfigurasi GitHub**

Ganti `Github_Email` dan `Github_Username` sesuai akunmu:
```bash
git config --global user.email "Github_Email"
git config --global user.name "Github_Username"
```

**3. Inisialisasi Trap**
```bash
forge init -t drosera-network/trap-foundry-template
```

**4. Kompilasi Trap**
```bash
curl -fsSL https://bun.sh/install | bash
bun install
```
```bash
forge build
```

### Kalau muncul error seperti ini:
[![BuildError](/images/forge_build_error.png)](/images/forge_build_error.png)

Coba ulangin langkah ini:
```bash
curl -fsSL https://bun.sh/install | bash
bun install
```
```bash
forge build
```

**5. Deploy Trap**
```bash
DROSERA_PRIVATE_KEY=PrivKey drosera apply
```

## Konfigurasi Dashboard

**1. Hubungkan wallet VM Drosera kamu ke https://app.drosera.io/**

**2. Klik menu `Traps Owned` atau cari alamat Trap kamu**

**3. Buka Trap di Dashboard lalu klik `Send Bloom Boost` dan deposit ETH Holesky secukupnya**

**4. Ambil data blok**
```bash
drosera dryrun
```

## Setup Operator

**1. Ubah Konfigurasi Trap**
```bash
cd my-drosera-trap
nano drosera.toml
```

:::info Ubah bagian `private_trap` dan `whitelist` seperti ini:
```toml
private_trap = true
whitelist = ["EVM_Address"]
```
:::

**2. Terapkan Konfigurasi Trap**
```bash
DROSERA_PRIVATE_KEY=PrivKey drosera apply
```

**3. Download dan Ekstrak Operator CLI**
```bash
curl -LO https://github.com/drosera-network/releases/releases/download/v1.16.2/drosera-operator-v1.16.2-x86_64-unknown-linux-gnu.tar.gz
```
```bash
tar -xvf drosera-operator-v1.16.2-x86_64-unknown-linux-gnu.tar.gz
```

**4. Cek Versi & Pindahkan Biar Bisa Jalan Global**
```bash
./drosera-operator --version
sudo cp drosera-operator /usr/bin
```

**5. Install Docker Image**
```bash
docker pull ghcr.io/drosera-network/drosera-operator:latest
```

**6. Register Operator**
```bash
drosera-operator register --eth-rpc-url https://ethereum-holesky-rpc.publicnode.com --eth-private-key PrivKey
```

## Setup Systemd

:::info 1. Buat File Service Systemd
ganti `Priv_Key` dan `VPS_IP`
```bash
sudo tee /etc/systemd/system/drosera.service > /dev/null <<EOF
[Unit]
Description=drosera node service
After=network-online.target

[Service]
User=$USER
Restart=always
RestartSec=15
LimitNOFILE=65535
ExecStart=$(which drosera-operator) node --db-file-path $HOME/.drosera.db --network-p2p-port 31313 --server-port 31314 \
    --eth-rpc-url https://ethereum-holesky-rpc.publicnode.com \
    --eth-backup-rpc-url https://1rpc.io/holesky \
    --drosera-address 0xea08f7d533C2b9A62F40D5326214f39a8E3A32F8 \
    --eth-private-key Priv_Key \
    --listen-address 0.0.0.0 \
    --network-external-p2p-address VPS_IP \
    --disable-dnr-confirmation true

[Install]
WantedBy=multi-user.target
EOF
```
:::

**2. Jalankan Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable drosera
sudo systemctl start drosera
```

**3. Lihat Log**
```bash
journalctl -u drosera.service -f
```

**4. Opt In Trap**
[![Opt_in](/images/Opt_in.png)](/images/Opt_in.png)

**Selesai! Cek status node kamu di Dashboard.**
