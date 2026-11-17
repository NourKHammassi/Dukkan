using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Dukkan.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Dukkan.Infrastructure.Services;

public class CloudinaryUploadService : IUploadService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryUploadService(IConfiguration config)
    {
        var account = new Account(
            config["Cloudinary:CloudName"],
            config["Cloudinary:ApiKey"],
            config["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(Stream fileStream, string fileName)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "dukkan/products",
            Transformation = new Transformation().Width(800).Height(800).Crop("limit").Quality("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception(result.Error.Message);

        return result.SecureUrl.ToString();
    }
}