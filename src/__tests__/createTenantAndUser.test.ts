import bcrypt from "bcrypt";
import { AppDataSource } from "../config";
import { createTenantAndUser } from "../modules/auth/services/schemaService";
import { createAdminTenan } from "../modules/Admin/services/adminServices";

// Mock dependencies
jest.mock("bcrypt");
jest.mock("../../../config/data-source", () => ({
  AppDataSource: {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      query: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    }),
  },
}));
jest.mock("../../Admin/services/adminServices");

describe("createTenantAndUser", () => {
  const mockQueryRunner = AppDataSource.createQueryRunner();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user with a given role", async () => {
    // Mock bcrypt
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    // Mock query runner methods
    const mockQuery = mockQueryRunner.query as jest.Mock;
    mockQuery
      .mockResolvedValueOnce([]) // For getOrCreateRole
      .mockResolvedValueOnce([{ id: 1 }]); // For user insertion

    // Mock createAdminTenan
    const mockCreateAdminTenan = createAdminTenan as jest.Mock;
    mockCreateAdminTenan.mockResolvedValue('paso');

    await createTenantAndUser(
      "tenant_test",
      "testuser",
      "test@example.com",
      "password123",
      "admin",
      1
    );

    expect(mockQueryRunner.connect).toHaveBeenCalled();
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.query).toHaveBeenCalledTimes(3);
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", expect.any(Number));
    expect(createAdminTenan).toHaveBeenCalledWith("tenant_test", 1, 1);
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
  });

  it("should rollback if an error occurs", async () => {
    const mockQuery = mockQueryRunner.query as jest.Mock;
    mockQuery.mockRejectedValue(new Error("Test Error"));

    await expect(
      createTenantAndUser(
        "tenant_test",
        "testuser",
        "test@example.com",
        "password123",
        "admin",
        1
      )
    ).rejects.toThrow("Test Error");

    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
  });
});
