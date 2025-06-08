# Empeiria

Recommended Hardware:
- 4 Cores
- 8GB RAM
- 200GB of storage (NVME)

| Service               | URL |
|-----------------------------|------------|
|RPC | https://empeiria-testnet-rpc.astrostake.xyz |
|API | https://empeiria-testnet-api.astrostake.xyz |
|Resource | https://vault.astrostake.xyz/empeiria |

## Installation

1. **Install Dependencies**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl git wget htop tmux build-essential jq make lz4 gcc unzip -y
```

2. **Install Go**
```bash
cd $HOME
VER="1.22.3"
wget "https://golang.org/dl/go$VER.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$VER.linux-amd64.tar.gz"
rm "go$VER.linux-amd64.tar.gz"
[ ! -f ~/.bash_profile ] && touch ~/.bash_profile
echo "export PATH=$PATH:/usr/local/go/bin:~/go/bin" >> ~/.bash_profile
source $HOME/.bash_profile
[ ! -d ~/go/bin ] && mkdir -p ~/go/bin
```

3. **Set Vars**
```bash
echo "export WALLET="wallet"" >> $HOME/.bash_profile
echo "export MONIKER="test"" >> $HOME/.bash_profile
echo "export EMPED_CHAIN_ID="empe-testnet-2"" >> $HOME/.bash_profile
echo "export EMPED_PORT="28"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

4. **Download Binary**
```bash
cd $HOME
rm -rf bin
mkdir bin
cd $HOME/bin
curl -LO https://github.com/empe-io/empe-chain-releases/raw/master/v0.4.0/emped_v0.4.0_linux_amd64.tar.gz
tar -xvf emped_v0.4.0_linux_amd64.tar.gz
chmod +x $HOME/bin/emped
mv $HOME/bin/emped ~/go/bin
```

5. **Initialize**
```bash
emped config node tcp://localhost:${EMPED_PORT}657
emped config keyring-backend os
emped config chain-id empe-testnet-2
emped init "test" --chain-id empe-testnet-2
```

6. **Download genesis and addrbook**
```bash
wget -O $HOME/.empe-chain/config/genesis.json https://vault.astrostake.xyz/empeiria/genesis.json
wget -O $HOME/.empe-chain/config/addrbook.json  https://vault.astrostake.xyz/testnet/empeiria/addrbook.json
```

7. **Configure Node**
```bash
SEEDS="20ca5fc4882e6f975ad02d106da8af9c4a5ac6de@empeiria-testnet-seed.itrocket.net:28656"
PEERS="03aa072f917ed1b79a14ea2cc660bc3bac787e82@empeiria-testnet-peer.itrocket.net:28656,e058f20874c7ddf7d8dc8a6200ff6c7ee66098ba@65.109.93.124:29056,2c413f1590e450d5cd7908974bc6edcd72d4ab12@185.208.207.227:28656,55313aad80d2c69afc83d0cf345322b6092af174@209.97.173.55:11156,c6710b8f443b5f4bfff109a355b12645b652962c@46.250.234.174:28656,2db322b41d26559476f929fda51bce06c3db8ba4@65.109.24.155:11256,6d6608664f35833a30bf93adaf0cf81dc040e5bd@135.181.79.242:11156,080d9cc12e08fb64dd0f4528d0da4a84d5d9428e@37.27.83.234:26656,810e21adee3b8f337bab0df70ba75d38afde2348@152.53.0.11:29656,a58ecb74eedcb521e269c4bc99c413643e4618c5@135.181.178.120:13656,5fc98f2ec4b2a6001aa5655c9852d259e83a8e74@65.108.226.44:11256,45bdc8628385d34afc271206ac629b07675cd614@65.21.202.124:25656"
sed -i -e "/^\[p2p\]/,/^\[/{s/^[[:space:]]*seeds *=.*/seeds = \"$SEEDS\"/}" \
       -e "/^\[p2p\]/,/^\[/{s/^[[:space:]]*persistent_peers *=.*/persistent_peers = \"$PEERS\"/}" $HOME/.empe-chain/config/config.toml
```
```bash
sed -i.bak -e "s%:1317%:${EMPED_PORT}317%g;
s%:8080%:${EMPED_PORT}080%g;
s%:9090%:${EMPED_PORT}090%g;
s%:9091%:${EMPED_PORT}091%g;
s%:8545%:${EMPED_PORT}545%g;
s%:8546%:${EMPED_PORT}546%g;
s%:6065%:${EMPED_PORT}065%g" $HOME/.empe-chain/config/app.toml
```
```bash
sed -i.bak -e "s%:26658%:${EMPED_PORT}658%g;
s%:26657%:${EMPED_PORT}657%g;
s%:6060%:${EMPED_PORT}060%g;
s%:26656%:${EMPED_PORT}656%g;
s%^external_address = \"\"%external_address = \"$(wget -qO- eth0.me):${EMPED_PORT}656\"%;
s%:26660%:${EMPED_PORT}660%g" $HOME/.empe-chain/config/config.toml
```
```bash
sed -i -e "s/^pruning *=.*/pruning = \"custom\"/" $HOME/.empe-chain/config/app.toml 
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \"100\"/" $HOME/.empe-chain/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \"19\"/" $HOME/.empe-chain/config/app.toml
```

```bash
sed -i 's|minimum-gas-prices =.*|minimum-gas-prices = "0.0001uempe"|g' $HOME/.empe-chain/config/app.toml
sed -i -e "s/prometheus = false/prometheus = true/" $HOME/.empe-chain/config/config.toml
sed -i -e "s/^indexer *=.*/indexer = \"null\"/" $HOME/.empe-chain/config/config.toml
```

8. **Create Service**
```bash
sudo tee /etc/systemd/system/emped.service > /dev/null <<EOF
[Unit]
Description=Empeiria node
After=network-online.target
[Service]
User=$USER
WorkingDirectory=$HOME/.empe-chain
ExecStart=$(which emped) start --home $HOME/.empe-chain
Restart=on-failure
RestartSec=5
LimitNOFILE=65535
[Install]
WantedBy=multi-user.target
EOF
```

9. **Install Snapshot**
```bash
cp $HOME/.empe-chain/data/priv_validator_state.json $HOME/.empe-chain/priv_validator_state.json.backup
rm -rf $HOME/.empe-chain/data
curl https://vault.astrostake.xyz/empeiria/empeiria_2025-06-08_snapshot.tar.lz4  | lz4 -dc - | tar -xf - -C $HOME/.empe-chain
mv $HOME/.empe-chain/priv_validator_state.json.backup $HOME/.empe-chain/data/priv_validator_state.json
```

10. **Start Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable emped
sudo systemctl restart emped && sudo journalctl -u emped -fo cat
```

---

**Check blocks and peers**
```bash
#!/bin/bash
rpc_port=$(grep -m 1 -oP '^laddr = "\K[^"]+' "$HOME/.empe-chain/config/config.toml" | cut -d ':' -f 3)
while true; do
  local_height=$(curl -s localhost:$rpc_port/status | jq -r '.result.sync_info.latest_block_height')
  network_height=$(curl -s https://empeiria-testnet-rpc.itrocket.net/status | jq -r '.result.sync_info.latest_block_height')

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