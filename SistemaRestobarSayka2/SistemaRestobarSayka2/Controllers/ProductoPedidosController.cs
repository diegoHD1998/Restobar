using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaRestobarSayka2.Data;
using SistemaRestobarSayka2.Models;
using SistemaRestobarSayka2.Models.StoredProcedure;

namespace SistemaRestobarSayka2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoPedidosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductoPedidosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductoPedidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoPedido>>> GetProductoPedidos()
        {
            var productosPedidos = await _context.ProductoPedidos.ToListAsync();
            return Ok(productosPedidos);
        }

        // GET: api/ProductoPedidos/DePedido/id
        [HttpGet("DePedido/{id}")]
        public async Task<ActionResult<IEnumerable<ProductoPedido>>> GetProductoPedidosDePedido(int id)
        {
            var productosPedidos = await _context.ProductoPedidos.Where(e => e.PedidoIdPedido == id).OrderByDescending(r => r.Hora).ToListAsync();
            return Ok(productosPedidos);
        }

        // GET: api/ProductoPedidos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoPedido>> GetProductoPedido(int id)
        {
            var productoPedido = await _context.ProductoPedidos.FindAsync(id);

            if (productoPedido == null)
            {
                return NotFound("ProductoPedido No Encontrado");
            }

            return Ok(productoPedido);
        }


        // GET api/ProductoPedidos/Bar
        [HttpGet("Bar")]
        public async Task<ActionResult<IEnumerable<SP_ProductoPedido>>> GetSPBar()
        {
            var result = await _context.SP_Productopedido.FromSqlInterpolated($"Exec SP_ProductoPedidoBar").ToListAsync();
            return Ok(result);
        }



        // GET api/ProductoPedidos/Cocina
        [HttpGet("Cocina")]
        public async Task<ActionResult<IEnumerable<SP_ProductoPedido>>> GetSPCocina()
        {
            var result = await _context.SP_Productopedido.FromSqlInterpolated($"Exec SP_ProductoPedidoCocina").ToListAsync();
            return Ok(result);
        }


        // PUT: api/ProductoPedidos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductoPedido(int id, ProductoPedido productoPedido)
        {
            if (id != productoPedido.IdProductoPedido)
            {
                return BadRequest("ProductoPedido No actualizado");
            }

            _context.Entry(productoPedido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoPedidoExists(id))
                {
                    return NotFound("ProductoPedido No Encontrado");
                }
                else
                {
                    throw;
                }
            }

            return Ok(productoPedido);
        }


        // PUT: api/ProductoPedidos/recepcion/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("recepcion/{id}")]
        public async Task<IActionResult> PutRecepcionProductoPedido(int id)
        {

            var productoPedido = await _context.ProductoPedidos.FindAsync(id);

            if ( productoPedido == null)
            {
                return BadRequest("ProductoPedido No encontrado para update");
            }


            productoPedido.Recepcion = true;
            _context.Entry(productoPedido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoPedidoExists(id))
                {
                    return NotFound("ProductoPedido No Encontrado");
                }
                else
                {
                    throw;
                }
            }

            return Ok(productoPedido.IdProductoPedido);
        }




        // POST: api/ProductoPedidos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductoPedido>> PostProductoPedido(ProductoPedido productoPedido)
        {
            try
            {
                productoPedido.Fecha = DateTime.Today;
                productoPedido.Hora = DateTime.Now.TimeOfDay;
                productoPedido.Recepcion = false;
                _context.ProductoPedidos.Add(productoPedido);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductoPedidoExists(productoPedido.IdProductoPedido))
                {
                    return Conflict("Conflicto, Producto Pedido No Guardado");
                }
                else
                {
                    throw;
                }
            }

            return Ok(productoPedido);
        }

        // DELETE: api/ProductoPedidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductoPedido(int id)
        {
            var productoPedido = await _context.ProductoPedidos.FindAsync(id);
            if (productoPedido == null)
            {
                return NotFound("ProductoPedido No Encontrado");
            }

            try
            {
                _context.ProductoPedidos.Remove(productoPedido);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("El ProductoPedido No fue Eliminado");
            }


            return Ok(id);
        }

        private bool ProductoPedidoExists(int id)
        {
            return _context.ProductoPedidos.Any(e => e.IdProductoPedido == id);
        }
    }
}
