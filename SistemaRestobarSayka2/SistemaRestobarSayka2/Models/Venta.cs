using System;
using System.Collections.Generic;

#nullable disable

namespace SistemaRestobarSayka2.Models
{
    public partial class Venta
    {
        public Venta()
        {
            Pedidos = new HashSet<Pedido>();
        }

        public int IdVenta { get; set; }
        public DateTime Fecha { get; set; }
        public int MontoTotal { get; set; }
        public string Estado { get; set; }
        public int? Propina { get; set; }
        public string FolioBoleta { get; set; }
        public int TipoPagoIdTipoPago { get; set; }
        public int BoletaIdBoleta { get; set; }

        public virtual Boleta BoletaIdBoletaNavigation { get; set; }
        public virtual TipoPago TipoPagoIdTipoPagoNavigation { get; set; }
        public virtual ICollection<Pedido> Pedidos { get; set; }
    }
}
