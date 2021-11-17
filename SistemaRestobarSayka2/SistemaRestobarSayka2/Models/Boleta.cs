using System;
using System.Collections.Generic;

#nullable disable

namespace SistemaRestobarSayka2.Models
{
    public partial class Boleta
    {
        public int IdBoleta { get; set; }
        public string Folio { get; set; }
        public string FormaDePago { get; set; }
        public int BoletaVentaBoletaIdVenta { get; set; }

        public virtual Venta BoletaVentaBoletaIdVentaNavigation { get; set; }
    }
}
