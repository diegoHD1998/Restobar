using System;
using System.Collections.Generic;

#nullable disable

namespace SistemaRestobarSayka2.Models
{
    public partial class TipoPago
    {
        public TipoPago()
        {
            Venta = new HashSet<Venta>();
        }

        public int IdTipoPago { get; set; }
        public string Nombre { get; set; }

        public virtual ICollection<Venta> Venta { get; set; }
    }
}
