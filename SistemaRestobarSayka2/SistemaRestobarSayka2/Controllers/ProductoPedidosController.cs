using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaRestobarSayka2.Data;
using SistemaRestobarSayka2.Models;

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
            return await _context.ProductoPedidos.ToListAsync();
        }

        // GET: api/ProductoPedidos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoPedido>> GetProductoPedido(int id)
        {
            var productoPedido = await _context.ProductoPedidos.FindAsync(id);

            if (productoPedido == null)
            {
                return NotFound();
            }

            return productoPedido;
        }

        // PUT: api/ProductoPedidos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductoPedido(int id, ProductoPedido productoPedido)
        {
            if (id != productoPedido.ProductoIdProducto)
            {
                return BadRequest();
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
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ProductoPedidos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductoPedido>> PostProductoPedido(ProductoPedido productoPedido)
        {
            _context.ProductoPedidos.Add(productoPedido);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductoPedidoExists(productoPedido.ProductoIdProducto))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProductoPedido", new { id = productoPedido.ProductoIdProducto }, productoPedido);
        }

        // DELETE: api/ProductoPedidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductoPedido(int id)
        {
            var productoPedido = await _context.ProductoPedidos.FindAsync(id);
            if (productoPedido == null)
            {
                return NotFound();
            }

            _context.ProductoPedidos.Remove(productoPedido);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoPedidoExists(int id)
        {
            return _context.ProductoPedidos.Any(e => e.ProductoIdProducto == id);
        }
    }
}
