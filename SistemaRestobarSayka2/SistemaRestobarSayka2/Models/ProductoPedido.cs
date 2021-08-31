using System;
using System.Collections.Generic;

#nullable disable

namespace SistemaRestobarSayka2.Models
{
    public partial class ProductoPedido
    {
        public int ProductoIdProducto { get; set; }
        public int PedidoIdPedido { get; set; }
        public int Cantidad { get; set; }
        public int Total { get; set; }
        public DateTime Hora { get; set; }

        public virtual Pedido PedidoIdPedidoNavigation { get; set; }
        public virtual Producto ProductoIdProductoNavigation { get; set; }
    }
}
