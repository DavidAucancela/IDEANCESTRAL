// Diseño del carrito (CartDrawer):
//   ventana → ventana flotante bajo el ícono del carrito
//   panel   → panel lateral flotante a toda la altura
//   hoja    → hoja que sube desde abajo (en escritorio: lista + resumen en dos columnas)
//   pasos   → pedido en dos pasos: revisar piezas y elegir la entrega
export const CARRITO_VARIANTES = ['ventana', 'panel', 'hoja', 'pasos']

// La que ve el público. Para comparar en el navegador: /?carrito=panel
export const CARRITO_VARIANTE_POR_DEFECTO = 'ventana'
