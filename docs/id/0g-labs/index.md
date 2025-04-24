# 🧪 0G Labs – Panduan Komunitas

Selamat datang di panduan yang dibuat oleh komunitas untuk membantu dalam pengaturan dan pengelolaan berbagai komponen dari ekosistem **0G Labs**. Panduan ini bertujuan untuk memberikan instruksi yang jelas dan ringkas agar pengguna bisa menjalankan node dan layanan 0G Labs dengan mudah.

> **Catatan:** Ini adalah panduan tidak resmi. Untuk informasi yang paling akurat dan terbaru, silakan cek [dokumentasi resmi 0G Labs](https://docs.0g.ai).

---

## 🛡️ Validator

Di jaringan 0G, Validator punya peran penting dalam menjaga keamanan jaringan dan berpartisipasi dalam konsensus. Validator bertugas untuk mengusulkan dan memvalidasi blok baru, menjaga integritas jaringan, dan mendapatkan imbalan dari partisipasi mereka.

Panduan ini memberikan langkah-langkah seperti:

- **Instalasi Validator:** Setup gampang dengan perintah minimal — validator bisa langsung jalan dalam hitungan menit, lengkap dengan semua dependensi yang dibutuhkan.
- **Setup Dompet & Kunci:** Membuat/mengimpor dompet dan menghasilkan validator key yang diperlukan.
- **Registrasi Validator:** Panduan untuk mendaftar sebagai validator aktif di jaringan OG Labs.
- **Monitoring & Maintenance:** Perintah berguna untuk memantau status validator dan menjaga performa tetap optimal.

Untuk panduan lengkap, cek [Panduan Setup Validator](./validator).

---

## 📦 Storage Node

Di jaringan 0G, Storage Node bertugas penting menjaga layer penyimpanan terdesentralisasi. Mereka menyimpan dan menyajikan data, memastikan data selalu tersedia dan bisa diandalkan di seluruh jaringan. Dengan menjalankan Storage Node, kamu ikut berkontribusi ke jaringan dan dapat imbalan juga.

Panduan ini memberikan langkah-langkah seperti:

- **Instalasi:** Instalasi instan dengan satu perintah untuk konfigurasi standar dan turbo.
- **Setup Manual:** Proses instalasi manual secara lengkap.
- **Integrasi Snapshot:** Panduan untuk integrasi snapshot supaya sinkronisasi jadi lebih cepat.
- **Perintah Penting:** Perintah buat monitoring dan manajemen node.

Untuk penjelasan lengkap, cek [Panduan Storage Node](./storage-node).

---

## 🧵 Snapshot Service

Snapshot menyediakan data yang sudah tersinkronisasi untuk bantu Storage Node baru agar tidak mulai dari blok 0. Ini sangat berguna saat ada reset testnet atau instalasi baru.

- **Status Snapshot:** Tampilkan ketersediaan snapshot sekarang dan blok snapshot.
- **Instalasi:** Ada opsi perintah instan atau restore snapshot secara manual.

Panduan lengkap bisa kamu lihat di [Panduan Snapshot](./snapshot).

---

## 🧠 Data Availability (DA) Node

DA Node bertugas untuk verifikasi, penandatanganan, dan penyimpanan data blob yang telah dienkode. Node ini penting untuk memastikan data yang dikirim ke chain tersedia dan dapat dibuktikan keberadaannya.

Panduan ini mencakup:

- **Kebutuhan:** Perangkat keras dan syarat staking.
- **Langkah Instalasi:** Step-by-step instalasi paket, setup environment, dan build proyeknya.
- **Konfigurasi:** Panduan edit file konfigurasi dan setup layanan.
- **Manajemen:** Cara untuk mulai, stop, dan hapus node.

Pelajari proses lengkapnya di [Panduan Setup DA Node](./0gda-node).

---

## 🛰️ DA Client

0G DA Client adalah alat untuk berinteraksi dengan DA Node milik 0G, seperti untuk kirim, enkode, dan simpan data blob. Client ini juga punya Retriever API bawaan untuk ambil dan verifikasi data. Biasanya dijalankan di lingkungan container dan bisa diintegrasikan ke stack validator atau tools lainnya.

- **Instalasi:** Gunakan Docker buat jalanin image yang dibangun dari source.
- **Konfigurasi Environment:** Setup private key dan alamat encoder DA.

Cek [Panduan DA Client](./0gda-client) untuk detail lengkapnya.

---

## 🤝 Kontribusi & Masukan

Panduan ini dikelola bersama oleh komunitas untuk bantu pengguna menjelajahi ekosistem 0G Labs. Semua kontribusi, saran, dan masukan sangat diterima buat ningkatin kualitas informasi yang ada.

---

*Terakhir diperbarui: 7 April 2025*

*Dikelola oleh AstroStake*

*Didukung oleh: [Tim Maouam's Node Lab](https://maouam.nodelab.my.id/)*
