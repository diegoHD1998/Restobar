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
    public class ProductoModificadoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductoModificadoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductoModificadores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoModificador>>> GetProductoModificadors()
        {
            return await _context.ProductoModificadors.ToListAsync();
        }

        // GET: api/ProductoModificadores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoModificador>> GetProductoModificador(int id)
        {
            var productoModificador = await _context.ProductoModificadors.FindAsync(id);

            if (productoModificador == null)
            {
                return NotFound();
            }

            return productoModificador;
        }

        // PUT: api/ProductoModificadores/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductoModificador(int id, ProductoModificador productoModificador)
        {
            if (id != productoModificador.ProductoIdProducto)
            {
                return BadRequest();
            }

            _context.Entry(productoModificador).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoModificadorExists(id))
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

        // POST: api/ProductoModificadores
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductoModificador>> PostProductoModificador(ProductoModificador productoModificador)
        {
            _context.ProductoModificadors.Add(productoModificador);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductoModificadorExists(productoModificador.ProductoIdProducto))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProductoModificador", new { id = productoModificador.ProductoIdProducto }, productoModificador);
        }

        // DELETE: api/ProductoModificadores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductoModificador(int id)
        {
            var productoModificador = await _context.ProductoModificadors.FindAsync(id);
            if (productoModificador == null)
            {
                return NotFound();
            }

            _context.ProductoModificadors.Remove(productoModificador);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoModificadorExists(int id)
        {
            return _context.ProductoModificadors.Any(e => e.ProductoIdProducto == id);
        }
    }
}
