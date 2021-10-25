﻿using System;
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
            var productosPedidos = await _context.ProductoPedidos.ToListAsync();
            return Ok(productosPedidos);
        }

        // GET: api/ProductoPedidos/5
        [HttpGet("{idPro}/{idPe}/{idPP}")]
        public async Task<ActionResult<ProductoPedido>> GetProductoPedido(int idPro, int idPe, int idPP )
        {
            var productoPedido = await _context.ProductoPedidos.FindAsync(idPro,idPe,idPP);

            if (productoPedido == null)
            {
                return NotFound("ProductoPedido No Encontrado");
            }

            return Ok(productoPedido);
        }

        // PUT: api/ProductoPedidos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductoPedido(int id, ProductoPedido productoPedido)
        {
            if (id != productoPedido.IdProductoPedido)
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
            try
            {
             

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
        [HttpDelete("{idPro}/{idPe}/{idPP}")]
        public async Task<IActionResult> DeleteProductoPedido(int idPro, int idPe, int idPP)
        {
            var productoPedido = await _context.ProductoPedidos.FindAsync(idPro, idPe, idPP);
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


            return Ok(idPP);
        }

        private bool ProductoPedidoExists(int id)
        {
            return _context.ProductoPedidos.Any(e => e.IdProductoPedido == id);
        }
    }
}
