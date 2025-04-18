# Drosera Installation

## System Requirements

- CPU: 2 Cores
- Memory: 4GB RAM
- Disk: 20 GB
- You need [faucet](https://cloud.google.com/application/web3/faucet/ethereum/holesky) also.

## Install

**1. Install Dependencies**
```bash
sudo apt-get update && sudo apt-get upgrade -y
```
```bash
sudo apt install curl ufw iptables build-essential git wget lz4 jq make gcc nano automake autoconf tmux htop nvme-cli libgbm1 pkg-config libssl-dev libleveldb-dev tar clang bsdmainutils ncdu unzip libleveldb-dev  -y
```

<div class="custom-collapse">
<details>
  <summary>2. Install Docker (skip if already installed)</summary>

<div class="collapse-content">

**1. Install Dependency**
```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
```

**2. Add GPG key Docker**
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg
```

**3. Add docker repo**
```bash
echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

**4. Install Docker CE**
```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

**5. Check Docker Status**
```bash
sudo systemctl status docker
```
</div>
</details>
</div>

## Trap Setup

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

## Deploy Contract & Trap

**1. Create folder**
```bash
mkdir my-drosera-trap && cd my-drosera-trap
```

**2. Github Config**

Replace `Github_Email` & `Github_Usernamee` :
```bash
git config --global user.email "Github_Email"
git config --global user.name "Github_Username"
```

**3. Initialize Trap**
```bash
forge init -t drosera-network/trap-foundry-template
```

**4. Compile Trap**
```bash
curl -fsSL https://bun.sh/install | bash
bun install
```
```bash
forge build
```bash
if you face an error like this:
[![BuildError](/images/forge_build_error.png)](/images/forge_build_error.png)

try to run again this script
```bash
curl -fsSL https://bun.sh/install | bash
bun install
```
```bash
forge build
```


**5. Deploy Trap**

Replace `PrivKey` with your Private Key!
```bash
DROSERA_PRIVATE_KEY=PrivKey drosera apply
```
enter command, wait, write ofc and enter.

## Dashboard Configuration

**1. Connect your Drosera VM Wallet to https://app.drosera.io/**

**2. Clik on `Traps Owned` or search your Trap Address**

**3. Open your Trap on Dashboard and Click on `Send Bloom Boost` and deposit some Holesky ETH on it. Leave some for gas fee**

**4. Fetch Blocks**
```bash
drosera dryrun
```

## Operator Setup

**1. Setup Trap Config**
```bash
cd my-drosera-trap
nano drosera.toml
```
:::info edit `private_trap` and `whitelist` like this:
```toml
private_trap = true
whitelist = ["EVM_Address"]
```
:::

**2. Update Trap Configuration**

Replace `PrivKey` with your Private Key!
```bash
DROSERA_PRIVATE_KEY=PrivKey drosera apply
```

**3. Download and Extract Operator CLI**
```bash
curl -LO https://github.com/drosera-network/releases/releases/download/v1.16.2/drosera-operator-v1.16.2-x86_64-unknown-linux-gnu.tar.gz
```
```bash
tar -xvf drosera-operator-v1.16.2-x86_64-unknown-linux-gnu.tar.gz
```

**4. Check Version and move path to run it globally**
```bash
./drosera-operator --version
```
```bash
sudo cp drosera-operator /usr/bin
```
```bash
drosera-operator
```

**5. Install Docker Image**
```bash
docker pull ghcr.io/drosera-network/drosera-operator:latest
```

**6. Register Operator**

replace `PrivKey` with your Private Key
```bash
drosera-operator register --eth-rpc-url https://ethereum-holesky-rpc.publicnode.com --eth-private-key PrivKey
```

## Setup Systemd

:::info 1. Configure Systemd service file
replace `Priv_Key` and `VPS_IP`
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

**2. Run Operator**
```bash
sudo systemctl daemon-reload
sudo systemctl enable drosera
sudo systemctl start drosera
```

**3. Check Logs**
```bash
journalctl -u drosera.service -f
```

**4. Opt In Trap**

[![Opt_in](/images/Opt_in.png)](/images/Opt_in.png)

**Done! Check Node Liveness on your Dashboard.**