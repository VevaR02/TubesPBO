package com.sevspo.marketplace.model;

/**
 * Enum ini mendefinisikan status yang mungkin untuk sebuah pesanan. Menggunakan
 * Enum lebih aman dan lebih mudah dikelola daripada String biasa.
 */
public enum OrderStatus {
    PENDING, // Pesanan baru, menunggu pembayaran.
    PAID, // Pembayaran berhasil, pesanan siap diproses.
    PROCESSING, // Pesanan sedang disiapkan/dikemas oleh admin.
    SHIPPED, // Pesanan telah dikirim ke alamat tujuan.
    DELIVERED, // Pesanan telah sampai di tangan pelanggan.
    CANCELLED, // Pesanan dibatalkan (baik oleh pengguna atau admin).
}
