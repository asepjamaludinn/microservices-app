# BiteBox Restaurant Management System

BiteBox adalah sistem manajemen restoran _end-to-end_ berskala produksi yang dibangun menggunakan arsitektur **Microservices**. Aplikasi ini memisahkan layanan otentikasi dan layanan operasional utama untuk skalabilitas, keamanan, dan pemeliharaan yang lebih baik.

## Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, Zustand, Recharts, Radix UI.
- **Auth Service (Backend):** Laravel 11, JWT Authentication (Tymon), PostgreSQL.
- **Project Service (Backend):** Laravel 11, PostgreSQL.
- **Infrastructure:** Docker & Docker Compose, Nginx (Reverse Proxy).

## Fitur Utama

1.  **Customer Portal:** Katalog menu publik, _add to cart_, _checkout_ pesanan (_dine-in/takeaway_), riwayat pesanan, dan sistem ulasan (rating).
2.  **Point of Sales (POS):** Sistem kasir terintegrasi untuk menangani pesanan di tempat, manajemen meja, dan cetak struk/nota.
3.  **Inventory & Recipe Management:** Manajemen stok bahan baku dengan sistem otomatis yang memotong stok berdasarkan komposisi resep saat pesanan dibuat.
4.  **Reservation System:** Manajemen reservasi/booking meja makan.
5.  **Analytics Dashboard:** Visualisasi data pendapatan, tren pesanan, dan menu terlaris secara _real-time_.
6.  **Audit Logs:** Perekaman aktivitas mutasi data secara otomatis (Create, Update, Delete) lengkap dengan riwayat _user_ dan _payload_ JSON.

---

## Dokumentasi API (Postman)

Untuk memudahkan pengujian dan integrasi, seluruh dokumentasi API telah di-_publish_ secara interaktif. Anda dapat melihat contoh _request_, _response_, dan mencoba _endpoint_ secara langsung.

