export function generateOrderNumber() {
    const timestamp = Date.now().toString(36); // Zaman damgasını 36 tabanında al
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // Rastgele bir kısım ekle
    return `#${timestamp}${randomPart}`; // Özel sipariş numarası
  }