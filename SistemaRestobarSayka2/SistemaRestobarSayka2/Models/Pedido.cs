using System;
using System.Collections.Generic;

#nullable disable

namespace SistemaRestobarSayka2.Models
{
    public partial class Pedido
    {
        public Pedido()
        {
            ProductoPedidos = new HashSet<ProductoPedido>();
        }

        public int IdPedido { get; set; }
        public DateTime Fecha { get; set; }
        public string Estado { get; set; }
        public int UsuarioIdUsuario { get; set; }
        public int MesaIdMesa { get; set; }
        public int? VentaIdVenta { get; set; }

        public virtual Mesa MesaIdMesaNavigation { get; set; }
        public virtual Usuario UsuarioIdUsuarioNavigation { get; set; }
        public virtual Venta VentaIdVentaNavigation { get; set; }
        public virtual ICollection<ProductoPedido> ProductoPedidos { get; set; }
    }
}
