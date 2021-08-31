using System;
using System.Collections.Generic;

#nullable disable

namespace SistemaRestobarSayka2.Models
{
    public partial class Boleta
    {
        public Boleta()
        {
            Venta = new HashSet<Venta>();
        }

        public int IdBoleta { get; set; }
        public string Folio { get; set; }
        public string FormaDePago { get; set; }

        public virtual ICollection<Venta> Venta { get; set; }
    }
}
