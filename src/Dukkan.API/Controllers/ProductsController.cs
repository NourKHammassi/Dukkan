using System.Security.Claims;
using Dukkan.Application.DTOs.Product;
using Dukkan.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dukkan.API.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
    {
        var products = await _productService.GetAllAsync(filter);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var product = await _productService.GetByIdAsync(id);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<IActionResult> Create(CreateProductDto dto)
    {
        try
        {
            var sellerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var product = await _productService.CreateAsync(sellerId, dto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<IActionResult> Update(Guid id, UpdateProductDto dto)
    {
        try
        {
            var sellerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var product = await _productService.UpdateAsync(sellerId, id, dto);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Seller,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var sellerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _productService.DeleteAsync(sellerId, id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}