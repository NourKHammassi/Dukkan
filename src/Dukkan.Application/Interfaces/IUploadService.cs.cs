namespace Dukkan.Application.Interfaces;

public interface IUploadService
{
    Task<string> UploadImageAsync(Stream fileStream, string fileName);
}