// Punto de conexión con la pasarela de pago (aún sin proveedor).
//
// Para conectarla:
//   1. El backend crea el pedido y la transacción con el token del comercio
//      (el token nunca va al navegador) y devuelve la URL o el widget de pago.
//   2. Aquí se redirige o se abre ese pago con los datos de `pedido`.
//   3. El backend confirma el pago con el aviso (webhook) de la pasarela.
//   4. Activar PAGO_EN_LINEA_ACTIVO en config/carrito.js.
//
// pedido: { items, total, entrega, nombre, nota }
export async function iniciarPagoEnLinea(pedido) {
  throw new Error('Pasarela de pago no configurada')
}
