# Snapshot

Kami menyediakan snapshot untuk yang membutuhkan, tapi ini **bukan metode utama** dan digunakan **dengan risiko sendiri.** Untuk keamanan dan stabilitas terbaik, disarankan tetap sinkronisasi dari awal. Gunakan snapshot hanya jika kamu benar-benar paham risikonya.

<div class="highlight">

### Status Snapshot

**Status:** 🟢 Tersedia

Snapshot sekarang sudah tersedia untuk diunduh. Menggunakan snapshot bisa memangkas waktu sinkronisasi secara signifikan — tergantung spesifikasi sistemmu, proses ini bisa memakan waktu sekitar 1 sampai 2 jam hingga benar-benar sinkron dengan blok terbaru.

Tanpa snapshot, sinkronisasi dari genesis bisa memakan waktu 1 sampai 2 hari, bahkan lebih.
</div>

## Perintah Satu Klik
:::tabs key:ab
== Konfigurasi standar

Snapshot full `db`
```bash
bash <(wget -qO- https://astrostake.xyz/install_snapshot_and_config.sh)
```
Snapshot hanya `flow_db`
```bash
bash <(wget -qO- https://astrostake.xyz/install_snapshot_flowdb_and_config.sh)
```
== Konfigurasi turbo
```bash
snapshot turbo sedang dalam pemeliharaan
```
:::

## Instalasi Manual Snapshot
1. **Install tools**
```
cd && sudo apt-get install wget lz4 aria2 pv -y
```

2. **Download snapshot**

:::tabs key:ab
== Konfigurasi standar
**Snapshot full `db`**

Blok: `3632902`
Ukuran: `141 GB`
```
wget https://vault.astrostake.xyz/0g-labs/snapshot_standard_astrostake_2025-03-15.tar.lz4
```
**Snapshot hanya `flow_db` (tanpa `data_db`)**

Blok: `4064648`
Ukuran: `373 MB`
```
wget https://vault.astrostake.xyz/0g-labs/snapshot_flowdb_standard_astrostake_2025-04-20.tar.lz4
```

== Konfigurasi turbo

**Kontrak:** `turbo`  

Blok: `-`  
Ukuran: `-`
```
snapshot turbo sedang dalam pemeliharaan
```
:::

3. **Stop service**
```
sudo systemctl stop zgs.service
```

4. **Extract**

:::tabs key:ab
== Konfigurasi Standar
Ekstrak full `db`
```
rm -rf $HOME/0g-storage-node/run/db
lz4 -c -d snapshot_standard_astrostake_2025-03-15.tar.lz4 | pv | tar -x -C $HOME/0g-storage-node/run
```
Ekstrak hanya `flow_db`
```
rm -rf $HOME/0g-storage-node/run/db/data_db
rm -rf $HOME/0g-storage-node/run/db/flow_db
lz4 -c -d snapshot_flowdb_standard_astrostake_2025-04-20.tar.lz4 | pv | tar -x -C $HOME/0g-storage-node/run/db
```

== Konfigurasi turbo
```
snapshot turbo sedang dalam pemeliharaan
```
:::

5. **Restart node**
```
sudo systemctl restart zgs && sudo systemctl status zgs
```

6. **Hapus file snapshot**

Setelah instalasi selesai, kamu bisa menghapus file snapshot yang sudah diunduh untuk menghemat ruang penyimpanan.

```
rm -rf snapshot_standard_astrostake_2025-03-15.tar.lz4
```

## Hapus data_db

:::danger Reset Ulang Database

Kalau kamu belum menerima reward miner, coba hapus folder `data_db` dan restart storage node.
:::

```
systemctl stop zgs
```

```
rm -rf $HOME/0g-storage-node/run/db/data_db
```

```
systemctl start zgs
```
