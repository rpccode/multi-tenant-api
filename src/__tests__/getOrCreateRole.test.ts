import { AppDataSource } from "../config";
import { getOrCreateRole } from "../modules/auth/services/schemaService";

jest.mock("../../../config/data-source", () => ({
  AppDataSource: {
    createQueryRunner: jest.fn().mockReturnValue({
      query: jest.fn(),
    }),
  },
}));

describe("getOrCreateRole", () => {
  const mockQueryRunner = AppDataSource.createQueryRunner();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería retornar el ID del rol si ya existe", async () => {
    // Cast query to jest.Mock to avoid TypeScript errors
    const mockQuery = mockQueryRunner.query as jest.Mock;
    mockQuery.mockResolvedValueOnce([{ id: 1 }]);

    const roleId = await getOrCreateRole(mockQueryRunner, "tenant_test", "admin");

    expect(mockQueryRunner.query).toHaveBeenCalledWith(
      `SELECT id FROM "tenant_test".roles WHERE name = $1`,
      ["admin"]
    );
    expect(roleId).toBe(1);
  });

  it("debería crear un nuevo rol si no existe y retornar su ID", async () => {
    const mockQuery = mockQueryRunner.query as jest.Mock;
    mockQuery
      .mockResolvedValueOnce([]) // No existing role
      .mockResolvedValueOnce([{ id: 2 }]); // New role created

    const roleId = await getOrCreateRole(mockQueryRunner, "tenant_test", "user");

    expect(mockQueryRunner.query).toHaveBeenCalledTimes(2);
    expect(roleId).toBe(2);
  });
});
