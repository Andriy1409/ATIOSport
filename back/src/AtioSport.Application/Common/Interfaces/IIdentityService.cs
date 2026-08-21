namespace AtioSport.Application.Common.Interfaces;

public record RegisterResult(bool Succeeded, IReadOnlyList<string> Errors);

public record CurrentUserDto(Guid Id, string Name, string Email, bool IsAdmin);

public record ClientDto(Guid Id, string Name, string Email, string Phone);

public interface IIdentityService
{
    Task<RegisterResult> RegisterAsync(string name, string email, string phone, string password, CancellationToken cancellationToken = default);
    Task<string?> LoginAsync(string email, string password, CancellationToken cancellationToken = default);
    Task<CurrentUserDto?> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<List<ClientDto>> GetClientsAsync(CancellationToken cancellationToken = default);
}
