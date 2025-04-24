
# Panduan Setup 0G DA Client

## Kebutuhan Sistem
- Memori: 8 GB RAM
- CPU: 2 Core
- Disk: -
- Bandwidth: 100 Mbps (Download / Upload)

## Instalasi

1. **Install paket yang dibutuhkan**
```
sudo apt-get update
sudo apt-get install cmake
```

2. **Install Go**
```
cd $HOME && ver="1.22.0" && wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz" && sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz" && rm "go$ver.linux-amd64.tar.gz" && echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> ~/.bash_profile && source ~/.bash_profile && go version
```

3. **Download dan jalankan Docker**
```
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
```
```
sudo usermod -aG docker $USER && newgrp docker
```
```
sudo systemctl enable docker.service && sudo systemctl enable containerd.service
```

4. **Clone 0G DA Client**
```
git clone https://github.com/0glabs/0g-da-client.git
```

5. **Build image Docker**
```
cd 0g-da-client
docker build -t da-client -f combined.Dockerfile .
```

6. **Buat file environment**
```
nano envfile.env
```

:::info Edit file environment

Silakan cek dan isi nilai untuk 
`COMBINED_SERVER_PRIVATE_KEY` dan `BATCHER_ENCODER_ADDRESS`

```
# envfile.env
COMBINED_SERVER_CHAIN_RPC=https://evmrpc-testnet.0g.ai
COMBINED_SERVER_PRIVATE_KEY=YOUR_PRIVATE_KEY
ENTRANCE_CONTRACT_ADDR=0x857C0A28A8634614BB2C96039Cf4a20AFF709Aa9
COMBINED_SERVER_RECEIPT_POLLING_ROUNDS=180
COMBINED_SERVER_RECEIPT_POLLING_INTERVAL=1s
COMBINED_SERVER_TX_GAS_LIMIT=2000000
COMBINED_SERVER_USE_MEMORY_DB=true
COMBINED_SERVER_KV_DB_PATH=/runtime/
COMBINED_SERVER_TimeToExpire=2592000
DISPERSER_SERVER_GRPC_PORT=51001
BATCHER_DASIGNERS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000001000
BATCHER_FINALIZER_INTERVAL=20s
BATCHER_CONFIRMER_NUM=3
BATCHER_MAX_NUM_RETRIES_PER_BLOB=3
BATCHER_FINALIZED_BLOCK_COUNT=50
BATCHER_BATCH_SIZE_LIMIT=500
BATCHER_ENCODING_INTERVAL=3s
BATCHER_ENCODING_REQUEST_QUEUE_SIZE=1
BATCHER_PULL_INTERVAL=10s
BATCHER_SIGNING_INTERVAL=3s
BATCHER_SIGNED_PULL_INTERVAL=20s
BATCHER_EXPIRATION_POLL_INTERVAL=3600
BATCHER_ENCODER_ADDRESS=DA_IP:PORT
BATCHER_ENCODING_TIMEOUT=300s
BATCHER_SIGNING_TIMEOUT=60s
BATCHER_CHAIN_READ_TIMEOUT=12s
BATCHER_CHAIN_WRITE_TIMEOUT=13s
```
:::

7. **Jalankan container Docker**
```
docker run -d --env-file envfile.env --name da-client -v ./run:/runtime -p 51001:51001 da-client
```

8. **Cek log**
```
docker logs -f da-client
```

## Hentikan node
```
docker stop da-client
```