[![Run in Postman](https://run.pstmn.io/button.svg)](./BiteBox-API.postman_collection.json)
**[Klik di sini untuk melihat Dokumentasi API Postman](https://documenter.getpostman.com/view/39954677/2sBXwvK98V)**

---

## Daftar Endpoint API

Secara _default_, _service_ berjalan di _port_ berikut:

- **Frontend:** `http://localhost:8000`
- **Auth Service:** `http://localhost:8001`
- **Project Service:** `http://localhost:8002`

### Auth Service (Port 8001)

| Method | Endpoint                     | Keterangan                                   | Auth Required | Role |
| :----- | :--------------------------- | :------------------------------------------- | :-----------: | :--: |
| `GET`  | `/api/health`                | Pengecekan status kesehatan (_Health Check_) |      ❌       |  -   |
| `POST` | `/api/register`              | Mendaftarkan pengguna baru (Customer)        |      ❌       |  -   |
| `POST` | `/api/login`                 | Mendapatkan token JWT                        |      ❌       |  -   |
| `POST` | `/api/reset-password-direct` | Reset password via email                     |      ❌       |  -   |
| `GET`  | `/api/me`                    | Mengambil data user yang sedang login        |      ✅       | All  |
| `POST` | `/api/update-password`       | Update password user aktif                   |      ✅       | All  |
| `POST` | `/api/refresh`               | Memperbarui JWT token                        |      ✅       | All  |
| `POST` | `/api/logout`                | Menghapus dan _invalidate_ token             |      ✅       | All  |

### Project Service (Port 8002) - Public & User

| Method | Endpoint          | Keterangan                                   | Auth Required | Role |
| :----- | :---------------- | :------------------------------------------- | :-----------: | :--: |
| `GET`  | `/api/health`     | Pengecekan status kesehatan (_Health Check_) |      ❌       |  -   |
| `GET`  | `/api/menus`      | Mengambil daftar menu aktif (Katalog)        |      ❌       |  -   |
| `GET`  | `/api/categories` | Mengambil daftar kategori menu               |      ❌       |  -   |
| `GET`  | `/api/reviews`    | Mengambil ulasan pelanggan                   |      ❌       |  -   |
| `POST` | `/api/orders`     | Membuat pesanan baru (_Deduct stock_)        |      ✅       | All  |
| `GET`  | `/api/my-orders`  | Mengambil riwayat pesanan user login         |      ✅       | All  |
| `POST` | `/api/reviews`    | Memberikan rating dan ulasan pesanan         |      ✅       | All  |

### Project Service (Port 8002) - Admin Only

| Method  | Endpoint                    | Keterangan                                | Auth Required | Role  |
| :------ | :-------------------------- | :---------------------------------------- | :-----------: | :---: |
| `GET`   | `/api/analytics`            | Data metrik dashboard & grafik            |      ✅       | Admin |
| `GET`   | `/api/orders`               | Mengambil semua transaksi pesanan         |      ✅       | Admin |
| `PATCH` | `/api/orders/{id}/status`   | Update status pesanan & ketersediaan meja |      ✅       | Admin |
| `POST`  | `/api/orders/{id}/pay`      | Proses pembayaran transaksi               |      ✅       | Admin |
| `GET`   | `/api/payments`             | Data riwayat & struk pembayaran           |      ✅       | Admin |
| `POST`  | `/api/payments/{id}/refund` | Refund pembayaran & _restock_ bahan       |      ✅       | Admin |
| `GET`   | `/api/inventory`            | Data stok master bahan baku               |      ✅       | Admin |
| `POST`  | `/api/inventory`            | Menambah master bahan baku baru           |      ✅       | Admin |
| `POST`  | `/api/inventory/{id}/stock` | Mutasi stok manual (In/Out)               |      ✅       | Admin |
| `GET`   | `/api/internal/recipes`     | Melihat SOP dan HPP resep menu            |      ✅       | Admin |
| `POST`  | `/api/menus/{id}/recipes`   | Mengatur komposisi resep menu             |      ✅       | Admin |
| `POST`  | `/api/menus`                | Menambahkan menu baru ke katalog          |      ✅       | Admin |
| `PATCH` | `/api/menus/{id}/status`    | _Toggle_ status _Available/Sold Out_      |      ✅       | Admin |
| `GET`   | `/api/tables`               | Melihat status dan kapasitas meja         |      ✅       | Admin |
| `POST`  | `/api/tables`               | Menambah meja baru                        |      ✅       | Admin |
| `GET`   | `/api/reservations`         | Melihat daftar reservasi meja             |      ✅       | Admin |
| `POST`  | `/api/reservations`         | Membuat reservasi manual dari sistem      |      ✅       | Admin |
| `GET`   | `/api/audit-logs`           | Perekaman log aktivitas sistem            |      ✅       | Admin |

_(Untuk rute lengkap Create/Update/Delete (CRUD) entitas lainnya, silakan lihat file `project-service/routes/api.php`)_

---

## Instalasi & Setup Lokal

1.  _Clone repository_ ini.
2.  Duplikat file `.env.example` menjadi `.env` di folder `auth-service` dan `project-service`.
3.  Pastikan konfigurasi **`JWT_SECRET`** di kedua file `.env` berisi _string_ yang **sama persis**.
4.  Jalankan perintah Docker untuk melakukan _build_ dan menjalankan seluruh arsitektur:
    ```bash
    docker compose up -d --build
    ```
5.  Jalankan migrasi dan _seeder_ di dalam masing-masing _container_ database:
    ```bash
    docker compose exec auth-service php artisan migrate:fresh --seed
    docker compose exec project-service php artisan migrate:fresh --seed
    ```
6.  Aplikasi siap diakses:
    - **Frontend:** `http://localhost:8000`
    - **API Auth:** `http://localhost:8001/api/health`
    - **API Project:** `http://localhost:8002/api/health`
